import { useState } from 'react';

export default function useThrottle(callback, delay = 150) {
  const [shouldWait, setShouldWait] = useState(false);

  // Return the throttled function
  const throttledFn = (...args) => {
    if (shouldWait) return;

    callback(...args);
    setShouldWait(true);

    setTimeout(() => {
      setShouldWait(false);
    }, delay);
  };

  return throttledFn;
}
