import { useState, useEffect } from 'react';

const evolutionChainCache = new Map();

export default function useEvolutionChain({ currentPokemon, allPokemon }) {
  const [evolutionChain, setEvolutionChain] = useState(null);

  useEffect(() => {
    if (!currentPokemon) return;
    async function fetchSinglePkmn(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    const fetchPokemonData = async (pkmnID) => {
      const url = `https://pokeapi.co/api/v2/pokemon/${pkmnID}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(`Failed to fetch SINGLE pokemon data: ${error}`);
      }
    };

    const fetchAndFormatData = async (data) => {
      // Fetch the pokemon data and the species data
      const pkmnSpeciesData = await fetchSinglePkmn(data.species.url);
      const pkmnData = await fetchPokemonData(pkmnSpeciesData.id);

      // Combine the data
      const compositeData = {
        name: pkmnData.name,
        data: pkmnData,
        speciesData: pkmnSpeciesData,
      };

      return compositeData;
    };

    const getOrFetchPkmn = async (data) => {
      // Find and return the cached pokemon if it's already loaded
      const cachedPkmn = allPokemon.find((pkmn) => pkmn.name === data.species.name);

      if (cachedPkmn) return cachedPkmn;

      // Otherwise, fetch it
      const fetchedPkmn = await fetchAndFormatData(data);
      return fetchedPkmn;
    };

    const compositeEvolutionChainData = async (evoChainData) => {
      // Get the first pokemon in the evolution chain
      const pkmn = await getOrFetchPkmn(evoChainData);
      const evolutions = evoChainData.evolves_to;

      // If it evolves, recurse over its evolutions
      if (evolutions.length) {
        const evolvesTo = await Promise.all(
          evolutions.map((next) => compositeEvolutionChainData(next)),
        );
        // Return the full pokemon data with the evolution chain data
        return { pkmn, evolvesTo };
      }
      // If the pokemon is the last in the chain, just return the pokemon data
      return { pkmn };
    };

    async function fetchEvolutionChain(url) {
      if (evolutionChainCache.has(url)) {
        return evolutionChainCache.get(url);
      }

      // Fetch the whole evolution chain
      const response = await fetch(url);
      const data = await response.json();

      // Format the chain so the full pokemon data is included along with the evolution chain data
      const compositeData = await compositeEvolutionChainData(data.chain);
      evolutionChainCache.set(url, compositeData);
      return compositeData;
    }

    // Fetch the evolution chain and set it as state
    if (currentPokemon) {
      fetchEvolutionChain(currentPokemon.speciesData.evolution_chain.url)
        .then((data) => setEvolutionChain(data))
        .catch((err) => console.error(err));
    }
  }, [currentPokemon, allPokemon]);

  return { evolutionChain };
}
