export default function Scoreboard({ scores }) {
  return (
    <div className="scoreboard">
      Score: <span className="score__val">{scores.score}</span>{' '}
      <div>
        Best score: <span className="score__val">{scores.best}</span>
      </div>
    </div>
  );
}
