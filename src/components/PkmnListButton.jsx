import pokeballIcon from '../assets/images/pokeball.webp';
import styles from '../styles/PkmnListButton.module.css';

export default function PkmnListButton({ index, pkmnToDisplay, rwStyles, onClick }) {
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
          <img
            className={styles.pokeballIcon}
            width={'1.5rem'}
            height={'1.5rem'}
            src={pokeballIcon}
            alt="pokeball icon"
          />
        </div>
      </div>
    </button>
  );
}
