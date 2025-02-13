import { NUM_OF_GENERATIONS } from '../utils/constants.js';
import useLocalStorage from './useLocalStorage.js';

// Is this hook necessary?
export default function useStarters(currentGen) {
  const [showStarters, setShowStarters] = useLocalStorage(
    'drawStarters',
    Array(NUM_OF_GENERATIONS).fill(true),
  );

  const drawStarters = showStarters[currentGen - 1];

  const dontDrawStarters = () => {
    const newStarters = showStarters.map((show, idx) =>
      idx + 1 === +currentGen ? false : show,
    );
    setShowStarters(newStarters);
  };

  return { drawStarters, dontDrawStarters };
}
