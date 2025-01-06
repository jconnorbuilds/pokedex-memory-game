import styles from '../styles/DisplaySinglePkmnMode.module.css';

export default function DisplaySinglePkmnMode({ currentPokemon }) {
  const sprite = currentPokemon?.data.sprites.other['home'].front_default;
  const name = currentPokemon?.name || '---';
  const nationalDexNumber =
    currentPokemon?.speciesData.pokedex_numbers[0].entry_number || 0;

  return (
    <>
      <div className={styles.pokemonImg}>
        <img className={styles.sprite} src={sprite ? sprite : '#'} alt="a pokemon" />
      </div>
      <div className={styles.basicInfo}>
        <div className="pokemon-info__name">{name ? name : '...'}</div>
        <div className="pokemon-info__number">
          #{nationalDexNumber ? nationalDexNumber : '...'}
        </div>
      </div>
    </>
  );
}
