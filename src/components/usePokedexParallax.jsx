import { useState, useEffect } from 'react';

export default function usePokedexParallax(pokedexIsOpen, mousePos, handleMouseMove) {
  const [pokedexAngle, setPokedexAngle] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Sensitivity (range of motion in degrees) for X and Y directions
    const sensX = 50;
    const sensY = 30;

    if (pokedexIsOpen) {
      setPokedexAngle((pokedexAngle) => {
        return {
          ...pokedexAngle,
          x: (mousePos.y / window.innerHeight) * sensX - sensX / 2,
          y: (mousePos.x / window.innerWidth) * -1 * sensY + sensY / 2,
        };
      });
    }

    document.addEventListener('mousemove', (e) => handleMouseMove(e));

    // Clean up the event listener to avoid multiple event listeners being added
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [pokedexIsOpen, handleMouseMove, mousePos]);

  return { pokedexAngle, setPokedexAngle };
}
