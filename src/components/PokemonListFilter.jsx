import styles from '../styles/PokedexMenuBar.module.css';

export default function PokemonListFilter({}) {
  return (
    <div className={styles.filter}>
      <input type="text" placeholder="SEARCH" />
    </div>
  );
}
