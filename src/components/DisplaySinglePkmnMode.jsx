import PokemonTypes from './PokemonTypes.jsx';
import styles from '../styles/DisplaySinglePkmnMode.module.css';
import EvolutionChart from './EvolutionChart.jsx';

export default function DisplaySinglePkmnMode({
  pokemonDict,
  currentPokemonId,
  evolutionChain,
  handlePkmnSelection,
}) {
  // Extract the pokemon objects from the pokemonDict object, and get the current pokemon
  const pokemonList = Object.values(pokemonDict);
  const currentPkmn = pokemonList.find((pkmn) => pkmn.id === currentPokemonId);

  // Parse the pokemon data to display the sprite and ability, or a placeholder if the data is still loading
  const loading = !currentPkmn?.fullyLoaded;
  const sprite = loading ? '#' : currentPkmn?.data.sprites.other['home'].front_default;
  const ability = loading ? '...' : currentPkmn?.data.abilities[0].ability.name;

  // TODO: Create a loading spinner for the evolution chart
  return (
    <div className={styles.screen}>
      <div className={styles.imageArea}>
        <div className={styles.pokemonImg}>
          <img src={sprite} alt="pkmn icon" />
        </div>
      </div>
      <div className={styles.infoArea}>
        <div className={styles.infoLeft}>
          <h3>Evolution Chain</h3>
          {evolutionChain && (
            <EvolutionChart
              evolutionChain={evolutionChain}
              handlePkmnSelection={handlePkmnSelection}
              currentPokemonId={currentPokemonId}
            />
          )}
        </div>
        <div className={styles.infoRight}>
          <h3>Type</h3>
          <PokemonTypes currentPkmn={currentPkmn}></PokemonTypes>
          <h3>Ability</h3>
          <p className={styles.abilityText}>{ability}</p>
        </div>
      </div>
    </div>
  );
}
