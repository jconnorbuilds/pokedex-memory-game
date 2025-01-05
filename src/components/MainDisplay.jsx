import { useState } from 'react';
import pdxStyles from '../styles/MainDisplay.module.css'; // pokedex screen styles
import mbStyles from '../styles/PokedexMenuBar.module.css';
import LoadingBar from './LoadingBar.jsx';
import MenuBar from './MenuBar.jsx';
import Button from './Button.jsx';
import PokemonTypes from './PokemonTypes.jsx';
import PokemonListFilter from './PokemonListFilter.jsx';
import DisplayListMode from './DisplayListMode.jsx';

export default function MainDisplay({
  allPokemon,
  currentPokemon,
  setCurrentPokemon,
  isLoading,
  loadingFinished,
  progress,
}) {
  const [pokedexMode, setPokedexMode] = useState('singlePkmn');
  const [filteredPkmn, setFilteredPkmn] = useState(allPokemon);

  const sprite = currentPokemon?.data.sprites.other['home'].front_default;
  const name = currentPokemon?.name || '---';
  const nationalDexNumber =
    currentPokemon?.speciesData.pokedex_numbers[0].entry_number || 0;

  const selectPokemon = (pokemonName) => {
    setCurrentPokemon(allPokemon.find((pkmn) => pkmn.name === pokemonName));
    setPokedexMode('singlePkmn');
  };

  const DisplaySinglePkmnMode = ({}) => {
    return (
      <>
        <div className={pdxStyles.pokemonImg}>
          <img className={pdxStyles.sprite} src={sprite ? sprite : '#'} alt="a pokemon" />
        </div>
        <div className={pdxStyles.basicInfo}>
          <div className="pokemon-info__name">{name ? name : '...'}</div>
          <div className="pokemon-info__number">
            #{nationalDexNumber ? nationalDexNumber : '...'}
          </div>
        </div>
      </>
    );
  };

  const renderMainContent = (mode) => {
    if (mode === 'singlePkmn') {
      return <DisplaySinglePkmnMode />;
    } else if (mode === 'list') {
      return (
        <DisplayListMode
          filteredPkmn={filteredPkmn}
          selectPokemon={selectPokemon}
          styles={pdxStyles}
        />
      );
    }
  };

  function filterPkmn(e) {
    const allPkmn = [...allPokemon];
    const filtered = allPkmn.filter((pkmn) => {
      return pkmn.name.includes(e.target.value.toLowerCase());
    });
    setFilteredPkmn(filtered);
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
    <div className="screen screen--on">
      {renderMenuBar(pokedexMode)}
      {!loadingFinished ? (
        <LoadingBar isLoading={isLoading} hide={loadingFinished} progress={progress} />
      ) : (
        renderMainContent(pokedexMode)
      )}
    </div>
  );
}
