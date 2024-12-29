import { useEffect, useState } from 'react';

const SHINY_ODDS = 20; //Full odds is 1 in 8192, post-Gen 6 is 1 in 4096
const rollForShiny = () => Math.floor(Math.random() * 65536) < 65536 / SHINY_ODDS;

export default function usePokemonInPlay(
  allPokemonInGeneration,
  needsStarters,
  levelSize,
) {
  const [pokemonInPlay, setPokemonInPlay] = useState(null);
  const [needsNewPkmn, setNeedsNewPkmn] = useState(true);

  useEffect(() => {
    const generateSelection = () => {
      if (!ignore) {
        if (!allPokemonInGeneration) return;

        const _getRandomIdx = (range, offset = 0) =>
          Math.floor(Math.random() * range - offset) + offset;

        const _getRandomPokemon = () => {
          const randomIdx = _getRandomIdx(
            allPokemonInGeneration.length,
            selectedPokemon.length,
          );
          return allPokemonInGeneration[randomIdx];
        };

        // Starter pokemon to always include on the first round
        const selectedPokemon = needsStarters
          ? [...allPokemonInGeneration.slice(0, 3)]
          : [];
        const selectSinglePokemon = () => {
          // if (ignore) return;
          const randomPokemon = _getRandomPokemon();

          // Check if data is unique. If unique, roll for shiny and then return.
          if (!selectedPokemon.includes(randomPokemon)) {
            Object.defineProperty(randomPokemon, 'isShiny', {
              value: rollForShiny(),
            });
            return randomPokemon;
          }

          // Duplicate pokemon error handling
          if (selectedPokemon.length > new Set(selectedPokemon).length) {
            throw new Error(`Duplicate pokemon! ${selectedPokemon}`);
          }
        };

        for (let i = 0; i < 25; i++) {
          try {
            const randomPokemon = selectSinglePokemon(); // Can be undefined, which is a bug. This whole try/catch block should probably be reworked.
            selectedPokemon.push(randomPokemon);

            if (selectedPokemon.length === levelSize) break;
          } catch (err) {
            console.error(err, `pkmn to fetch: ${selectedPokemon}`);
          }
        }

        setPokemonInPlay(selectedPokemon);
        setNeedsNewPkmn(false);
      }
    };

    let ignore = false;
    generateSelection();

    return () => {
      ignore = true;
    };

    // Relies on needsNewPkmn to trigger new card generation after each hand
  }, [allPokemonInGeneration, needsStarters, levelSize, needsNewPkmn]);

  return {
    pokemonInPlay,
    requestNewPokemon: () => setNeedsNewPkmn(true),
  };
}
