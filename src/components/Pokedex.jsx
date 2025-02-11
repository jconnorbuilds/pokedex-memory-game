import { useCallback, useState } from 'react';
import usePokedexParallax from '../hooks/usePokedexParallax.js';
import '../styles/Pokedex.css';
import MainDisplay from './MainDisplay.jsx';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import PokedexLidDisplay from './PokedexLidDisplay.jsx';

import useEvolutionChain from '../hooks/useEvolutionChain.js';

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

  // Reset the pokedex angle when it's opened or closed
  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    setPokedexAngle({ x: 0, y: 0, z: 0 });
  }

  // Set the current pokemon ID, fetching the full data if it hasn't been loaded yet
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

  // Calculate the pokedex's transformation styles based on pokedexAngle state
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
