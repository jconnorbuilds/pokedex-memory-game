import { useEffect, useState, useCallback, useRef } from 'react';

function getPkmnURLs(pkmnSubsetBasicData) {
  return Object.values(pkmnSubsetBasicData).map((pkmn) => pkmn.url);
}

async function fetchMultipleUrls(urls) {
  try {
    if (!Array.isArray(urls)) {
      throw new TypeError(`urls is ${typeof urls}, but you need to provide an array`);
    }

    const promises = urls.map((url) => fetch(url));
    const responses = await Promise.all(promises);
    const data = await Promise.all(responses.map((response) => response.json()));
    return data;
  } catch (err) {
    console.error(`Failed to fetch urls: ${err}`);
  }
}

export default function useLazyLoadPkmn({ isOpen }) {
  const [pokemonDict, setPokemonDict] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isFetching = useRef(false);

  const fetchAllPokemonBasicInfo = useCallback(async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=-1&offset=0`);
      const data = await res.json();
      const pkmnDict = data.results.reduce((acc, cur, idx) => {
        return { ...acc, [idx]: cur };
      }, {});

      setPokemonDict(pkmnDict);
      return pkmnDict;
    } catch (err) {
      console.error(`Error fetching pokemon: ${err}`);
    }
  }, []);

  // Fetch comprehensive pokemon data and create the pokemon object
  const fetchPokemonDetails = useCallback(async (offset, size) => {
    let allPokemon = pokemonDict;
    if (!Object.keys(allPokemon).length) {
      allPokemon = await fetchAllPokemonBasicInfo();
    }

    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    try {
      const data = Array(size)
        .fill(true)
        .reduce((acc, cur, idx) => {
          return { ...acc, [offset + idx]: allPokemon[idx] };
        }, {});

      const pkmnUrls = getPkmnURLs(data);
      const pkmnData = await fetchMultipleUrls(pkmnUrls);
      const pkmnSpeciesData = await fetchMultipleUrls(
        pkmnData.map((pkmn) => pkmn.species.url),
      );

      const fullPokemonData = Object.values(data).map((pkmn, idx) => {
        pkmn.data = pkmnData[idx];
        pkmn.speciesData = pkmnSpeciesData[idx];
        pkmn.fullyLoaded = true;
        return pkmn;
      });

      setPokemonDict((prev) => ({ ...prev, ...fullPokemonData }));
    } catch (err) {
      console.error(`Error fetching pokemon details: ${err}`);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    const doFetch = async () => {
      if (pokemonDict.length > 0) return;
      fetchPokemonDetails(0, 20);
    };

    doFetch();
  }, [fetchPokemonDetails, fetchAllPokemonBasicInfo, isOpen, pokemonDict.length]);

  return {
    pokemonList: pokemonDict,
    fetchPokemonDetails,
    fetchAllPokemonBasicInfo,
    isLoading,
  };
}
