import { useState } from 'react';
import Card from './Card.jsx';

export default function CardTable({ pokemon, score, setScore, updateScores }) {
  const [clickedIds, setClickedIds] = useState([]);
  const [gameOn, setGameOn] = useState(true);
  const [gameWon, setGameWon] = useState(false);

  const gameIsWon = clickedIds.length === pokemon.length;

  const _getRandomUnselectedIdx = (max, used) => {
    let randomIdx;
    while (randomIdx === undefined) {
      const randomIdxToTry = Math.floor(Math.random() * max);
      if (!used.includes(randomIdxToTry)) randomIdx = randomIdxToTry;
    }
    return randomIdx;
  };

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

  const _selectPokemonToShow = () => {
    if (gameIsWon) return pokemon;
    let selectedPokemon = [];

    // Checks to make sure at least one pokemon being shown is still unclicked
    const selectionIsValid = (selection) =>
      selection.some((pkmn) => !clickedIds.includes(pkmn.name));

    do {
      selectedPokemon = _selectPokemon();
    } while (!selectionIsValid(selectedPokemon));

    return selectedPokemon;
  };

  const pokemonToShow = _selectPokemonToShow();

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
  };

  return (
    <div className="container">
      <div className="card-table">
        {pokemonToShow.map((pokemon) => {
          return <Card pokemon={pokemon} handleClick={handleClick} key={pokemon.name} />;
        })}
      </div>
      <div className="game-result">
        {gameWon && <p>You win!</p>}
        {!gameOn && !gameWon && <p>You lose! </p>}
        {!gameOn && <button onClick={resetGame}>Play again</button>}
      </div>
    </div>
  );
}
