import PokemonTypes from './PokemonTypes.jsx';
import styles from '../styles/DisplaySinglePkmnMode.module.css';
import EvolutionChart from './EvolutionChart.jsx';

export default function DisplaySinglePkmnMode({ currentPokemon, evolutionChain }) {
  const sprite = currentPokemon?.data.sprites.other['home'].front_default;
  const ability = currentPokemon?.data.abilities[0].ability.name;
  return (
    <div className={styles.screen}>
      <div className={styles.imageArea}>
        <div className={styles.pokemonImg}>
          <img src={sprite ? sprite : '#'} alt="a pokemon" />
        </div>
      </div>
      <div className={styles.infoArea}>
        <div className={styles.infoLeft}>
          <h3>Evolution Chain</h3>
          {evolutionChain && (
            <EvolutionChart
              evolutionChain={evolutionChain}
              currentPokemon={currentPokemon}
            />
          )}
        </div>
        <div className={styles.infoRight}>
          <h3>Type</h3>
          <PokemonTypes currentPokemon={currentPokemon}></PokemonTypes>
          <h3>Ability</h3>
          <p className={styles.abilityText}>{ability}</p>
        </div>
      </div>
    </div>
  );
}
