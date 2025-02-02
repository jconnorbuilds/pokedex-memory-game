import styles from '../styles/PokedexMenuBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function PokemonListFilter({ filterPkmn }) {
  return (
    <div className={styles.filter}>
      <input
        type="text"
        placeholder="SEARCH"
        onChange={(e) => filterPkmn(e.target.value.toLowerCase())}
      />
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </div>
  );
}
