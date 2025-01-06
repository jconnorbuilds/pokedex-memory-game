import '../styles/Pokedex.css';
import { useState, useEffect } from 'react';
import usePokedexParallax from '../hooks/usePokedexParallax.js';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import PokedexLidDisplay from './PokedexLidDisplay.jsx';
import MainDisplay from './MainDisplay.jsx';

import useDelay from '../hooks/useDelay.js';

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
  const [evolutionChain, setEvolutionChain] = useState(null);

  useEffect(() => {
    async function fetchSinglePkmn(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    const compositeEvolutionChainData = async (data) => {
      if (data.evolves_to.length) {
        return {
          pkmn: allPokemon.find((pkmn) => pkmn.name === data.species.name),
          evolvesTo: await Promise.all(
            data.evolves_to.map((next) => compositeEvolutionChainData(next)),
          ),
        };
      }

      // Find and return the cached pokemon if it's already loaded
      const cachedPkmn = allPokemon.find((pkmn) => pkmn.name === data.species.name);
      if (cachedPkmn) return cachedPkmn;

      // Otherwise, fetch it
      // TODO: Probably need to re-do this with the logic from the original pokemon data fetch
      const singlePkmnData = await fetchSinglePkmn(data.species.url);

      return singlePkmnData;
    };

    async function fetchEvolutionChain(url) {
      const response = await fetch(url);
      const data = await response.json();
      const compositeData = await compositeEvolutionChainData(data.chain);
      console.log(compositeData);
      return data;
    }
    // TODO: Recursively get the evolution chain
    if (currentPokemon) {
      fetchEvolutionChain(currentPokemon?.speciesData.evolution_chain.url)
        .then((data) => console.log(data.chain))
        .catch((err) => console.error(err));
    }
  }, [currentPokemon, allPokemon]);

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
          />
        </PokedexBody>
        <PokedexLid>
          <PokedexLidDisplay pokemon={currentPokemon} />
          {children}
        </PokedexLid>
      </div>
    </div>
  );
}
