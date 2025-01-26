import { useCallback, useEffect } from 'react';
import pokeballIcon from '../assets/images/pokeball.webp';

export default function PkmnListButton({
  pkmn,
  style,
  styles,
  selectPokemon,
  isLoading,
}) {
  // console.log(pkmn);
  const nationalDexNumber = pkmn?.speciesData?.pokedex_numbers[0].entry_number || 0;
  const pkmnIcon = pkmn?.data?.sprites.front_default;

  if (!pkmn) return <div>Loading...</div>;
  return (
    <button
      style={style}
      onClick={(e) => selectPokemon(e.target.closest('button').value)}
      value={pkmn.name}
    >
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
            width={'20px'}
            height={'20px'}
            src={pokeballIcon}
            alt="pokeball icon"
          />
        </div>
      </div>
    </button>
  );
}
