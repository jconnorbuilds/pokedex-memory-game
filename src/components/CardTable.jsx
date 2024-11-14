import { useMemo, useState } from 'react';
import Card from './Card.jsx';

export default function CardTable({
  pokemon,
  score,
  updateScores,
  gameWon,
  setGameWon,
  gameOn,
  setGameOn,
  resetGame,
  clickedIds,
  setClickedIds,
  handId,
  setHandId,
  genCompletion,
  setGenCompletion,
  generation,
}) {
  // const [colorsOn, setColorsOn] = useState(true);

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
    // Return all pokemon if player has won
    if (gameWon) return pokemon;

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

    // Return a valid subset of pokemon if game is still in play
    let selectedPokemon;
    do {
      selectedPokemon = _selectPokemon();
    } while (!_selectionIsValid(selectedPokemon));

    return selectedPokemon;
  }, [clickedIds, gameWon, pokemon]);

  const choiceSucceeded = (id) => !clickedIds.includes(id);

  const handleClick = (id) => {
    if (gameOn) {
      if (choiceSucceeded(id)) {
        const newClickedIds = clickedIds.concat([id]);
        setClickedIds(newClickedIds);
        updateScores(score + 1);

        // Check if player wins round
        if (newClickedIds.length === pokemon.length) {
          // Keep track of seen pokemon per generation, without duplicates
          const pokemonNames = pokemon.map((pkmn) => pkmn.name);
          const newData = {
            [generation]: genCompletion[generation]
              ? [...new Set(genCompletion[generation].concat(pokemonNames))]
              : pokemonNames,
          };

          setGameOn(false);
          setGameWon(true);
          setGenCompletion({ ...genCompletion, ...newData });
        }
        setHandId(handId + 1);
      } else {
        setGameOn(false);
      }
    }
  };

  console.log(genCompletion);
  localStorage.setItem('genCompletion', JSON.stringify(genCompletion));

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
              colorsOn={true}
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
