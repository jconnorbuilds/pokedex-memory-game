import { p } from 'framer-motion/client';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';

export default function usePokemon() {
  const [pokemonDict, setPokemonDict] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const pokemonDictIsLoaded = useMemo(
    () => Object.keys(pokemonDict).length,
    [pokemonDict],
  );

  const fetchFullPokemonData = useCallback(
    async (id) => {
      const partialData = Object.values(pokemonDict).find((pkmn) => pkmn.id === id);
      const index = Object.keys(pokemonDict).find((key) => pokemonDict[key].id === id);
      const url = partialData.url;
      const pkmnData = await fetchMultipleUrls([url]);
      const pkmnSpeciesData = await fetchMultipleUrls(
        pkmnData.map((pkmn) => pkmn.species.url),
      );

      const fullPokemonData = {
        [index]: {
          ...partialData,
          data: pkmnData[0],
          speciesData: pkmnSpeciesData[0],
          fullyLoaded: true,
        },
      };

      return fullPokemonData;
    },
    [pokemonDict],
  );

  // Fetch comprehensive pokemon data and create the pokemon object for the subset of pokemon that will be loaded
  const fetchPokemonDetails = useCallback(
    async ({ singlePkmnId = undefined }) => {
      if (singlePkmnId !== undefined) {
        const fullPokemonData = await fetchFullPokemonData(singlePkmnId);
        console.log('fullPokemonData', fullPokemonData);
        setPokemonDict((prev) => ({ ...prev, ...fullPokemonData }));
      }
    },
    [fetchFullPokemonData],
  );

  useEffect(() => {
    const fetchAllPokemonBasicInfo = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0`);
        const data = await res.json();
        const pkmnDict = data.results.reduce((acc, cur, idx) => {
          const id = cur.url.split('/')[6];
          const pkmnDataWithIdx = { ...cur, id: +id };
          return { ...acc, [idx]: pkmnDataWithIdx };
        }, {});

        setPokemonDict(pkmnDict);
      } catch (err) {
        console.error(`Error fetching pokemon: ${err}`);
      }
    };

    const doFetch = async () => {
      if (!pokemonDictIsLoaded) {
        console.log('getting all pkmn');
        await fetchAllPokemonBasicInfo();
      }
    };

    doFetch();
  }, [pokemonDictIsLoaded]);

  return {
    pokemonDict,
    fetchPokemonDetails,
    isLoading,
  };
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
