import '../styles/Pokedex.css';
import { useState } from 'react';
import usePokedexParallax from '../hooks/usePokedexParallax.js';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import PokedexLidDisplay from './PokedexLidDisplay.jsx';
import MainDisplay from './MainDisplay.jsx';

import useDelay from '../hooks/useDelay.js';
import useEvolutionChain from '../hooks/useEvolutionChain.js';

export default function Pokedex({
  allPokemon,
  isOpen,
  isLoading,
  progress,
  toggleOpen,
  children,
}) {
  const [pokedexAngle, setPokedexAngle] = usePokedexParallax(isOpen);
  const [prevOpen, setPrevOpen] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const loadingFinished = useDelay(isLoading, 1000);
  const { evolutionChain } = useEvolutionChain({ currentPokemon, allPokemon });

  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    setPokedexAngle({ x: 0, y: 0, z: 0 });
  }

  // Set the pokemon on initial load
  if (allPokemon && !currentPokemon) {
    setCurrentPokemon(allPokemon[0]);
  }

  // Invalidate the current pokemon when new pokemon are loaded
  if (isLoading && currentPokemon) setCurrentPokemon(null);

  const pokedexTransform = {
    transform: `
  rotateX(${pokedexAngle.x}deg)
  rotateY(${pokedexAngle.y}deg)
  rotateZ(${pokedexAngle.z}deg)`,
  };

  return (
    <div className="pokedex-wrapper">
      <div
        id="pokedex"
        className={`pokedex ${isOpen ? 'pokedex--open' : ''}`}
        onClick={toggleOpen}
        style={pokedexTransform}
      >
        <PokedexBody>
          <MainDisplay
            allPokemon={allPokemon}
            currentPokemon={currentPokemon}
            isLoading={isLoading}
            loadingFinished={loadingFinished}
            progress={progress}
            setCurrentPokemon={setCurrentPokemon}
            pokedexAngle={pokedexAngle}
          />
        </PokedexBody>
        <PokedexLid>
          <PokedexLidDisplay
            currentPokemon={currentPokemon}
            evolutionChain={evolutionChain}
          />
          {children}
        </PokedexLid>
      </div>
    </div>
  );
}
