import '../styles/Pokedex.css';
import { useState } from 'react';
import usePokedexParallax from './usePokedexParallax.jsx';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import PokedexLidDisplay from './PokedexLidDisplay.jsx';

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
  // const [currentPokemon, setCurrentPokemon] = useState(pokemon ? pokemon[0] : null);
  console.log(pokemon);

  const currentPokemon = pokemon ? pokemon[0] : null;

  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    setPokedexAngle({ x: 0, y: 0, z: 0 });
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
          pokemon={currentPokemon}
          isLoading={isLoading}
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
