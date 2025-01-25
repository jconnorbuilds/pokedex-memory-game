import '../styles/Pokedex.css';
import { useState } from 'react';
import usePokedexParallax from '../hooks/usePokedexParallax.js';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import PokedexLidDisplay from './PokedexLidDisplay.jsx';
import MainDisplay from './MainDisplay.jsx';

import useDelay from '../hooks/useDelay.js';
import useEvolutionChain from '../hooks/useEvolutionChain.js';
import useLazyLoadPkmn from '../hooks/useLazyLoadPkmn.js';

export default function Pokedex({ isOpen, progress, toggleOpen, children }) {
  const [pokedexAngle, setPokedexAngle] = usePokedexParallax(isOpen);
  const [prevOpen, setPrevOpen] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState(null);

  const { pokemonList, fetchPokemonDetails, fetchAllPokemonBasicInfo, isLoading } =
    useLazyLoadPkmn({ isOpen });
  const { evolutionChain } = useEvolutionChain({
    currentPokemon,
    allPokemon: pokemonList,
  });
  // const loadingFinished = useDelay(isLoading, 1000);
  const loadingFinished = true;

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
        <PokedexBody>
          <MainDisplay
            pokemonList={pokemonList}
            currentPokemon={currentPokemon}
            fetchPokemonDetails={fetchPokemonDetails}
            fetchAllPokemonBasicInfo={fetchAllPokemonBasicInfo}
            isLoading={isLoading}
            loadingFinished={loadingFinished}
            progress={progress}
            setCurrentPokemon={setCurrentPokemon}
            pokedexAngle={pokedexAngle}
            evolutionChain={evolutionChain}
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
