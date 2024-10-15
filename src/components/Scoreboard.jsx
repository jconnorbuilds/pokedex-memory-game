import { useState } from 'react';

export default function Scoreboard() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const updateScores = () => {
    const newScore = score + 1;
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);
  };

  const resetScore = () => setScore(0);

  const resetScores = () => {
    resetScore();
    setBestScore(0);
  };

  return (
    <>
      <span>Score: {score} </span>
      <button onClick={updateScores}>Increment score</button>
      <span>Best score: {bestScore}</span>
      <button onClick={resetScores}>End game</button>
      <button onClick={resetScore}>New game</button>
    </>
  );
}
