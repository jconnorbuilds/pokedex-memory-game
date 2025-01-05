import { useState } from 'react';
import Card from './Card.jsx';
import usePokemonSubset from '../hooks/usePokemonSubset.js';

export default function CardTable({
  generation,
  gameOn,
  gameStatus,
  incrementScore,
  onGameWon,
  onGameLost,
  pokemonInPlay,
}) {
  const [handKey, setHandKey] = useState(0);
  const [prevGen, setPrevGen] = useState(generation);
  const [prevGameStatus, setPrevGameStatus] = useState(gameOn);
  const [selectedNames, setSelectedNames] = useState([]);

  const { pokemonToShow } = usePokemonSubset({ pokemonInPlay, selectedNames });

  const gameStartedOrFinished = prevGameStatus !== gameOn;
  const generationChanged = prevGen !== generation;

  if (gameStartedOrFinished || generationChanged) {
    if (gameOn) {
      setSelectedNames([]);
      setHandKey(0);
    }
    setPrevGameStatus(gameOn);
    setPrevGen(generation);
  }

  const onSuccessfulChoice = (id) => {
    const newClickedIds = selectedNames.concat([id]);
    const gameWon = newClickedIds.length === pokemonInPlay.length;

    incrementScore();
    setSelectedNames(newClickedIds);

    gameWon
      ? onGameWon({ pokemon: pokemonInPlay.map((pkmn) => pkmn.name) })
      : setHandKey(handKey + 1);
  };

  const handleChoice = (id) => {
    if (!gameOn) return;
    const successfulChoice = !selectedNames.includes(id);
    successfulChoice ? onSuccessfulChoice(id) : onGameLost();
  };

  if (!pokemonInPlay) return <p>loading cards...</p>;
  return (
    <div className="card-table">
      <Hand key={handKey}>
        {pokemonToShow.map((pokemon) => (
          <Card
            key={pokemon.name}
            pokemon={pokemon}
            handleClick={handleChoice}
            gameStatus={gameStatus}
          />
        ))}
      </Hand>
    </div>
  );
}

function Hand({ children }) {
  return <>{children}</>;
}
