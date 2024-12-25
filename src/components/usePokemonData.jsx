import { useState, useEffect } from 'react';

export default function usePokemonData(data) {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    if (!data) return;
    const ids = data?.map((pkmn) => pkmn.id);
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
  }, [data]);

  return pokemonData;
}
