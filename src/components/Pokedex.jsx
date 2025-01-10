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
      // console.log('async data', data);
      const pkmnSpeciesData = await fetchSinglePkmn(data.species.url);
      // console.log('singlepkmn', singlePkmn);
      // const pkmnUrl = getPokemonSpeciesURLs([pkmnSpeciesData]);
      const pkmnData = await fetchPokemonData(pkmnSpeciesData.id);
      console.log(pkmnData);

      const compositeData = {
        name: pkmnData.name,
        data: pkmnData,
        speciesData: pkmnSpeciesData,
      };

      return compositeData;
    };

    const getEvolutionPkmn = async (data) => {
      // console.log(data);
      // Find and return the cached pokemon if it's already loaded
      const cachedPkmn = allPokemon.find((pkmn) => pkmn.name === data.species.name);
      // console.log('cachedPkmn', cachedPkmn);

      if (cachedPkmn) return cachedPkmn;

      // Otherwise, fetch it
      const fetchedPkmn = await fetchAndFormatData(data);
      // return singlePkmnData;
      return fetchedPkmn;
    };

    const compositeEvolutionChainData = async (evoChainData) => {
      // console.log('evoChainData', evoChainData);
      if (evoChainData.evolves_to.length) {
        return {
          pkmn: await getEvolutionPkmn(evoChainData),
          evolvesTo: await Promise.all(
            evoChainData.evolves_to.map((next) => compositeEvolutionChainData(next)),
          ),
        };
      } else {
        return {
          pkmn: allPokemon.find((pkmn) => pkmn.name === evoChainData.species.name),
        };
      }
    };

    async function fetchEvolutionChain(url) {
      const response = await fetch(url);
      const data = await response.json();
      const compositeData = await compositeEvolutionChainData(data.chain);
      return compositeData;
    }

    // TODO: Recursively get the evolution chain
    if (currentPokemon) {
      fetchEvolutionChain(currentPokemon.speciesData.evolution_chain.url)
        .then((data) => setEvolutionChain([data]))
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
