import { useEffect } from 'react';

export default function useLocalStorage(showStarters, genCompletion) {
  useEffect(() => {
    localStorage.setItem('showStarters', JSON.stringify(showStarters));
    localStorage.setItem('genCompletion', JSON.stringify(genCompletion));
  }, [showStarters, genCompletion]);
}
