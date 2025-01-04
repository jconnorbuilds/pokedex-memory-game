import { useMemo, useState } from 'react';
import Card from './Card.jsx';

export default function CardTable({
  gameStatus,
  reportGameStatus,
  gameOn,
  generation,
  incrementScore,
  resetScore,
  updateGameProgress,
  pokemonInPlay,
  drawStarters,
  dontDrawStarters,
}) {
  const [clickedIds, setClickedIds] = useState([]);
  const [handId, setHandId] = useState(0);
  const [prevGen, setPrevGen] = useState(generation);
  const [prevGameStatus, setPrevGameStatus] = useState(gameOn);

  const gameStartedOrFinished = prevGameStatus !== gameOn;
  const generationChanged = prevGen !== generation;
  // Restart the game if it's a new game or new generation.
  // Avoiding using useEffect as per the React docs: https://react.dev/learn/you-might-not-need-an-effect
  if (gameStartedOrFinished || generationChanged) {
    if (gameOn) {
      setClickedIds([]);
      setHandId(0);
    }
    setPrevGameStatus(gameOn);
    setPrevGen(generation);
  }

  const handleClick = (id) => {
    if (!gameOn) return;

    const successfulChoice = !clickedIds.includes(id);

    if (successfulChoice) {
      incrementScore();

      const newClickedIds = clickedIds.concat([id]);
      setClickedIds(newClickedIds);

      if (newClickedIds.length === pokemonInPlay.length) {
        updateGameProgress(
          { pokemon: pokemonInPlay.map((pkmn) => pkmn.name) },
          generation,
        );
        if (drawStarters) dontDrawStarters();
        reportGameStatus('won');
      } else {
        reportGameStatus('playing');
        setHandId(handId + 1);
      }
    } else {
      reportGameStatus('lost');
      resetScore();
    }
  };

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
    if (clickedIds.length === pokemonInPlay.length) {
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
      selection.some((pkmn) => !clickedIds.includes(pkmn.name));

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
  }, [clickedIds, pokemonInPlay]);

  const renderCards = () => {
    if (!pokemonInPlay) return;
    const cards = pokemonToShow.map((pokemon) => {
      return (
        <Card
          key={pokemon.name}
          pokemon={pokemon}
          handleClick={handleClick}
          gameStatus={gameStatus}
        />
      );
    });
    return cards;
  };

  return (
    <div className="card-table">
      {pokemonInPlay ? (
        <Hand key={handId}>{renderCards()}</Hand>
      ) : (
        <p>loading cards...</p>
      )}
    </div>
  );
}

function Hand({ children }) {
  return <>{children}</>;
}
