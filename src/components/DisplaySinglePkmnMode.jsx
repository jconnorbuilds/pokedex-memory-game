import styles from '../styles/DisplaySinglePkmnMode.module.css';

export default function DisplaySinglePkmnMode({ currentPokemon }) {
  const sprite = currentPokemon?.data.sprites.other['home'].front_default;
  const name = currentPokemon?.name || '---';
  const nationalDexNumber =
    currentPokemon?.speciesData.pokedex_numbers[0].entry_number || 0;

  return (
    <div className={styles.screen}>
      <div className={styles.imageArea}>
        <div className={styles.pokemonImg}>
          <img src={sprite ? sprite : '#'} alt="a pokemon" />
        </div>
      </div>
      <div className={styles.infoArea}>dummy content</div>
    </div>
  );
}
