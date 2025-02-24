import { useCallback, useState, useContext } from 'react';
// pokedex screen styles
import styles from '../styles/MainDisplay.module.css';
import DisplayListMode from './DisplayListMode.jsx';
import DisplaySinglePkmnMode from './DisplaySinglePkmnMode.jsx';
import { PkmnInfoBar, SearchBar } from './MenuBar.jsx';
import useFavorites from '../hooks/useFavorites.js';
import { AuthContext } from '../context/AuthContext.jsx';

export default function MainDisplay({
  pokemonDict,
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
  const [filteredPkmnIds, setFilteredPkmnIds] = useState([]);
  const user = useContext(AuthContext);
  const { favoritePkmnIds } = useFavorites({ user });
  const filteredPkmn = filteredPkmnIds.reduce((acc, curr, i) => {
    // Retrieve the pokemon object by its id, and re-index it for infinite scrolling compatibility
    return { ...acc, [i]: Object.values(pokemonDict).find((pkmn) => pkmn.id === curr) };
  }, {});

  const pkmnToDisplay = Object.keys(filteredPkmn).length ? filteredPkmn : pokemonDict;
  const currPkmn = Object.values(pokemonDict).find(
    (pkmn) => pkmn.id === currentPokemonId,
  );

  const doFilterPkmn = useCallback(
    (filterString) => {
      const values = Object.values(pokemonDict);
      const filteredValues = values.filter((pkmn) => pkmn.name.includes(filterString));
      const ids = filteredValues.map((pkmn) => pkmn.id);
      return ids;
    },
    [pokemonDict],
  );

  function filterPkmn(filterString) {
    filterString
      ? setFilteredPkmnIds(doFilterPkmn(filterString))
      : setFilteredPkmnIds([]);
  }

  function renderMainContent(mode) {
    if (mode === 'singlePkmn') {
      return (
        <>
          <PkmnInfoBar
            pokedexMode={pokedexMode}
            natlDexNum={currPkmn?.speciesData?.pokedex_numbers[0]?.entry_number}
            pkmn={currPkmn}
            favoritePkmnIds={favoritePkmnIds}
            buttonAction={() => setPokedexMode('list')}
          />
          <DisplaySinglePkmnMode
            pokemonDict={pokemonDict}
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
            pkmnToDisplay={pkmnToDisplay}
            selectPokemon={handlePkmnSelection}
            fetchPokemonDetails={fetchPokemonDetails}
            isLoading={isLoading}
            favoritePkmnIds={favoritePkmnIds}
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
