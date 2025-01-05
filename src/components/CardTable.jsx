import { useState } from 'react';
import Card from './Card.jsx';
import usePokemonSubset from './usePokemonSubset.js';

export default function CardTable({
  generation,
  gameOn,
  gameStatus,
  incrementScore,
  onGameWon,
  onGameLost,
  pokemonInPlay,
}) {
  const [selectedNames, setSelectedNames] = useState([]);
  const [handId, setHandId] = useState(0);
  const [prevGen, setPrevGen] = useState(generation);
  const [prevGameStatus, setPrevGameStatus] = useState(gameOn);
  const { pokemonToShow } = usePokemonSubset({ pokemonInPlay, selectedNames });

  const gameStartedOrFinished = prevGameStatus !== gameOn;
  const generationChanged = prevGen !== generation;

  // Restart the game if it's a new game or new generation.
  // Avoiding using useEffect as per the React docs: https://react.dev/learn/you-might-not-need-an-effect
  if (gameStartedOrFinished || generationChanged) {
    if (gameOn) {
      setSelectedNames([]);
      setHandId(0);
    }
    setPrevGameStatus(gameOn);
    setPrevGen(generation);
  }

  const handleSuccessfulChoice = (id) => {
    const newClickedIds = selectedNames.concat([id]);
    const gameWon = newClickedIds.length === pokemonInPlay.length;

    incrementScore();
    setSelectedNames(newClickedIds);

    if (gameWon) {
      onGameWon({ pokemon: pokemonInPlay.map((pkmn) => pkmn.name) });
    } else {
      setHandId(handId + 1);
    }
  };

  const handleChoice = (id) => {
    if (!gameOn) return;
    const successfulChoice = !selectedNames.includes(id);

    if (successfulChoice) {
      handleSuccessfulChoice(id);
    } else {
      onGameLost();
    }
  };

  const renderCards = () => {
    const cards = pokemonToShow.map((pokemon) => {
      return (
        <Card
          key={pokemon.name}
          pokemon={pokemon}
          handleClick={handleChoice}
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
