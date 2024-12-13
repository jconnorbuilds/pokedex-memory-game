import { useEffect, useState } from 'react';

export default function usePokemonDexSprites(pokemon) {
  const [pokemonDexSprites, setPokemonDexSprites] = useState([]);
  useEffect(() => {
    if (pokemon) {
      const dexSpriteUrls = pokemon.map((pkmn) => {
        return `https://pokeapi.co/api/v2/pokemon/${pkmn.name}`;
      });

      const getPokemonData = async (urls) => {
        try {
          const promises = urls.map((urls) => fetch(urls));
          const responses = await Promise.all(promises);
          const data = await Promise.all(responses.map((response) => response.json()));
          return data;
        } catch (error) {
          throw new Error(`Failed to fetch data: ${error}`);
        }
      };

      getPokemonData(dexSpriteUrls).then((data) => {
        const dexSprites = data.map(
          (pokemon) => pokemon.sprites.other['showdown'].front_default,
        );
        setPokemonDexSprites(dexSprites);
      });
    }
  }, [pokemon]);

  return pokemonDexSprites;
}
