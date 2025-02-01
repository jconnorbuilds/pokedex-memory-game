import { useState, useCallback, useEffect } from 'react'; // pokedex screen styles
import mbStyles from '../styles/PokedexMenuBar.module.css';
import LoadingBar from './LoadingBar.jsx';
import MenuBar from './MenuBar.jsx';
import Button from './Button.jsx';
import PokemonListFilter from './PokemonListFilter.jsx';
import DisplayListMode from './DisplayListMode.jsx';
import DisplaySinglePkmnMode from './DisplaySinglePkmnMode.jsx';
import styles from '../styles/MainDisplay.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export default function MainDisplay({
  pokemonList,
  currentPokemonId,
  setCurrentPokemon,
  pokedexMode,
  setPokedexMode,
  handlePkmnSelection,
  fetchPokemonDetails,
  isLoading,
  loadingFinished,
  progress,
  pokedexAngle,
  screenOn = true,
  evolutionChain,
}) {
  const [filteredPkmn, setFilteredPkmn] = useState([]); // Update to use dict instead of array

  const pkmnToDisplay = filteredPkmn.length ? filteredPkmn : pokemonList;
  const currPkmn = pokemonList[currentPokemonId];

  function renderMainContent(mode) {
    if (mode === 'singlePkmn') {
      return (
        <DisplaySinglePkmnMode
          pokemonList={pokemonList}
          // currentPokemon={currPkmn}
          currentPokemonId={currentPokemonId}
          handlePkmnSelection={handlePkmnSelection}
          evolutionChain={evolutionChain}
        />
      );
    } else if (mode === 'list') {
      return (
        <DisplayListMode
          pkmnToDisplay={pkmnToDisplay}
          selectPokemon={handlePkmnSelection}
          fetchPokemonDetails={fetchPokemonDetails}
          isLoading={isLoading}
        />
      );
    }
  }

  function filterPkmn(e) {
    const filterString = e.target.value?.toLowerCase();
    !filterString
      ? setFilteredPkmn(pokemonList)
      : setFilteredPkmn(pokemonList.filter((pkmn) => pkmn.name.includes(filterString)));
  }

  function renderMenuBar(pokedexMode) {
    if (pokedexMode === 'singlePkmn') {
      // console.log('A pkmn', currentPokemon);
      const loading = !currentPokemonId || !currPkmn?.fullyLoaded;

      const nationalDexNumber = loading
        ? '...'
        : currPkmn?.speciesData.pokedex_numbers[0].entry_number || 0;
      return (
        <MenuBar mode={pokedexMode}>
          {loadingFinished && (
            <>
              <div>
                <span>{currPkmn?.name}</span>
                <span>#{nationalDexNumber}</span>
              </div>
              <Button action={() => setPokedexMode('list')} styles={mbStyles}>
                <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
              </Button>
            </>
          )}
        </MenuBar>
      );
    } else if (pokedexMode === 'list') {
      return (
        <MenuBar mode={pokedexMode}>
          <PokemonListFilter filterPkmn={filterPkmn}></PokemonListFilter>
          {loadingFinished && (
            <Button action={() => setPokedexMode('singlePkmn')} styles={mbStyles}>
              <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
            </Button>
          )}
        </MenuBar>
      );
    }
  }

  return (
    <div className={styles.screenBorder}>
      <div
        className={styles.screenGlare}
        style={{
          '--glare-angle': `${70 - pokedexAngle.x / 2}deg`,
          '--pos1': `${50 - pokedexAngle.y / 2}%`,
          '--pos2': `${50 - pokedexAngle.y / 2}%`,
        }}
      ></div>
      <div id="screen-wrapper" className={styles.screenWrapper}>
        <div className={styles.screenContent}>
          <div
            className={`${styles[`${pokedexMode}Mode`]} ${
              screenOn ? styles.screenOn : ''
            }`}
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
    </div>
  );
}
