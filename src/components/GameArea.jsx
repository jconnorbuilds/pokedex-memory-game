import useStarters from './useStarters.jsx';
import usePokemonInPlay from './usePokemonInPlay.jsx';

import CardTable from './CardTable.jsx';
import GameResult from './GameResult.jsx';
import Button from './Button.jsx';
import useGameProgress from './useGameProgress.jsx';

export default function GameArea({
  level,
  allPokemonInGen,
  pokedexIsOpen,
  generation,
  incrementScore,
  resetScore,
  gameOn,
  gameStatus,
  nextGame,
  reportGameStatus,
}) {
  const { updateGameProgress } = useGameProgress();
  const { drawStarters, dontDrawStarters } = useStarters(generation);
  const { pokemonInPlay, requestNewPokemon } = usePokemonInPlay(
    allPokemonInGen,
    drawStarters,
    level.size,
  );

  const startNextGame = () => {
    if (drawStarters) dontDrawStarters();
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
    <div className="game-area" style={pokedexIsOpen ? { transform: 'scale(0.75)' } : {}}>
      <CardTable
        generation={generation}
        gameOn={gameOn}
        gameStatus={gameStatus}
        incrementScore={incrementScore}
        onGameWon={handleGameWon}
        onGameLost={handleGameLost}
        pokemonInPlay={pokemonInPlay}
      />
      <GameResult gameOn={gameOn} gameStatus={gameStatus}>
        <Button action={startNextGame} styles="game-result">
          Play Again
        </Button>
      </GameResult>
    </div>
  );
}
