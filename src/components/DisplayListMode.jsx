import styles from '../styles/DisplayListMode.module.css';
import PkmnListButton from './PkmnListButton.jsx';

export default function DisplayListMode({ filteredPkmn, selectPokemon }) {
  return (
    <div className={styles.displayList} tabIndex={0}>
      {filteredPkmn?.map((pkmn) => (
        <PkmnListButton
          key={pkmn.name}
          pkmn={pkmn}
          styles={styles}
          selectPokemon={selectPokemon}
        />
      ))}
    </div>
  );
}
