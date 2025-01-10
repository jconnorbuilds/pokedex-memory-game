import { useState } from 'react'; // pokedex screen styles
import mbStyles from '../styles/PokedexMenuBar.module.css';
import LoadingBar from './LoadingBar.jsx';
import MenuBar from './MenuBar.jsx';
import Button from './Button.jsx';
import PokemonTypes from './PokemonTypes.jsx';
import PokemonListFilter from './PokemonListFilter.jsx';
import DisplayListMode from './DisplayListMode.jsx';
import DisplaySinglePkmnMode from './DisplaySinglePkmnMode.jsx';
import styles from '../styles/MainDisplay.module.css';

export default function MainDisplay({
  allPokemon,
  currentPokemon,
  setCurrentPokemon,
  isLoading,
  loadingFinished,
  progress,
  screenOn = true,
}) {
  const [pokedexMode, setPokedexMode] = useState('singlePkmn');
  const [filteredPkmn, setFilteredPkmn] = useState(allPokemon);

  const selectPokemon = (pokemonName) => {
    const selected = allPokemon.find((pkmn) => pkmn.name === pokemonName);

    setCurrentPokemon(selected);
    setPokedexMode('singlePkmn');
  };

  const renderMainContent = (mode) => {
    if (mode === 'singlePkmn') {
      return <DisplaySinglePkmnMode currentPokemon={currentPokemon} />;
    } else if (mode === 'list') {
      return (
        <DisplayListMode
          filteredPkmn={filteredPkmn ?? allPokemon}
          selectPokemon={selectPokemon}
        />
      );
    }
  };

  function filterPkmn(e) {
    const filterString = e.target.value?.toLowerCase();
    !filterString
      ? setFilteredPkmn(allPokemon)
      : setFilteredPkmn(allPokemon.filter((pkmn) => pkmn.name.includes(filterString)));
  }

  function renderMenuBar(pokedexMode) {
    if (pokedexMode === 'singlePkmn') {
      return (
        <MenuBar mode={pokedexMode}>
          <PokemonTypes
            currentPokemon={currentPokemon}
            loadingFinished={loadingFinished}
          />
          {loadingFinished && (
            <Button action={() => setPokedexMode('list')} styles={mbStyles}>
              Choose pkmn
            </Button>
          )}
        </MenuBar>
      );
    } else if (pokedexMode === 'list') {
      return (
        <MenuBar mode={pokedexMode}>
          <PokemonListFilter filterPkmn={filterPkmn}></PokemonListFilter>
          {loadingFinished && (
            <Button action={() => setPokedexMode('singlePkmn')} styles={mbStyles}>
              Back
            </Button>
          )}
        </MenuBar>
      );
    }
  }

  return (
    <div className={styles.screenBorder}>
      <div className={styles.screenWrapper}>
        <div
          className={`${styles[`${pokedexMode}Mode`]} ${screenOn ? styles.screenOn : ''}`}
        >
          {renderMenuBar(pokedexMode)}
          {!loadingFinished ? (
            <LoadingBar
              isLoading={isLoading}
              hide={loadingFinished}
              progress={progress}
            />
          ) : (
            renderMainContent(pokedexMode)
          )}
        </div>
      </div>
    </div>
  );
}
