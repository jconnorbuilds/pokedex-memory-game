import { useEffect } from 'react';
import styles from '../styles/DisplaySinglePkmnMode.module.css';

export default function DisplaySinglePkmnMode({ currentPokemon }) {
  const sprite = currentPokemon?.data.sprites.other['home'].front_default;
  const name = currentPokemon?.name || '---';
  const nationalDexNumber =
    currentPokemon?.speciesData.pokedex_numbers[0].entry_number || 0;

  useEffect(() => {
    async function fetchEvolutionChain(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
    // TODO: Recursively get the evolution chain
    fetchEvolutionChain(currentPokemon.speciesData.evolution_chain.url).then((data) =>
      console.log(data),
    );
  }, [currentPokemon]);

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
