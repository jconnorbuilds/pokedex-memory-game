import { useMemo } from 'react';

export default function usePokemonSubset({ pokemonInPlay, clickedIds: used }) {
  // Gets an idx between 0 and <max> that's not present in the <used> array
  const _getRandomUnselectedIdx = (max, used) => {
    let idx;
    const isUnusedIdx = (idx) => !used.includes(idx);

    do {
      const randomIdx = Math.floor(Math.random() * max);
      if (isUnusedIdx(randomIdx)) idx = randomIdx;
    } while (idx === undefined);

    return idx;
  };

  // Selects a random subset of the <pokemon> prop
  const pokemonToShow = useMemo(() => {
    if (!pokemonInPlay) return;
    // Return all pokemon if player has won
    if (used.length === pokemonInPlay.length) {
      return pokemonInPlay;
    }

    const _selectPokemon = () => {
      const numberOfPkmn = Math.floor(pokemonInPlay.length * 0.75);
      const usedIdxs = [];
      const selectedPokemon = [];

      for (let i = 0; i < numberOfPkmn; i++) {
        const idx = _getRandomUnselectedIdx(pokemonInPlay.length, usedIdxs);
        selectedPokemon.push(pokemonInPlay[idx]);
        usedIdxs.push(idx);
      }

      return selectedPokemon;
    };

    const _selectionIsValid = (selection) =>
      selection.some((pkmn) => !used.includes(pkmn.name));

    // Return a valid subset of pokemon if game is still in play
    let selectedPokemon;

    for (let i = 0; i < 50; i++) {
      selectedPokemon = _selectPokemon();
      if (_selectionIsValid(selectedPokemon)) break;
    }

    if (!_selectionIsValid(selectedPokemon)) {
      console.error('Unable to make valid pokemon selection, fix your code');
    }

    return selectedPokemon;
  }, [used, pokemonInPlay]);

  return { pokemonToShow };
}
