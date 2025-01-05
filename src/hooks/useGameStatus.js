import { useState, useCallback } from 'react';

export default function useGameStatus() {
  const [gameOn, setGameOn] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing');

  // TODO: reset score to 0 when the generation changes mid-hand
  const reportGameStatus = useCallback((status) => {
    setGameStatus(status);
    if (status === 'won' || status === 'lost') setGameOn(false);
  }, []);

  const nextGame = () => {
    setGameStatus('playing');
    setGameOn(true);
  };

  return { gameOn, gameStatus, nextGame, reportGameStatus };
}
