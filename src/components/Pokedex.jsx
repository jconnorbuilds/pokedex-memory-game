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

    const fetchPokemonData = async (pkmnID) => {
      const url = `https://pokeapi.co/api/v2/pokemon/${pkmnID}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(`Failed to fetch SINGLE pokemon data: ${error}`);
      }
    };

    const fetchAndFormatData = async (data) => {
      // Fetch the pokemon data and the species data
      const pkmnSpeciesData = await fetchSinglePkmn(data.species.url);
      const pkmnData = await fetchPokemonData(pkmnSpeciesData.id);

      // Combine the data
      const compositeData = {
        name: pkmnData.name,
        data: pkmnData,
        speciesData: pkmnSpeciesData,
      };

      return compositeData;
    };

    const getOrFetchPkmn = async (data) => {
      // Find and return the cached pokemon if it's already loaded
      const cachedPkmn = allPokemon.find((pkmn) => pkmn.name === data.species.name);

      if (cachedPkmn) return cachedPkmn;

      // Otherwise, fetch it
      const fetchedPkmn = await fetchAndFormatData(data);
      return fetchedPkmn;
    };

    const compositeEvolutionChainData = async (evoChainData) => {
      // Get the first pokemon in the evolution chain
      const pkmn = await getOrFetchPkmn(evoChainData);
      const evolutions = evoChainData.evolves_to;

      // If it evolves, recurse over its evolutions
      if (evolutions.length) {
        const evolvesTo = await Promise.all(
          evolutions.map((next) => compositeEvolutionChainData(next)),
        );
        // Return the full pokemon data with the evolution chain data
        return { pkmn, evolvesTo };
      }
      // If the pokemon is the last in the chain, just return the pokemon data
      return { pkmn };
    };

    async function fetchEvolutionChain(url) {
      // Fetch the whole evolution chain
      const response = await fetch(url);
      const data = await response.json();

      // Format the chain so the full pokemon data is included along with the evolution chain data
      const compositeData = await compositeEvolutionChainData(data.chain);
      return compositeData;
    }

    // Fetch the evolution chain and set it as state
    if (currentPokemon) {
      fetchEvolutionChain(currentPokemon.speciesData.evolution_chain.url)
        .then((data) => setEvolutionChain(data))
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
          <PokedexLidDisplay pokemon={currentPokemon} evolutionChain={evolutionChain} />
          {children}
        </PokedexLid>
      </div>
    </div>
  );
}
