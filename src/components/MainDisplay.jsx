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
  currentPokemon,
  setCurrentPokemon,
  fetchPokemonDetails,
  isLoading,
  loadingFinished,
  progress,
  pokedexAngle,
  screenOn = true,
  evolutionChain,
}) {
  const [pokedexMode, setPokedexMode] = useState('list');
  const [filteredPkmn, setFilteredPkmn] = useState([]); // Update to use dict instead of array

  const pkmnToDisplay = filteredPkmn.length ? filteredPkmn : pokemonList;

  const selectPokemon = useCallback(
    (id) => {
      let selected;
      if (typeof id === 'number') {
        selected = pokemonList[id];
        // console.log(selected);

        setCurrentPokemon(selected);
        setPokedexMode('singlePkmn');
      } else if (typeof id === 'string') {
        const key = +Object.entries(pokemonList).find(([idx, pkmn]) => {
          return pkmn.name === id;
        })[0];

        selected = pokemonList[key];
        console.log(selected);
        setCurrentPokemon(selected);
        setPokedexMode('singlePkmn');
      }
    },

    [pokemonList, setCurrentPokemon],
  );

  function renderMainContent(mode) {
    if (mode === 'singlePkmn') {
      return (
        <DisplaySinglePkmnMode
          currentPokemon={currentPokemon}
          selectPokemon={selectPokemon}
          evolutionChain={evolutionChain}
        />
      );
    } else if (mode === 'list') {
      return (
        <DisplayListMode
          pkmnToDisplay={pkmnToDisplay}
          selectPokemon={selectPokemon}
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
      const loading = !currentPokemon || !currentPokemon?.fullyLoaded;

      const nationalDexNumber = loading
        ? '...'
        : currentPokemon?.speciesData.pokedex_numbers[0].entry_number || 0;
      return (
        <MenuBar mode={pokedexMode}>
          {loadingFinished && (
            <>
              <div>
                <span>{currentPokemon?.name}</span>
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
