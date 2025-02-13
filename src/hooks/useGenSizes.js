import { useState, useEffect } from 'react';
import { NUM_OF_GENERATIONS } from '../utils/constants.js';
export default function useGenSizes() {
  const [genSizes, setGenSizes] = useState({});

  useEffect(() => {
    const fetchGenerationData = async () => {
      const pokemonInGen = {};
      for (let i = 0; i < NUM_OF_GENERATIONS; i++) {
        const genNumber = i + 1;
        const url = `https://pokeapi.co/api/v2/generation/${genNumber}`;
        const result = await fetch(url);
        const generationData = await result.json();
        pokemonInGen[genNumber] = generationData.pokemon_species.length;
      }
      return pokemonInGen;
    };

    const generationData = fetchGenerationData();
    generationData.then((res) => setGenSizes(res));
  }, []);

  return { genSizes };
}
