import { useState, useEffect } from 'react';
import { getPkmnIdxByName } from '../utils/utils.js';

const evolutionChainCache = new Map();

export default function useEvolutionChain({
  currentPokemonId,
  allPokemon,
  fetchPokemonDetails,
}) {
  const [evolutionChain, setEvolutionChain] = useState(null);

  useEffect(() => {
    const currPkmn = allPokemon[currentPokemonId];
    if (!currPkmn) return;
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

      // Linear search, could be more optimal
      // const cachedPkmn = Object.entries(allPokemon).find(
      //   ([idx, pkmn]) => pkmn.name === data.species.name,
      // )[1];

      // if (cachedPkmn?.fullyLoaded) return cachedPkmn;

      // // Otherwise, fetch it
      // // console.log('DATA', data);
      // const pkmnIdx = getPkmnIdxByName(data.species.name, allPokemon);
      // console.log('PKMN IDX', pkmnIdx);
      // const fetchedPkmn = await fetchPokemonDetails({ singlePkmnId: pkmnIdx });
      // console.log('FETCHED PKMN', fetchedPkmn);
      // return fetchedPkmn;
      const pkmnIdx = getPkmnIdxByName(data.species.name, allPokemon);
      if (!allPokemon[pkmnIdx]?.fullyLoaded) {
        await fetchPokemonDetails({ singlePkmnId: pkmnIdx });
        // console.log('FETCHED PKMN', allPokemon[pkmnIdx]);
      }
      return allPokemon[pkmnIdx];
    };

    const compositeEvolutionChainData = async (evoChainData) => {
      // Get the first pokemon in the evolution chain
      // const pkmn = await getOrFetchPkmn(evoChainData);
      const pkmnIdx = getPkmnIdxByName(evoChainData.species.name, allPokemon);
      if (!allPokemon[pkmnIdx]?.fullyLoaded) {
        await fetchPokemonDetails({ singlePkmnId: pkmnIdx });
        // console.log('FETCHED PKMN', allPokemon[pkmnIdx]);
      }
      const pkmn = pkmnIdx;
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

      // Format the chain so the full pokemon data is included
      // along with the evolution chain data
      const compositeData = await compositeEvolutionChainData(data.chain);
      // console.log('COMPOSITE CHAIN DATA', compositeData);
      evolutionChainCache.set(url, compositeData);
      return compositeData;
    }

    // Fetch the evolution chain and set it as state
    if (currPkmn?.fullyLoaded) {
      fetchEvolutionChain(currPkmn.speciesData.evolution_chain.url)
        .then((data) => setEvolutionChain(data))
        .catch((err) => console.error(err));
    }
  }, [currentPokemonId, allPokemon, fetchPokemonDetails]);

  return { evolutionChain };
}
