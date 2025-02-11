import '../styles/Pokedex.css';
import { useEffect, useState, useCallback } from 'react';
import { getPkmnIdByName } from '../utils/utils.js';
import usePokedexParallax from '../hooks/usePokedexParallax.js';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import PokedexLidDisplay from './PokedexLidDisplay.jsx';
import MainDisplay from './MainDisplay.jsx';

import useDelay from '../hooks/useDelay.js';
import useEvolutionChain from '../hooks/useEvolutionChain.js';
// import usePokemon from '../hooks/usePokemon.js';

export default function Pokedex({
  isOpen,
  toggleOpen,
  pokemonDict,
  fetchPokemonDetails,
  isLoading,
}) {
  const [pokedexAngle, setPokedexAngle] = usePokedexParallax(isOpen);
  const [prevOpen, setPrevOpen] = useState(false);
  const [pokedexMode, setPokedexMode] = useState('list');
  const [currentPokemonId, setCurrentPokemonId] = useState(null);

  const { evolutionChain } = useEvolutionChain({
    currentPokemonId,
    allPokemon: pokemonDict,
    fetchPokemonDetails,
  });

  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    setPokedexAngle({ x: 0, y: 0, z: 0 });
  }

  // Sets the current pokemon ID, fetching the full data if it hasn't been loaded yet
  const handlePkmnSelection = useCallback(
    async (id) => {
      const pkmn = Object.values(pokemonDict).find((pkmn) => pkmn.id === id);
      const pokemonIsLoaded = pkmn.fullyLoaded === true;
      if (!pokemonIsLoaded) fetchPokemonDetails(id);

      setCurrentPokemonId(id);
      setPokedexMode('singlePkmn');
    },

    [pokemonDict, fetchPokemonDetails, setCurrentPokemonId],
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
            pokemonList={pokemonDict}
            pokedexMode={pokedexMode}
            setPokedexMode={setPokedexMode}
            currentPokemonId={currentPokemonId}
            handlePkmnSelection={handlePkmnSelection}
            fetchPokemonDetails={fetchPokemonDetails}
            isLoading={isLoading}
            pokedexAngle={pokedexAngle}
            evolutionChain={evolutionChain}
          />
        </PokedexBody>
        <PokedexLid>
          <PokedexLidDisplay
            pokemonList={pokemonDict}
            currentPokemonId={currentPokemonId}
            evolutionChain={evolutionChain}
          />
        </PokedexLid>
      </div>
    </div>
  );
}
