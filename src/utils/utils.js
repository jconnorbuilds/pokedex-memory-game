export const getPkmnIdxByName = (name, pokemonDict) => {
  return +Object.entries(pokemonDict).find(([_, pkmn]) => pkmn.name === name)[0];
};
