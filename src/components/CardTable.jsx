import { useMemo, useState } from 'react';
import Card from './Card.jsx';

export default function CardTable({ pokemon, score, setScore, updateScores }) {
  const [clickedIds, setClickedIds] = useState([]);
  const [gameOn, setGameOn] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [handId, setHandId] = useState(0);
  const [colorsOn, setColorsOn] = useState(true);

  const gameIsWon = clickedIds.length === pokemon.length;

  const pokemonToShow = useMemo(() => {
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
    const _selectPokemon = () => {
      const numberOfPkmn = Math.floor(pokemon.length * 0.75);
      const usedIdxs = [];
      const selectedPokemon = [];
      for (let i = 0; i < numberOfPkmn; i++) {
        const idx = _getRandomUnselectedIdx(pokemon.length, usedIdxs);
        selectedPokemon.push(pokemon[idx]);
        usedIdxs.push(idx);
      }

      return selectedPokemon;
    };

    const _selectionIsValid = (selection) =>
      selection.some((pkmn) => !clickedIds.includes(pkmn.name));
    // Return all pokemon if player has won
    if (gameIsWon) return pokemon;

    // Return a valid subset of pokemon if game is still in play
    let selectedPokemon;
    do {
      selectedPokemon = _selectPokemon();
    } while (!_selectionIsValid(selectedPokemon));

    return selectedPokemon;
  }, [clickedIds, gameIsWon, pokemon]);

  const handleClick = (id) => {
    if (gameOn) {
      if (!clickedIds.includes(id)) {
        const newClickedIds = clickedIds.concat(id);
        setClickedIds(newClickedIds);
        updateScores(score + 1);

        if (newClickedIds.length === pokemon.length) {
          setGameOn(false);
          setGameWon(true);
        }
        setHandId(handId + 1);
      } else {
        setGameOn(false);
      }
    }
  };

  const resetGame = () => {
    setGameOn(true);
    setGameWon(false);
    setScore(0);
    setClickedIds([]);
    setHandId(0);
  };

  return (
    <div className="container">
      <Hand key={handId}>
        {pokemonToShow.map((pokemon) => {
          return (
            <Card
              pokemon={pokemon}
              handleClick={handleClick}
              gameWon={gameWon}
              key={pokemon.name}
              colorsOn={colorsOn}
            />
          );
        })}
      </Hand>
      <div className="game-result">
        {gameWon && <p>You win!</p>}
        {!gameOn && !gameWon && <p>You lose! </p>}
        {!gameOn && <button onClick={resetGame}>Play again</button>}
      </div>
    </div>
  );
}

function Hand({ id, children }) {
  return (
    <div className="card-table" key={id}>
      {children}
    </div>
  );
}
