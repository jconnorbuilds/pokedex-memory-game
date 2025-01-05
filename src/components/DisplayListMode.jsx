import { useState } from 'react';

export default function DisplayListMode({ allPokemon, selectPokemon, styles }) {
  const [filteredPkmn, setFilteredPkmn] = useState(allPokemon);

  function filterPkmn(str) {
    const current = [...filteredPkmn];
    const filtered = current.filter((pkmn) => {
      return pkmn.name.includes(str.toLowerCase());
    });
    setFilteredPkmn(filtered);
  }

  return (
    <div className={styles.pokemonList} tabIndex={0}>
      {filteredPkmn?.map((pkmn) => (
        <button
          onClick={(e) => selectPokemon(e.target.value)}
          value={pkmn.name}
          key={pkmn.name}
        >
          {pkmn.name}
        </button>
      ))}
    </div>
  );
}
