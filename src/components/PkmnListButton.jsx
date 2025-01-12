import pokeballIcon from '../assets/images/pokeball.webp';
import { useState } from 'react';

export default function PkmnListButton({ pkmn, styles, selectPokemon }) {
  const [isHovered, setIsHovered] = useState(false);

  const nationalDexNumber = pkmn?.speciesData.pokedex_numbers[0].entry_number || 0;
  const pkmnIcon = pkmn?.data.sprites.front_default;
  const pkmnGif = pkmn?.data.sprites.other['showdown'].front_default;
  return (
    <button
      onClick={(e) => selectPokemon(e.target.closest('button').value)}
      value={pkmn.name}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{pkmn.name.charAt(0).toUpperCase() + pkmn.name.slice(1)}</span>
      <div className={styles.pkmnInfo}>
        <span className={styles.dexNum}>#{nationalDexNumber}</span>
        <div className={styles.icons}>
          <img
            className={styles.pokemonIcon}
            width={'40px'}
            height={'40px'}
            src={isHovered ? pkmnGif : pkmnIcon}
            alt={`${pkmn.name} icon`}
          />
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
