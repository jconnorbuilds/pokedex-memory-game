import styles from '../styles/DisplayListMode.module.css';

export default function DisplayListMode({ filteredPkmn, selectPokemon }) {
  return (
    <div className={styles.displayList} tabIndex={0}>
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
