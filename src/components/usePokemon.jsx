import { useState, useEffect } from 'react';

const getPokemonSpeciesURLs = (pkmnBasicData) => {
  return pkmnBasicData.map((pokemon) => pokemon.url);
};

const fetchAllPokemonInGeneration = async (generation) => {
  try {
    const url = `https://pokeapi.co/api/v2/generation/${generation}`;
    const response = await fetch(url);
    const generationData = await response.json();
    const pokemonSpecies = generationData.pokemon_species;

    return pokemonSpecies;
  } catch (err) {
    `Unable to fetch all pokemon: ${err}`;
  }
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

export default function usePokemon(generation) {
  const [allPokemonInGen, setAllPokemonInGen] = useState(null);
  const [previousGen, setPreviousGen] = useState(generation);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchPokemon = async () => {
      setProgress(0);
      if (!ignore) {
        // Set to loading and invalidate previous pokemon
        setIsLoading(true);
        setAllPokemonInGen(null);

        // Fetch data and track progress
        const allPokemon = await fetchAllPokemonInGeneration(generation);
        setProgress(10);
        const speciesURLs = getPokemonSpeciesURLs(allPokemon);
        const speciesData = await fetchPokemonSpeciesData(speciesURLs);
        setProgress(75);
        const pkmnData = await fetchPokemonData(speciesData.map((pokemon) => pokemon.id));
        setProgress(90);

        // Create the final data object
        const pokemon = speciesData.map((pkmn, idx) => ({
          name: pkmn.name,
          data: pkmnData[idx],
          speciesData: pkmn,
        }));

        setAllPokemonInGen(pokemon);
        setPreviousGen(generation);
        setProgress(100);
        setIsLoading(false);
      }
    };

    let ignore = false;
    if (previousGen !== generation || !allPokemonInGen) fetchPokemon();

    return () => {
      ignore = true;
    };
  }, [generation, previousGen, allPokemonInGen]);

  return { allPokemonInGen, isLoading, progress };
}
