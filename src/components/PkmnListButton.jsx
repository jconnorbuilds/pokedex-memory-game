import pokeballIcon from '../assets/images/pokeball.webp';
import heartDefault from '../assets/images/heart-regular.svg';
import heartFavorite from '../assets/images/heart-solid.svg';

import styles from '../styles/PkmnListButton.module.css';

export default function PkmnListButton({
  index,
  pkmnToDisplay,
  favorite,
  rwStyles,
  onClick,
}) {
  const pkmn = pkmnToDisplay[index];
  const nationalDexNumber = +pkmn?.speciesData?.pokedex_numbers[0].entry_number || 0;
  const pkmnIcon = pkmn?.data?.sprites.front_default;
  const isLoading = !pkmn?.fullyLoaded;

  if (!pkmn) return <div>Loading...</div>;
  return (
    <button style={rwStyles} onClick={onClick} value={pkmn.name}>
      <span>{pkmn.name}</span>
      <div className={styles.pkmnInfo}>
        <span className={styles.dexNum}>#{nationalDexNumber}</span>
        {isLoading ? (
          <div>...</div>
        ) : (
          <img
            className={styles.pokemonIcon}
            width="40px"
            height="40px"
            src={pkmnIcon}
            alt={`${pkmn.name} icon`}
          />
        )}
        <div className={styles.icons}>
          {favorite && (
            <img className={styles.favorite} src={heartFavorite} alt="favorite icon" />
          )}
          <img className={styles.pokeballIcon} src={pokeballIcon} alt="pokeball icon" />
        </div>
      </div>
    </button>
  );
}
