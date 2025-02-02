export const getPkmnIdxByName = (name, pokemonDict) => {
  return +Object.entries(pokemonDict).find(([, pkmn]) => pkmn.name === name)[0];
};
