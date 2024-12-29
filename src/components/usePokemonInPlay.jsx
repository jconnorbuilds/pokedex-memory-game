import { useEffect, useState } from 'react';

const SHINY_ODDS = 20; //Full odds is 1 in 8192, post-Gen 6 is 1 in 4096
const rollForShiny = () => Math.floor(Math.random() * 65536) < 65536 / SHINY_ODDS;

export default function usePokemonInPlay(allPokemonInGen, needsStarters, levelSize) {
  const [pokemonInPlay, setPokemonInPlay] = useState(null);
  const [needsNewPkmn, setNeedsNewPkmn] = useState(true);

  useEffect(() => {
    const generateSelection = () => {
      if (!ignore) {
        if (!allPokemonInGen) return;

        const _getRandomIdx = (range, offset = 0) =>
          Math.floor(Math.random() * range - offset) + offset;

        const _getRandomPokemon = () => {
          const randomIdx = _getRandomIdx(allPokemonInGen.length, selectedPokemon.length);
          if (!allPokemonInGen[randomIdx])
            console.info(`Tried an invalid index: ${randomIdx}`);
          return allPokemonInGen[randomIdx];
        };

        // Starter pokemon to always include on the first round
        const selectedPokemon = needsStarters ? [...allPokemonInGen.slice(0, 3)] : [];

        const selectSinglePokemon = () => {
          if (ignore) return;
          const randomPokemon = _getRandomPokemon();
          // Check if data is unique. If unique, roll for shiny and then return.
          if (!selectedPokemon.map((pkmn) => pkmn.name).includes(randomPokemon.name)) {
            // if (!randomPokemon) throw new Error('Error getting a random pokemon');

            Object.defineProperty(randomPokemon, 'isShiny', {
              value: rollForShiny(),
              configurable: true,
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
            if (!randomPokemon) return;
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
  }, [allPokemonInGen, needsStarters, levelSize, needsNewPkmn]);

  return {
    pokemonInPlay,
    requestNewPokemon: () => setNeedsNewPkmn(true),
  };
}
