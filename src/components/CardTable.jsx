import { useMemo, useState, useEffect } from 'react';
import Card from './Card.jsx';

export default function CardTable({ pkmnData, gameWon, gameOn, gameStatusCallback }) {
  const [clickedIds, setClickedIds] = useState([]);
  const [handId, setHandId] = useState(0);

  useEffect(() => {
    if (gameOn) {
      setClickedIds([]);
      setHandId(0);
    }
  }, [gameOn]);

  const handleClick = (id) => {
    if (!gameOn) return;

    const successfulChoice = !clickedIds.includes(id);

    if (successfulChoice) {
      const newClickedIds = clickedIds.concat([id]);
      setClickedIds(newClickedIds);

      if (newClickedIds.length === pkmnData.length) {
        gameStatusCallback('win');
      } else {
        gameStatusCallback('playing');
        setHandId(handId + 1);
      }
    } else {
      gameStatusCallback('lose');
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
    // console.log(pkmnData.map((pokemon) => pokemon.name));
    // Return all pokemon if player has won
    if (clickedIds.length === pkmnData.length) {
      return pkmnData;
    }
    console.log('selecting pkmn');
    const _selectPokemon = () => {
      const numberOfPkmn = Math.floor(pkmnData.length * 0.75);
      const usedIdxs = [];
      const selectedPokemon = [];

      for (let i = 0; i < numberOfPkmn; i++) {
        const idx = _getRandomUnselectedIdx(pkmnData.length, usedIdxs);
        selectedPokemon.push(pkmnData[idx]);
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
  }, [clickedIds, pkmnData]);

  const renderCards = () => {
    const cards = pokemonToShow.map((pokemon) => {
      const singlePkmnData = pkmnData.find((pkmn) => pkmn.name === pokemon.name);
      return (
        <Card
          key={pokemon.name}
          pkmnData={singlePkmnData}
          handleClick={handleClick}
          gameWon={gameWon}
          colorsOn={true}
        />
      );
    });
    return cards;
  };

  return (
    <div className="card-table">
      <Hand key={handId}>{renderCards()}</Hand>
    </div>
  );
}

function Hand({ children }) {
  return <>{children}</>;
}
