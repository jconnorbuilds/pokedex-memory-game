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

  const ensureFullDataIsLoaded = useCallback(
    async (pkmnId) => {
      const pkmn = Object.values(allPokemon).find((p) => p.id === currentPokemonId);
      if (pkmn?.fullyLoaded === false) await fetchPokemonDetails(pkmnId);
    },
    [allPokemon, fetchPokemonDetails, currentPokemonId],
  );

  const fetchEvoChain = useCallback(
    async (evoChainData) => {
      const pkmnId = getPkmnIdByName(evoChainData.species.name, allPokemon);
      await ensureFullDataIsLoaded(pkmnId); // Fetch the full pokemon data if it hasn't been loaded yet

      if (evoChainData.evolves_to.length) {
        const evolvesTo = await Promise.all(
          evoChainData.evolves_to.map((next) => fetchEvoChain(next)),
        );
        return { pkmnId, evolvesTo };
      }
      return { pkmnId };
    },
    [allPokemon, ensureFullDataIsLoaded],
  );

  useEffect(() => {
    const currentPkmn = Object.values(allPokemon).find(
      (pkmn) => pkmn.id === currentPokemonId,
    );
    if (!currentPkmn) return;

    async function fetchEvolutionChain(url) {
      if (evolutionChainCache.has(url)) {
        return evolutionChainCache.get(url);
      }

      try {
        const evolutionChain = await fetch(url).then((res) => res.json());

        // Format the evolution chain.
        // Pkmn ids can be used as references to get the latest data from the global pokemon dictionary.
        // Fetches the evolution chain and loads the pokemon data for each pokemon in the chain
        const formattedEvoChain = await fetchEvoChain(evolutionChain.chain);

        // Cache the evolution chain
        evolutionChainCache.set(url, formattedEvoChain);
        return formattedEvoChain;
      } catch (error) {
        console.error('Failed to fetch evolution chain:', error);
        throw error;
      }
    }

    // Fetch the evolution chain and set it as state
    if (currentPkmn?.fullyLoaded) {
      setLoading(true);
      fetchEvolutionChain(currentPkmn.speciesData.evolution_chain.url)
        .then((data) => setEvolutionChain(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [currentPokemonId, allPokemon, fetchPokemonDetails, fetchEvoChain]);

  return { evolutionChain, loading };
}
