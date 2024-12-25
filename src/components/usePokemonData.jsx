import { useState, useEffect } from 'react';

export default function usePokemonData(ids) {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    if (!ids) return;
    const pokemonUrls = ids.map((id) => `https://pokeapi.co/api/v2/pokemon/${id}`);
    const fetchPokemonData = async (urls) => {
      try {
        const promises = urls.map((urls) => fetch(urls));
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map((response) => response.json()));
        return data;
      } catch (error) {
        throw new Error(`Failed to fetch pokemon data: ${error}`);
      }
    };

    fetchPokemonData(pokemonUrls).then((data) => setPokemonData(data));
  }, [ids]);

  return pokemonData;
}
