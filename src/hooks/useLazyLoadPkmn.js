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

  const isFetching = useRef(false);

  const fetchAllPokemonBasicInfo = useCallback(async () => {
    console.log('Getting basic info');
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=-1&offset=0`);
      const data = await res.json();

      setPokemonList(data.results);
      return data.results;
    } catch (err) {
      console.error(`Error fetching pokemon: ${err}`);
    }
  }, []);

  // Fetch comprehensive pokemon data and create the pokemon object
  const fetchPokemonDetails = useCallback(async (data) => {
    isFetching.current = true;
    setIsLoading(true);

    try {
      const pkmnUrls = getPkmnURLs(data);
      const pkmnData = await fetchMultipleUrls(pkmnUrls);
      const pkmnSpeciesData = await fetchMultipleUrls(
        pkmnData.map((pkmn) => pkmn.species.url),
      );

      const fullPokemonData = data.map((pkmn, idx) => {
        pkmn.data = pkmnData[idx];
        pkmn.speciesData = pkmnSpeciesData[idx];
        return pkmn;
      });

      setPokemonList((prev) => [...prev, ...fullPokemonData]);
    } catch (err) {
      console.error(`Error fetching pokemon details: ${err} data:${data}`);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    const doFetch = async () => {
      if (pokemonList.length > 0) return;
      const pkmnBasicInfo = await fetchAllPokemonBasicInfo().then((data) => data);
      const firstPage = pkmnBasicInfo.slice(0, 20);
      fetchPokemonDetails(firstPage);
    };

    doFetch();
  }, [fetchPokemonDetails, fetchAllPokemonBasicInfo, isOpen, pokemonList.length]);

  return {
    pokemonList,
    fetchPokemonDetails,
    fetchAllPokemonBasicInfo,
    isLoading,
  };
}
