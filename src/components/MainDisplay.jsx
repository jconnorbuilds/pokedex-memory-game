import { useState, useCallback, useRef } from 'react';
// pokedex screen styles
import mbStyles from '../styles/PokedexMenuBar.module.css';
import LoadingBar from './LoadingBar.jsx';
import { SearchBar, PkmnInfoBar } from './MenuBar.jsx';
import DisplayListMode from './DisplayListMode.jsx';
import DisplaySinglePkmnMode from './DisplaySinglePkmnMode.jsx';
import styles from '../styles/MainDisplay.module.css';

export default function MainDisplay({
  pokemonList,
  pokedexMode,
  setPokedexMode,
  currentPokemonId,
  handlePkmnSelection,
  fetchPokemonDetails,
  isLoading,
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

      // Re-index the filtered pokemon, and save the original index as a property
      const filteredPkmn = filteredEntries.reduce((acc, cur, idx) => {
        return { ...acc, [idx]: cur[1] };
      }, {});

      // if (hasMountedRef.current) {
      //   if (infiniteLoaderRef.current) {
      //     console.log('RESET');
      //     infiniteLoaderRef.current.resetloadMoreItemsCache();
      //   }
      // }
      // hasMountedRef.current = true;

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
      return (
        <PkmnInfoBar
          pokedexMode={pokedexMode}
          natlDexNum={currPkmn?.speciesData.pokedex_numbers[0].entry_number}
          pkmnName={currPkmn?.name}
          buttonAction={() => setPokedexMode('list')}
        ></PkmnInfoBar>
      );
    } else if (pokedexMode === 'list') {
      return (
        <SearchBar
          pokedexMode={pokedexMode}
          filterPkmn={filterPkmn}
          buttonAction={() => setPokedexMode('singlePkmn')}
        ></SearchBar>
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
            {renderMainContent(pokedexMode)}
          </div>
        </div>
      </div>
    </div>
  );
}
