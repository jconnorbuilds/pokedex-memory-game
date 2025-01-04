import { useCallback, useState } from 'react';

export default function UseScore() {
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const incrementScore = useCallback(
    (by = 1) => {
      const newScore = score + by;
      setScore(newScore);
      if (newScore > best) setBest(newScore);
    },
    [score, best],
  );

  const resetScore = useCallback(() => {
    setScore(0);
    setBest(0);
  }, []);

  return { score, best, incrementScore, resetScore };
}
