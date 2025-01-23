import { useEffect, useState, useCallback, useRef } from 'react';

function getPkmnURLs(pkmnBasicData) {
  return pkmnBasicData.map((pokemon) => pokemon.url);
}

async function fetchMultipleUrls(urls) {
  try {
    const promises = urls.map((url) => fetch(url));
    const responses = await Promise.all(promises);
    const data = await Promise.all(responses.map((response) => response.json()));
    return data;
  } catch (err) {
    throw new Error(`Failed to fetch species data for urls: ${urls} /
      Error: ${err}`);
  }
}

export default function useLazyLoadPkmn({ isOpen }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const isFetching = useRef(false);

  const fetchMorePokemon = useCallback(
    async (o = offset) => {
      if (isFetching.current) return;
      isFetching.current = true;
      setIsLoading(true);
      console.log(`Fetching pokemon with offset: ${o}`);
      try {
        const limit = 20;
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${o}`,
        );
        const data = await res.json();

        // Fetch comprehensive pokemon data and create the pokemon object
        const pkmnUrls = getPkmnURLs(data.results);
        const pkmnData = await fetchMultipleUrls(pkmnUrls);
        const pkmnSpeciesData = await fetchMultipleUrls(
          pkmnData.map((pkmn) => pkmn.species.url),
        );

        const pokemon = pkmnData.map((pkmn, idx) => ({
          name: pkmn.name,
          data: pkmn,
          speciesData: pkmnSpeciesData[idx],
        }));

        setPokemonList((prev) => [...prev, ...pokemon]);
        setOffset((prev) => prev + 20);
      } catch (err) {
        console.error(`Error fetching pokemon: ${err}`);
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    },
    [offset],
  );

  useEffect(() => {
    if (isOpen && !offset) {
      fetchMorePokemon();
    }
  }, [isOpen, fetchMorePokemon, offset]);

  return { pokemonList, fetchMorePokemon, isLoading };
}
