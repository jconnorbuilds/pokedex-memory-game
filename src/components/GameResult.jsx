export default function GameResult({ gameOn, gameStatus, children }) {
  const getResultText = () => {
    if (gameStatus === 'won') return <p>You Win!</p>;
    if (gameStatus === 'lost') return <p>You Lost!</p>;
  };

  return (
    <div className="game-result">
      {getResultText()}
      {!gameOn && children}
    </div>
  );
}
