import { useState, useMemo, useEffect, useCallback } from 'react';
import Card from './Card.jsx';
import usePokemonSubset from '../hooks/usePokemonSubset.js';
import { get } from 'jquery';

export default function CardTable({
  generation,
  gameOn,
  gameStatus,
  pokemonDict,
  incrementScore,
  onGameWon,
  onGameLost,
  pokemonInPlay,
  fetchPokemonDetails,
}) {
  const [handKey, setHandKey] = useState(0);
  const [prevGen, setPrevGen] = useState(generation);
  const [prevGameStatus, setPrevGameStatus] = useState(gameOn);
  const [selectedIds, setSelectedIds] = useState([]);

  const { pkmnIdsToShow } = usePokemonSubset({
    pokemonInPlay,
    selectedIds,
  });

  const getPkmnById = useCallback(
    (id) => {
      return Object.values(pokemonDict).find((pkmn) => pkmn.id === id);
    },
    [pokemonDict],
  );

  useEffect(() => {
    if (!pkmnIdsToShow) return;
    pkmnIdsToShow.forEach((id) => {
      const pkmn = getPkmnById(id);
      if (!pkmn?.fullyLoaded) {
        fetchPokemonDetails({ singlePkmnId: id });
      }
    });
  }, [pkmnIdsToShow, pokemonDict, fetchPokemonDetails, getPkmnById]);

  const pokemonToShow = useMemo(() => {
    if (!pkmnIdsToShow) return [];
    return pkmnIdsToShow.map((id) => getPkmnById(id));
  }, [pkmnIdsToShow, getPkmnById]);

  const gameStartedOrFinished = prevGameStatus !== gameOn;
  const generationChanged = prevGen !== generation;

  if (gameStartedOrFinished || generationChanged) {
    if (gameOn) {
      setSelectedIds([]);
      setHandKey(0);
    }
    setPrevGameStatus(gameOn);
    setPrevGen(generation);
  }

  const onSuccessfulChoice = (id) => {
    const newClickedIds = selectedIds.concat([id]);
    const gameWon = newClickedIds.length === pokemonInPlay.length;

    incrementScore();
    setSelectedIds(newClickedIds);

    gameWon ? onGameWon({ pokemon: pokemonInPlay }) : setHandKey(handKey + 1);
  };

  const handleChoice = (id) => {
    if (!gameOn) return;
    const successfulChoice = !selectedIds.includes(id);
    successfulChoice ? onSuccessfulChoice(id) : onGameLost();
  };

  if (!pokemonInPlay || !pokemonToShow) return <p>loading cards...</p>;
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
