import { useState, useEffect, useCallback } from 'react';
import { getPkmnIdByName } from '../utils/utils.js';

const evolutionChainCache = new Map();

export default function useEvolutionChain({
  currentPokemonId,
  allPokemon,
  fetchPokemonDetails,
}) {
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatEvoChainAndFetchData = useCallback(
    async (evoChainData) => {
      const pkmnId = getPkmnIdByName(evoChainData.species.name, allPokemon);
      const pkmn = Object.values(allPokemon).find(
        (pokemon) => pokemon.id === currentPokemonId,
      );
      // Fetch the pokemon data if it hasn't been loaded yet
      if (!pkmn?.fullyLoaded) {
        await fetchPokemonDetails({ singlePkmnId: pkmnId });
      }

      // If it evolves, recurse over its evolutions
      const evolutions = evoChainData.evolves_to;
      if (evolutions.length) {
        const evolvesTo = await Promise.all(
          evolutions.map((next) => formatEvoChainAndFetchData(next)),
        );
        return { pkmnId, evolvesTo };
      }
      // If the pokemon is the last in the chain, just return the pokemon index
      return { pkmnId };
    },
    [allPokemon, fetchPokemonDetails, currentPokemonId],
  );

  useEffect(() => {
    const currPkmn = Object.values(allPokemon).find(
      (pkmn) => pkmn.id === currentPokemonId,
    );
    if (!currPkmn) return;

    async function fetchEvolutionChain(url) {
      if (evolutionChainCache.has(url)) {
        return evolutionChainCache.get(url);
      }

      try {
        const evolutionChain = await fetch(url).then((res) => res.json());

        // Format the evolution chain to use indices as references.
        // This will allow us to easily get the latest data from the global pokemon dictionary.
        const formattedEvoChain = await formatEvoChainAndFetchData(evolutionChain.chain);
        console.log('COMPOSITE CHAIN DATA', formattedEvoChain);
        evolutionChainCache.set(url, formattedEvoChain);
        return formattedEvoChain;
      } catch (error) {
        console.error('Failed to fetch evolution chain:', error);
        throw error;
      }
    }

    // Fetch the evolution chain and set it as state
    if (currPkmn?.fullyLoaded) {
      setLoading(true);
      fetchEvolutionChain(currPkmn.speciesData.evolution_chain.url)
        .then((data) => setEvolutionChain(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [currentPokemonId, allPokemon, fetchPokemonDetails, formatEvoChainAndFetchData]);

  return { evolutionChain, loading };
}
