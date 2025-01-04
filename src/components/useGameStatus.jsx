import { useState, useCallback } from 'react';

export default function useGameStatus({
  drawStarters,
  dontDrawStarters,
  requestNewPokemon,
}) {
  const [gameWon, setGameWon] = useState(false);
  const [gameOn, setGameOn] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing');

  // TODO: reset score to 0 when the generation changes mid-hand
  const reportGameStatus = useCallback((status) => {
    if (status === 'win') {
      setGameWon(true);
      setGameOn(false);

      // Adds NEW pokemon to the list.
    } else if (status === 'lose') {
      setGameOn(false);
    }
  }, []);

  const nextGame = () => {
    setGameWon(false);
    setGameOn(true);

    if (gameWon) {
      if (drawStarters) dontDrawStarters();
      requestNewPokemon();
    }
  };

  const getGameStatus = () => {
    if (gameWon) return 'won';
    if (!gameOn && !gameWon) return 'lost';
    return 'playing';
  };

  return { gameOn, gameWon, nextGame, getGameStatus, reportGameStatus, setGameStatus };
}
