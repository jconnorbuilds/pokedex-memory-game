import { useState, useEffect } from 'react';

const SHINY_ODDS = 20; //Full odds is 1 in 8192, post-Gen 6 is 1 in 4096

export default function usePokemon(showStarters, generation, level) {
  const [pokemon, setPokemon] = useState(null);
  const [pokemonSpeciesData, setPokemonSpeciesData] = useState(null);
  const [needsNewPkmn, setNeedsNewPkmn] = useState(true);

  useEffect(() => {
    const LEVELS = { easy: 4, medium: 8, hard: 12 };
    const rollForShiny = () => Math.floor(Math.random() * 65536) < 65536 / SHINY_ODDS;

    const fetchPokemon = async () => {
      if (!needsNewPkmn) return;
      // Can't I just change this to the /pokemon endpoint and filter the data by generation?
      const url = `https://pokeapi.co/api/v2/generation/${generation}`;
      const result = await fetch(url);
      const generationData = await result.json();
      const pokemonSpecies = generationData.pokemon_species;

      // Starter pokemon to always include on the first round
      const starterPokemon = showStarters[generation - 1]
        ? [pokemonSpecies[0], pokemonSpecies[1], pokemonSpecies[2]]
        : [];

      starterPokemon.forEach((pkmn) =>
        Object.defineProperty(pkmn, 'isShiny', { value: rollForShiny() }),
      );

      const selectedPokemon = [...starterPokemon];

      const _getRandomIdx = (range, offset = 0) =>
        Math.floor(Math.random() * range - offset) + offset;

      const _getRandomPokemon = () =>
        pokemonSpecies[_getRandomIdx(pokemonSpecies.length, starterPokemon.length)];

      const selectPokemon = () => {
        const randomPokemon = _getRandomPokemon();
        if (!selectedPokemon.includes(randomPokemon)) return randomPokemon;

        // Duplicate pokemon error handling
        if (selectedPokemon.length > new Set(selectedPokemon).length) {
          throw new Error(`Duplicate pokemon! ${selectedPokemon}`);
        }
      };

      while (selectedPokemon.length < LEVELS[level]) {
        try {
          const randomPokemon = selectPokemon(); // Can be undefined, which is a bug. This whole try/catch block should probably be reworked.
          const isShiny = rollForShiny();
          Object.defineProperty(randomPokemon, 'isShiny', { value: isShiny });
          selectedPokemon.push(randomPokemon);
        } catch (err) {
          console.error(err);
        }
      }

      if (!ignore) {
        setPokemon(selectedPokemon);
        setNeedsNewPkmn(false);
      }
    };

    let ignore = false;
    fetchPokemon();

    return () => {
      ignore = true;
    };
  }, [generation, level, needsNewPkmn, showStarters]);

  return { pokemon, requestNewPokemon: () => setNeedsNewPkmn(true) };
}
