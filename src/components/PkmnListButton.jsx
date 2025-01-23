import pokeballIcon from '../assets/images/pokeball.webp';

export default function PkmnListButton({ pkmn, style, styles, selectPokemon }) {
  // console.log(pkmn);
  const nationalDexNumber = pkmn?.speciesData.pokedex_numbers[0].entry_number || 0;
  const pkmnIcon = pkmn?.data.sprites.front_default;
  // const pkmnGif = pkmn?.data.sprites.other['showdown'].front_default;
  // const pkmnGif = pkmn?.data.sprites.versions['generation-ii'].crystal.front_transparent;
  return (
    <button
      style={style}
      onClick={(e) => selectPokemon(e.target.closest('button').value)}
      value={pkmn.name}
    >
      <span>{pkmn.name}</span>
      <div className={styles.pkmnInfo}>
        <span className={styles.dexNum}>#{nationalDexNumber}</span>

        <img
          className={styles.pokemonIcon}
          width="40px"
          height="40px"
          src={pkmnIcon}
          alt={`${pkmn.name} icon`}
        />

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
