import { useState } from 'react';
import pdxStyles from '../styles/MainDisplay.module.css'; // pokedex screen styles
import LoadingBar from './LoadingBar.jsx';
import MenuBar from './MenuBar.jsx';
import Button from './Button.jsx';
import PokemonTypes from './PokemonTypes.jsx';

export default function MainDisplay({
  allPokemon,
  currentPokemon,
  setCurrentPokemon,
  isLoading,
  loadingFinished,
  progress,
}) {
  const [pokedexMode, setPokedexMode] = useState('single-pkmn');

  const sprite = currentPokemon?.data.sprites.other['home'].front_default;
  const name = currentPokemon?.name || '---';
  const nationalDexNumber =
    currentPokemon?.speciesData.pokedex_numbers[0].entry_number || 0;

  const selectPokemon = (pokemonName) => {
    setCurrentPokemon(allPokemon.find((pkmn) => pkmn.name === pokemonName));
    setPokedexMode('single-pkmn');
  };

  const renderSinglePkmnMode = () => {
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

  const renderListMode = () => {
    return (
      <div className={pdxStyles.pokemonList} tabIndex={0}>
        {allPokemon?.map((pkmn) => (
          <button
            onClick={(e) => selectPokemon(e.target.value)}
            value={pkmn.name}
            key={pkmn.name}
          >
            {pkmn.name}
          </button>
        ))}
      </div>
    );
  };

  const renderMainContent = (mode) => {
    if (mode === 'single-pkmn') {
      return renderSinglePkmnMode();
    } else if (mode === 'list-mode') {
      return renderListMode();
    }
  };

  return (
    <div className="screen screen--on">
      <MenuBar>
        <PokemonTypes currentPokemon={currentPokemon} loadingFinished={loadingFinished} />
        {loadingFinished && (
          <Button action={() => setPokedexMode('list-mode')} styles={pdxStyles}>
            Choose pkmn
          </Button>
        )}
      </MenuBar>
      {!loadingFinished ? (
        <LoadingBar isLoading={isLoading} hide={loadingFinished} progress={progress} />
      ) : (
        renderMainContent(pokedexMode)
      )}
    </div>
  );
}
