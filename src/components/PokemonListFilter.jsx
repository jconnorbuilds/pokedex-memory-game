import styles from '../styles/PokedexMenuBar.module.css';

export default function PokemonListFilter({ filterPkmn }) {
  return (
    <div className={styles.filter}>
      <input type="text" placeholder="SEARCH" onChange={filterPkmn} />
    </div>
  );
}
