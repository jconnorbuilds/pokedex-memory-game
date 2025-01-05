import { useMemo } from 'react';

// Fisher-Yates shuffle algorithm
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomSubset(array, subsetSize) {
  const shuffled = shuffle(array);
  return shuffled.slice(0, subsetSize);
}

export default function usePokemonSubset({ pokemonInPlay, selectedNames }) {
  // Gets an idx between 0 and <max> that's not present in the <used> array

  function isValidSubset(subset, usedNames) {
    return subset.some((pkmn) => !usedNames.includes(pkmn.name));
  }

  // Selects a random subset of the <pokemon> prop
  const pokemonToShow = useMemo(() => {
    if (!pokemonInPlay) return;
    if (selectedNames.length === pokemonInPlay.length) {
      // Return all pokemon if player has won
      return pokemonInPlay;
    }

    const subsetSize = Math.floor(pokemonInPlay.length * 0.75);

    for (let attempt = 0; attempt < 50; attempt++) {
      const selection = getRandomSubset(pokemonInPlay, subsetSize);
      if (isValidSubset(selection, selectedNames)) return selection;
    }

    // TODO: make this more robust
    console.error('Unable to make valid pokemon selection in 50 attempts');
    return [];
  }, [selectedNames, pokemonInPlay]);

  return { pokemonToShow };
}
