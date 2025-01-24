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
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=-1&offset=0`);
      const data = await res.json();

      setPokemonList(data.results);
      console.log('called setPokemonList');
    } catch (err) {
      console.error(`Error fetching pokemon: ${err}`);
    }
  }, []);

  // Fetch comprehensive pokemon data and create the pokemon object
  const fetchPokemonDetails = useCallback(
    async (offset = 0, pageSize = 20) => {
      // console.log('trying');
      isFetching.current = true;
      setIsLoading(true);
      // if (!pokemonList.length) return;
      // console.log('pokemonlist', pokemonList);
      const data = pokemonList.slice(offset, offset + pageSize);

      try {
        const pkmnUrls = getPkmnURLs(data);
        const pkmnData = await fetchMultipleUrls(pkmnUrls);
        const pkmnSpeciesData = await fetchMultipleUrls(
          pkmnData.map((pkmn) => pkmn.species.url),
        );
        const fullPokemonData = data.map((pkmn, idx) => {
          pkmn.data = pkmnData[idx];
          pkmn.speciesData = pkmnSpeciesData[idx];
        });

        console.log('FULL POKEMON DATA', fullPokemonData);
        setPokemonList([...pokemonList, ...fullPokemonData]);
      } catch (err) {
        console.error(`Error fetching pokemon details: ${err} data:${data}`);
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    },
    [pokemonList],
  );

  // useEffect(() => {
  //   if (isOpen && !pokemonList.length) {
  //     fetchAllPokemonBasicInfo();
  //     fetchPokemonDetails();
  //   }
  // }, [isOpen, fetchAllPokemonBasicInfo, fetchPokemonDetails, pokemonList.length]);

  return {
    pokemonList,
    // fetchMorePokemon,
    fetchPokemonDetails,
    fetchAllPokemonBasicInfo,
    isLoading,
  };
}
