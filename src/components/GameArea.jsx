import CardTable from './CardTable.jsx';
import GameResult from './GameResult.jsx';
import Button from './Button.jsx';

export default function GameArea({
  pokedexIsOpen,
  generation,
  gameOn,
  gameStatus,
  incrementScore,
  onGameWon,
  onGameLost,
  pokemonInPlay,
  drawStarters,
  dontDrawStarters,
  requestNewPokemon,
  nextGame,
}) {
  const startNextGame = () => {
    if (drawStarters) dontDrawStarters();
    if (gameStatus === 'won') {
      requestNewPokemon();
    }
    nextGame();
  };

  return (
    <div className="game-area" style={pokedexIsOpen ? { transform: 'scale(0.75)' } : {}}>
      <CardTable
        generation={generation}
        gameOn={gameOn}
        gameStatus={gameStatus}
        incrementScore={incrementScore}
        onGameWon={onGameWon}
        onGameLost={onGameLost}
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
