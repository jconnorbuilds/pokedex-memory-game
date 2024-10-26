import { useState } from 'react';
import Card from './Card.jsx';
import Scoreboard from './Scoreboard.jsx';

export default function CardTable({ pokemon }) {
  const [clickedIds, setClickedIds] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const allPokemonClicked = clickedIds.length === pokemon.length;
  const gameIsWon = allPokemonClicked;

  const updateScores = (newScore) => {
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);
  };

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
    if (!clickedIds.includes(id)) {
      const newClickedIds = clickedIds.concat(id);
      setClickedIds(newClickedIds);
      updateScores(score + 1);
    } else {
      // Game over
      setScore(0);
      setClickedIds([]);
    }
  };

  return (
    <>
      <div className="card-table">
        {pokemonToShow.map((pokemon) => {
          return <Card pokemon={pokemon} handleClick={handleClick} key={pokemon.name} />;
        })}
      </div>
      <Scoreboard score={score} bestScore={bestScore} />
      {gameIsWon && <p>You win!</p>}
    </>
  );
}
