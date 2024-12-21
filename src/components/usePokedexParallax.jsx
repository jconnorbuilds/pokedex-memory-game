import { useEffect } from 'react';

export default function usePokedexParallax(pokedexIsOpen, setPokedexAngle, pokedexAngle) {
  useEffect(() => {
    // Max range should be 10 degrees in either direction
    const pokedexParallax = (e) => {
      if (pokedexIsOpen) {
        setPokedexAngle({
          ...pokedexAngle,
          x: (e.clientY / window.screen.availHeight) * 20 - 10,
          y: (e.clientX / window.screen.availWidth) * -20 + 10,
        });
      }
    };

    document.addEventListener('mousemove', pokedexParallax);

    // Clean up the event listener to avoid multiple event listeners being added
    return () => document.removeEventListener('mousemove', pokedexParallax);
  }, [pokedexAngle, pokedexIsOpen, setPokedexAngle]);
}
