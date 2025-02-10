import useStarters from '../hooks/useStarters.js';
import usePokemonInPlay from '../hooks/usePokemonInPlay.js';
import styles from '../styles/GameResult.module.css';

import CardTable from './CardTable.jsx';
import GameResult from './GameResult.jsx';
import Button from './Button.jsx';
import useGameProgress from '../hooks/useGameProgress.js';

export default function GameArea({
  style,
  level,
  pokemonDict,
  allPokemonInGen,
  generation,
  incrementScore,
  resetScore,
  gameOn,
  gameStatus,
  nextGame,
  reportGameStatus,
  fetchPokemonDetails,
}) {
  const { updateGameProgress } = useGameProgress();
  const { includeStarters, dontIncludeStarters } = useStarters(generation);
  const { pokemonInPlay, requestNewPokemon } = usePokemonInPlay(
    allPokemonInGen,
    includeStarters,
    level.size,
  );

  const startNextGame = () => {
    if (includeStarters) dontIncludeStarters();
    if (gameStatus === 'won') {
      requestNewPokemon();
    }
    nextGame();
  };

  const handleGameWon = (data) => {
    updateGameProgress(data, generation);
    reportGameStatus('won');
  };

  const handleGameLost = () => {
    reportGameStatus('lost');
    resetScore();
  };

  return (
    <div className="game-area" style={style}>
      <CardTable
        generation={generation}
        gameOn={gameOn}
        gameStatus={gameStatus}
        pokemonDict={pokemonDict}
        incrementScore={incrementScore}
        onGameWon={handleGameWon}
        onGameLost={handleGameLost}
        pokemonInPlay={pokemonInPlay}
        fetchPokemonDetails={fetchPokemonDetails}
      />
      <GameResult gameOn={gameOn} gameStatus={gameStatus}>
        <Button action={startNextGame} styles={styles.gameResult}>
          Play Again
        </Button>
      </GameResult>
    </div>
  );
}
