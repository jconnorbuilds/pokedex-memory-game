import styles from '../styles/PokedexMenuBar.module.css'; // pokedex screen styles
import Button from './Button.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faClose } from '@fortawesome/free-solid-svg-icons';
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

export function PkmnInfoBar({ pokedexMode, natlDexNum, pkmnName, buttonAction }) {
  return (
    <MenuBar mode={pokedexMode} buttonAction={buttonAction} icon={faArrowLeftLong}>
      <div>
        <span>{pkmnName}</span>
        <span>#{natlDexNum}</span>
      </div>
    </MenuBar>
  );
}

export function SearchBar({ pokedexMode, filterPkmn, buttonAction }) {
  return (
    <MenuBar mode={pokedexMode} buttonAction={buttonAction} buttonIcon={faClose}>
      <PokemonListFilter filterPkmn={filterPkmn}></PokemonListFilter>
    </MenuBar>
  );
}
