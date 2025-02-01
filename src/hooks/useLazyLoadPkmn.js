import { useEffect, useState, useCallback, useRef } from 'react';

export default function useLazyLoadPkmn({ isOpen }) {
  const [pokemonDict, setPokemonDict] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isFetching = useRef(false);
  const pokemonDictIsLoaded = Object.keys(pokemonDict).length;

  const getPkmnSubset = useCallback(
    (offset, size) => {
      const pkmnSubset = Array(size)
        .fill(true)
        .reduce(
          (acc, cur, idx) => {
            const pkmnIdx = idx + offset;
            const groupName = pokemonDict[pkmnIdx].fullyLoaded ? 'cached' : 'new';
            return {
              ...acc,
              [groupName]: { ...acc[groupName], [pkmnIdx]: pokemonDict[pkmnIdx] },
            };
          },
          { new: {}, cached: {} },
        );

      const newPkmn = pkmnSubset.new;
      const cachedPkmn = pkmnSubset.cached;
      return { newPkmn, cachedPkmn };
    },
    [pokemonDict],
  );

  const fetchFullPokemonData = async (partialData) => {
    const pkmnUrls = getPkmnURLs(partialData);
    const pkmnData = await fetchMultipleUrls(pkmnUrls);
    const pkmnSpeciesData = await fetchMultipleUrls(
      pkmnData.map((pkmn) => pkmn.species.url),
    );

    const fullPokemonData = Object.entries(partialData).reduce((acc, cur, idx) => {
      const [pkmnIdx, data] = cur;

      const fullPkmnData = {
        ...data,
        data: pkmnData[idx],
        speciesData: pkmnSpeciesData[idx],
        fullyLoaded: true,
      };

      return { ...acc, [pkmnIdx]: fullPkmnData };
    }, {});

    return fullPokemonData;
  };

  // Fetch comprehensive pokemon data and create the pokemon object for the subset of pokemon that will be loaded
  const fetchPokemonDetails = useCallback(
    async ({ offset = undefined, size = undefined, singlePkmnId = undefined }) => {
      console.log('isFetching', isFetching.current);
      if (isFetching.current) return;
      isFetching.current = true;
      setIsLoading(true);
      console.log('SINGLE PKMN ID', singlePkmnId);

      if (offset === undefined && size === undefined && singlePkmnId === undefined) {
        setIsLoading(false);
        isFetching.current = false;
        return;
      }

      if (singlePkmnId >= 0) {
        const fullPokemonData = await fetchFullPokemonData({
          [singlePkmnId]: pokemonDict[singlePkmnId],
        });
        setPokemonDict((prev) => ({ ...prev, ...fullPokemonData }));
        setIsLoading(false);
        isFetching.current = false;
      } else {
        try {
          const { newPkmn } = getPkmnSubset(offset, size);

          if (newPkmn) {
            const fullPokemonData = await fetchFullPokemonData(newPkmn);
            setPokemonDict((prev) => ({ ...prev, ...fullPokemonData }));
          }
        } catch (err) {
          console.error(`Error fetching pokemon details: ${err}`);
        } finally {
          setIsLoading(false);
          isFetching.current = false;
        }
      }
    },
    [getPkmnSubset, pokemonDict],
  );

  useEffect(() => {
    const fetchAllPokemonBasicInfo = async () => {
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
    };

    const doFetch = async () => {
      if (!pokemonDictIsLoaded) {
        console.log('getting all pkmn');
        await fetchAllPokemonBasicInfo();
      }
    };

    if (isOpen) doFetch();
  }, [isOpen, pokemonDictIsLoaded]);

  return {
    pokemonList: pokemonDict,
    fetchPokemonDetails,
    isLoading,
  };
}

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
