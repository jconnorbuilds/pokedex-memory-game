import { useState, useCallback, useEffect } from 'react';

export default function useCurrentGenPkmnIds({ generation }) {
  const [currentGenPkmnIds, setCurrentGenPkmnIds] = useState(null);
  const [isLoadingGenerationIds, setIsLoadingGenerationIds] = useState(false);

  // Fetches the basic pokemon info from the generation
  const fetchAllPokemonInGeneration = useCallback(async (gen) => {
    setIsLoadingGenerationIds(true);
    try {
      const url = `https://pokeapi.co/api/v2/generation/${gen}`;
      const response = await fetch(url);
      const generationData = await response.json();

      return generationData;
    } catch (err) {
      `Unable to fetch all pokemon: ${err}`;
    } finally {
      setIsLoadingGenerationIds(false);
    }
  }, []);

  // Returns a list of pokemon IDs from the generation
  const parseIds = (genData) => genData.map((pokemon) => +pokemon.url.split('/')[6]);

  useEffect(() => {
    const getIds = async () => {
      const ids = await fetchAllPokemonInGeneration(generation).then((genData) =>
        parseIds(genData.pokemon_species),
      );
      setCurrentGenPkmnIds(ids ? ids : []);
    };

    getIds();
  }, [fetchAllPokemonInGeneration, generation]);
  return { currentGenPkmnIds, isLoadingGenerationIds };
}
