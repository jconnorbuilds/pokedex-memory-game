import { useState, useEffect } from 'react';

export default function useDelay(trigger, wait) {
  const [state, setState] = useState(false);
  useEffect(() => {
    trigger ? setState(false) : setTimeout(() => setState(true), wait);
  }, [trigger, wait]);

  return state;
}
