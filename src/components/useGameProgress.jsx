import * as Game from './constants.js';
import useGenSizes from './useGenSizes.jsx';
import useLocalStorage from './useLocalStorage.jsx';

export default function useGameProgress() {
  const initial = Object.fromEntries(
    Array(Game.NUM_OF_GENERATIONS)
      .fill('')
      .map((_, idx) => [idx + 1, []]),
  );

  const { genSizes } = useGenSizes();
  const [genCompletion, setGenCompletion] = useLocalStorage('genCompletion', initial);

  // TODO: update this to keep track of the number of times each pkmn has been caught
  const updateGameProgress = (newData, currentGen) =>
    setGenCompletion((prev) => {
      return {
        ...prev,
        [currentGen]: [...new Set([...prev[currentGen], ...newData['pokemon']])],
      };
    });

  return { genCompletion, updateGameProgress };
}
