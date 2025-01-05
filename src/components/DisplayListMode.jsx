export default function DisplayListMode({ filteredPkmn, selectPokemon, styles }) {
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
