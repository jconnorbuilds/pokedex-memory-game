import PokemonTypes from './PokemonTypes.jsx';
import styles from '../styles/DisplaySinglePkmnMode.module.css';
import EvolutionChart from './EvolutionChart.jsx';

export default function DisplaySinglePkmnMode({
  pokemonList,
  currentPokemonId,
  evolutionChain,
  handlePkmnSelection,
}) {
  const allPkmn = Object.values(pokemonList);
  const currPkmn = allPkmn.find((pkmn) => pkmn.idx === currentPokemonId);
  const loading = !currPkmn?.fullyLoaded;

  const sprite = loading ? '#' : currPkmn?.data.sprites.other['home'].front_default;
  const ability = loading ? '...' : currPkmn?.data.abilities[0].ability.name;
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
              pokemonList={pokemonList}
              evolutionChain={evolutionChain}
              handlePkmnSelection={handlePkmnSelection}
              currentPokemonId={currentPokemonId}
            />
          )}
        </div>
        <div className={styles.infoRight}>
          <h3>Type</h3>
          <PokemonTypes currentPokemon={currPkmn}></PokemonTypes>
          <h3>Ability</h3>
          <p className={styles.abilityText}>{ability}</p>
        </div>
      </div>
    </div>
  );
}
