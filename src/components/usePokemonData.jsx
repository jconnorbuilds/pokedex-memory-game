import { useState, useEffect } from 'react';

export default function usePokemonData(pokemon) {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    if (!pokemon) return;
    const pokemonUrls = pokemon.map(
      (pkmn) => `https://pokeapi.co/api/v2/pokemon/${pkmn.name}`,
    );
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
  }, [pokemon]);

  return pokemonData;
}
