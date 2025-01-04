export default function GameResult({ gameOn, gameWon, children }) {
  const gameLost = !gameOn && !gameWon;
  const getResultText = () => {
    if (gameWon) return <p>You Win!</p>;
    if (gameLost) return <p>You Lost!</p>;
  };

  return (
    <div className="game-result">
      {getResultText()}
      {!gameOn && children}
    </div>
  );
}
