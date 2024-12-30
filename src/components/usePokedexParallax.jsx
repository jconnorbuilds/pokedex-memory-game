import { useState, useEffect, useCallback } from 'react';
import useThrottle from './useThrottle.jsx';
export default function usePokedexParallax(pokedexIsOpen) {
  const [pokedexAngle, setPokedexAngle] = useState({ x: 0, y: 0, z: 0 });

  const setParallax = useCallback((e) => {
    // Sensitivity (range of motion in degrees) for X and Y directions
    const sensX = 50;
    const sensY = 50;
    if (e.target.closest('#pokedex')) {
      // TODO: Set the parallax angle based on the position on the pokedex rather than client
      setPokedexAngle((pokedexAngle) => {
        return {
          ...pokedexAngle,
          x: (e.clientY / window.innerHeight) * sensX - sensX / 2,
          y: (e.clientX / window.innerWidth) * -1 * sensY + sensY / 2,
        };
      });
    } else {
      setPokedexAngle({ x: 0, y: 0, z: 0 });
    }
  }, []);

  const handleMouseMove = useThrottle(setParallax, 150);

  useEffect(() => {
    if (!pokedexIsOpen) return;

    document.addEventListener('mousemove', handleMouseMove);

    // Clean up the event listener to avoid multiple event listeners being added
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [pokedexIsOpen, handleMouseMove]);

  return [pokedexAngle, setPokedexAngle];
}
