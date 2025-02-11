export const getPkmnIdxByName = (name, pokemonDict) => {
  return +Object.entries(pokemonDict).find(([, pkmn]) => pkmn.name === name)[0];
};

export const getPkmnIdByName = (name, pokemonDict) => {
  return Object.values(pokemonDict).find((pkmn) => pkmn.name === name).id;
};
