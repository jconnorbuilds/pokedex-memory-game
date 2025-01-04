import { NUM_OF_GENERATIONS } from './constants.js';
import useLocalStorage from './useLocalStorage.jsx';

export default function useStarters() {
  const [showStarters, setShowStarters] = useLocalStorage(
    'showStarters',
    Array(NUM_OF_GENERATIONS).fill(true),
  );

  const shouldShowStartersForGen = (gen) => {
    return showStarters[gen - 1];
  };

  const hideStartersForGen = (gen) => {
    const newStarters = showStarters.map((show, idx) =>
      idx + 1 === +gen ? false : show,
    );
    setShowStarters(newStarters);
  };
  return { shouldShowStartersForGen, hideStartersForGen };
}
