import { useState, useEffect } from 'react';

export default function usePokemonSpeciesData(pokemon) {
  const [speciesData, setSpeciesData] = useState(null);
  console.log('POKEMON SPECIES DATA running');

  useEffect(() => {
    if (!pokemon) return;
    const pokemonUrls = pokemon.map((pokemon) => pokemon.url);

    const fetchPokemonSpeciesData = async (urls) => {
      try {
        const promises = urls.map((urls) => fetch(urls));
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map((response) => response.json()));
        return data;
      } catch (error) {
        throw new Error(`Failed to fetch pokemon species data: ${error}`);
      }
    };

    fetchPokemonSpeciesData(pokemonUrls).then((data) => setSpeciesData(data));
  }, [pokemon]);

  return speciesData;
}
