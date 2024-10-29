export default function Scoreboard({ score, bestScore }) {
  return (
    <div className="scoreboard">
      Score: <span className="score__val">{score}</span>{' '}
      <div>
        Best score: <span className="score__val">{bestScore}</span>
      </div>
    </div>
  );
}
