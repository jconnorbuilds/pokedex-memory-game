import { useState, useEffect } from 'react';

const SHINY_ODDS = 20; //Full odds is 1 in 8192, post-Gen 6 is 1 in 4096

const getPokemonSpeciesURLs = (pkmnBasicData) =>
  pkmnBasicData.map((pokemon) => pokemon.url);

const getAllPokemonInGeneration = async (generation) => {
  const url = `https://pokeapi.co/api/v2/generation/${generation}`;
  const result = await fetch(url);
  const generationData = await result.json();
  const pokemonSpecies = generationData.pokemon_species;

  return pokemonSpecies;
};

const fetchPokemonSpeciesData = async (urls) => {
  try {
    const promises = urls.map((url) => fetch(url));
    const responses = await Promise.all(promises);
    const data = await Promise.all(responses.map((response) => response.json()));
    return data;
  } catch (err) {
    throw new Error(`Failed to fetch species data for urls: ${urls} /
      Error: ${err}`);
  }
};

const fetchPokemonData = async (pkmnIDs) => {
  const urls = pkmnIDs.map((pkmnID) => `https://pokeapi.co/api/v2/pokemon/${pkmnID}`);
  try {
    const promises = urls.map((url) => fetch(url));
    const responses = await Promise.all(promises);
    const data = await Promise.all(responses.map((response) => response.json()));
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch pokemon data: ${error}`);
  }
};

export default function usePokemon(showStarters, generation, level) {
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonSpeciesData, setPokemonSpeciesData] = useState(null);
  const [needsNewPkmn, setNeedsNewPkmn] = useState(true);

  useEffect(() => {
    const LEVELS = { easy: 4, medium: 8, hard: 12 };
    const rollForShiny = () => Math.floor(Math.random() * 65536) < 65536 / SHINY_ODDS;

    const fetchPokemon = async () => {
      if (!needsNewPkmn) return;
      let pkmnToFetch = [];
      const allPokemon = await getAllPokemonInGeneration(generation);
      // Starter pokemon to always include on the first round
      if (showStarters[generation - 1]) {
        pkmnToFetch.push(allPokemon[0], allPokemon[1], allPokemon[2]);
      }

      const _getRandomIdx = (range, offset = 0) =>
        Math.floor(Math.random() * range - offset) + offset;

      const _getRandomPokemon = () =>
        allPokemon[_getRandomIdx(allPokemon.length, pkmnToFetch.length)];

      const selectPokemon = () => {
        const randomPokemon = _getRandomPokemon();
        if (!pkmnToFetch.includes(randomPokemon)) return randomPokemon;

        // Duplicate pokemon error handling
        if (pkmnToFetch.length > new Set(pkmnToFetch).length) {
          throw new Error(`Duplicate pokemon! ${pkmnToFetch}`);
        }
      };

      while (pkmnToFetch.length < LEVELS[level]) {
        try {
          const randomPokemon = selectPokemon(); // Can be undefined, which is a bug. This whole try/catch block should probably be reworked.
          pkmnToFetch.push(randomPokemon);
        } catch (err) {
          console.error(err);
        }
      }

      if (!ignore) {
        setNeedsNewPkmn(false);
        const speciesURLs = getPokemonSpeciesURLs(pkmnToFetch);
        const speciesData = await fetchPokemonSpeciesData(speciesURLs);
        const pkmnData = await fetchPokemonData(speciesData.map((pokemon) => pokemon.id));

        pkmnData.forEach((pkmn) =>
          Object.defineProperty(pkmn, 'isShiny', { value: rollForShiny() }),
        );

        setPokemonSpeciesData(speciesData);
        setPokemonData(pkmnData);
      }
    };

    let ignore = false;
    fetchPokemon();

    return () => {
      ignore = true;
    };
  }, [generation, level, needsNewPkmn, showStarters]);

  return {
    pokemonData,
    pokemonSpeciesData,
    requestNewPokemon: () => setNeedsNewPkmn(true),
  };
}
