import '../styles/Pokedex.css';
import { useEffect, useState, useCallback } from 'react';
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
  const [pokedexMode, setPokedexMode] = useState('list');
  const [currentPokemonId, setCurrentPokemonId] = useState(null);

  const { pokemonList, fetchPokemonDetails, isLoading } = useLazyLoadPkmn({ isOpen });
  const { evolutionChain } = useEvolutionChain({
    currentPokemonId,
    allPokemon: pokemonList,
  });
  // const loadingFinished = useDelay(isLoading, 1000);
  const loadingFinished = true;

  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    setPokedexAngle({ x: 0, y: 0, z: 0 });
  }

  // Selects the current pokemon, fetching the full data if necessary
  const handlePkmnSelection = useCallback(
    async (id) => {
      let key;
      if (typeof id === 'number') {
        key = id;
        setCurrentPokemonId(id);
        // console.log(selected);
      } else if (typeof id === 'string') {
        key = +Object.entries(pokemonList).find(([idx, pkmn]) => {
          return pkmn.name === id;
        })[0];
        setCurrentPokemonId(key);
      }

      const pokemonIsLoaded = pokemonList[key].fullyLoaded === true;
      if (!pokemonIsLoaded) {
        fetchPokemonDetails({ singlePkmnId: key });
      }
      console.log('PKMN IS LOADED?', pokemonIsLoaded);

      setPokedexMode('singlePkmn');
    },

    [pokemonList, fetchPokemonDetails, setCurrentPokemonId],
  );

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
            pokedexMode={pokedexMode}
            setPokedexMode={setPokedexMode}
            currentPokemonId={currentPokemonId}
            handlePkmnSelection={handlePkmnSelection}
            fetchPokemonDetails={fetchPokemonDetails}
            isLoading={isLoading}
            loadingFinished={loadingFinished}
            progress={progress}
            setCurrentPokemon={setCurrentPokemonId}
            pokedexAngle={pokedexAngle}
            evolutionChain={evolutionChain}
          />
        </PokedexBody>
        <PokedexLid>
          <PokedexLidDisplay
            pokemonList={pokemonList}
            currentPokemonId={currentPokemonId}
            evolutionChain={evolutionChain}
          />
          {children}
        </PokedexLid>
      </div>
    </div>
  );
}
