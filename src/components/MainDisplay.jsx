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
  const [filteredPkmn, setFilteredPkmn] = useState({});
  const pkmnToDisplay = Object.keys(filteredPkmn).length ? filteredPkmn : pokemonList;
  const currPkmn = pokemonList[currentPokemonId];

  const infiniteLoaderRef = useRef(null);

  const doFilterPkmn = useCallback(
    (filterString) => {
      const entries = Object.entries(pokemonList);
      const filteredEntries = entries.filter(([, pkmn]) =>
        pkmn.name.includes(filterString),
      );

      // Re-index the filtered pokemon
      const filteredPkmn = filteredEntries.reduce((acc, cur, idx) => {
        return { ...acc, [idx]: cur[1] };
      }, {});

      return filteredPkmn;
    },
    [pokemonList],
  );

  function filterPkmn(filterString) {
    !filterString ? setFilteredPkmn([]) : setFilteredPkmn(doFilterPkmn(filterString));
  }

  function renderMainContent(mode) {
    if (mode === 'singlePkmn') {
      return (
        <>
          <PkmnInfoBar
            pokedexMode={pokedexMode}
            natlDexNum={currPkmn?.speciesData.pokedex_numbers[0].entry_number}
            pkmnName={currPkmn?.name}
            buttonAction={() => setPokedexMode('list')}
          />
          <DisplaySinglePkmnMode
            pokemonList={pokemonList}
            currentPokemonId={currentPokemonId}
            handlePkmnSelection={handlePkmnSelection}
            evolutionChain={evolutionChain}
          />
        </>
      );
    } else if (mode === 'list') {
      return (
        <>
          <SearchBar
            pokedexMode={pokedexMode}
            buttonAction={() => setPokedexMode('singlePkmn')}
            filterPkmn={filterPkmn}
          />
          <DisplayListMode
            allPokemon={pokemonList}
            infiniteLoaderRef={infiniteLoaderRef}
            pkmnToDisplay={pkmnToDisplay}
            selectPokemon={handlePkmnSelection}
            fetchPokemonDetails={fetchPokemonDetails}
            isLoading={isLoading}
          />
        </>
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
            {renderMainContent(pokedexMode)}
          </div>
        </div>
      </div>
    </div>
  );
}
