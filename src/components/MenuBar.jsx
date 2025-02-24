import styles from '../styles/PokedexMenuBar.module.css'; // pokedex screen styles
import { useContext } from 'react';
import Button from './Button.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faClose } from '@fortawesome/free-solid-svg-icons';
import PokemonListFilter from './PokemonListFilter.jsx';
import heartFavorite from '../assets/images/heart-solid.svg';
import heartDefault from '../assets/images/heart-regular.svg';
import { addDoc, doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../firebase.js';
import { AuthContext } from '../context/AuthContext.jsx';

export function MenuBar({ mode, buttonAction, icon, children }) {
  const className = `menuBar${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

  return (
    <div className={styles[className]}>
      {children}
      <Button action={buttonAction} icon={icon} styles={styles}>
        <FontAwesomeIcon icon={icon} />
      </Button>
    </div>
  );
}

const addFavorite = async (user, pkmn) => {
  if (!user) {
    // TODO: prompt to log in
  } else {
    try {
      await setDoc(doc(db, 'users', `${user.displayName}/favorites/${pkmn.id}`), {
        id: pkmn.id,
        name: pkmn.name,
      });
    } catch (e) {
      console.error('Error adding user entry: ', e);
    }
  }
};

export function PkmnInfoBar({
  pokedexMode,
  natlDexNum,
  pkmn,
  favoritePkmnIds,
  buttonAction,
}) {
  const user = useContext(AuthContext);
  const favorite = favoritePkmnIds.includes(pkmn.id);
  return (
    <MenuBar mode={pokedexMode} buttonAction={buttonAction} icon={faArrowLeftLong}>
      <div className={styles.menuBarContent}>
        <button onClick={() => addFavorite(user, pkmn)} className={styles.favoriteButton}>
          <img
            className={styles.favoriteIcon}
            src={favorite ? heartFavorite : heartDefault}
            alt="favorite icon"
          />
        </button>
        <span>{pkmn.name}</span>
        <span>#{natlDexNum}</span>
      </div>
    </MenuBar>
  );
}

export function SearchBar({ pokedexMode, filterPkmn, buttonAction }) {
  return (
    <MenuBar mode={pokedexMode} buttonAction={buttonAction} icon={faClose}>
      <PokemonListFilter filterPkmn={filterPkmn}></PokemonListFilter>
    </MenuBar>
  );
}
