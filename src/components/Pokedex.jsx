import '../styles/Pokedex.css';
import { useState } from 'react';
import usePokedexParallax from './usePokedexParallax.jsx';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import PokedexLidDisplay from './PokedexLidDisplay.jsx';

import useDelay from './useDelay.jsx';

export default function Pokedex({
  pokemon,
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

  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    setPokedexAngle({ x: 0, y: 0, z: 0 });
  }

  // Set the pokemon on initial load
  if (pokemon && currentPokemon?.name !== pokemon[0].name) {
    setCurrentPokemon(pokemon[0]);
  }

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
        <PokedexBody
          allPokemon={pokemon}
          currentPokemon={currentPokemon}
          isLoading={!loadingFinished}
          progress={progress}
        ></PokedexBody>
        <PokedexLid>
          <PokedexLidDisplay pokemon={currentPokemon}></PokedexLidDisplay>
          {children}
        </PokedexLid>
      </div>
    </div>
  );
}
