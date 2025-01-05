import { useEffect, useState } from 'react';

export default function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(JSON.parse(localStorage.getItem(key)) ?? fallback);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}
