import { useState, useEffect } from 'react';

export default function useGenSizes(numberOfGenerations) {
  const [genSizes, setGenSizes] = useState({});
  useEffect(() => {
    const fetchGenerationData = async () => {
      const pokemonInGen = {};
      for (let i = 0; i < numberOfGenerations; i++) {
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
  }, [numberOfGenerations]);

  return genSizes;
}
