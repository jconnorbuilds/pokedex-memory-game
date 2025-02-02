import { useState, useCallback, useRef } from 'react'; // pokedex screen styles
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
  pokedexMode,
  setPokedexMode,
  currentPokemonId,
  handlePkmnSelection,
  fetchPokemonDetails,
  isLoading,
  loadingFinished,
  progress,
  pokedexAngle,
  evolutionChain,
  screenOn = true,
}) {
  const [filteredPkmn, setFilteredPkmn] = useState([]); // Update to use dict instead of array

  const pkmnToDisplay = Object.keys(filteredPkmn).length ? filteredPkmn : pokemonList;
  const currPkmn = pokemonList[currentPokemonId];

  // We create a reference for the InfiniteLoader
  const infiniteLoaderRef = useRef(null);
  const hasMountedRef = useRef(false);

  function renderMainContent(mode) {
    if (mode === 'singlePkmn') {
      return (
        <DisplaySinglePkmnMode
          pokemonList={pokemonList}
          currentPokemonId={currentPokemonId}
          handlePkmnSelection={handlePkmnSelection}
          evolutionChain={evolutionChain}
        />
      );
    } else if (mode === 'list') {
      return (
        <DisplayListMode
          allPokemon={pokemonList}
          infiniteLoaderRef={infiniteLoaderRef}
          pkmnToDisplay={pkmnToDisplay}
          selectPokemon={handlePkmnSelection}
          fetchPokemonDetails={fetchPokemonDetails}
          isLoading={isLoading}
        />
      );
    }
  }

  const doFilterPkmn = useCallback(
    (filterString) => {
      const entries = Object.entries(pokemonList);
      const filteredEntries = entries.filter(([, pkmn]) =>
        pkmn.name.includes(filterString),
      );
      // const filteredPkmn = filteredValues.reduce((acc, cur, idx) => {
      //   return { ...acc, [idx]: cur };
      // }, {});
      // const filteredPkmn = Object.fromEntries(filteredEntries);

      // Re-index the filtered pokemon, and save the original index as a property
      const filteredPkmn = filteredEntries.reduce((acc, cur, idx) => {
        const pkmn = { ...cur[1], idx: cur[0] };
        return { ...acc, [idx]: pkmn };
      }, {});

      console.log(filteredPkmn);

      if (hasMountedRef.current) {
        if (infiniteLoaderRef.current) {
          console.log('RESET');
          infiniteLoaderRef.current.resetloadMoreItemsCache();
        }
      }
      hasMountedRef.current = true;

      return filteredPkmn;
    },
    [pokemonList],
  );

  function filterPkmn(filterString) {
    !filterString
      ? setFilteredPkmn(pokemonList)
      : setFilteredPkmn(doFilterPkmn(filterString, pokemonList));
  }

  function renderMenuBar(pokedexMode) {
    if (pokedexMode === 'singlePkmn') {
      const loading = currentPokemonId === undefined || !currPkmn?.fullyLoaded;

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
