import { faArrowLeftLong, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import heartDefault from '../assets/images/heart-regular.svg';
import heartFavorite from '../assets/images/heart-solid.svg';
import { AuthContext } from '../context/AuthContext.jsx';
import { db } from '../firebase.js';
import styles from '../styles/PokedexMenuBar.module.css'; // pokedex screen styles
import Button from './Button.jsx';
import PokemonListFilter from './PokemonListFilter.jsx';

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

const toggleFavorite = async (user, pkmn) => {
  // The document to search for
  const docRef = doc(db, 'users', `${user.uid}/favorites/${pkmn.id}`);
  try {
    // Check if the document exists delete it to unfavorite, or set it to favorite.
    const entry = await getDoc(docRef);
    if (entry.exists()) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        id: pkmn.id,
        name: pkmn.name,
      });
    }
  } catch (e) {
    console.error('Error updating user entry: ', e);
  }
};

export function PkmnInfoBar({
  pokedexMode,
  natlDexNum,
  pkmn,
  favoritePkmnIds,
  showLoginPrompt,
  buttonAction,
}) {
  const user = useContext(AuthContext);
  const favorite = favoritePkmnIds.includes(pkmn?.id) || false;

  // TODO: Make this behavior more readable.
  // Show the login prompt if the user is not logged in, otherwise toggle favorite
  const onClick = user ? () => toggleFavorite(user, pkmn) : () => showLoginPrompt();
  return (
    <MenuBar mode={pokedexMode} buttonAction={buttonAction} icon={faArrowLeftLong}>
      <div className={styles.menuBarContent}>
        {pkmn ? (
          <button onClick={onClick} className={styles.favoriteButton}>
            <img
              className={styles.favoriteIcon}
              src={favorite ? heartFavorite : heartDefault}
              alt="favorite icon"
            />
          </button>
        ) : null}
        <span>{pkmn?.name || '---'}</span>
        <span>#{natlDexNum || '---'}</span>
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
