export default function PokedexBody({ children, pokemonData, pokemonSpeciesData }) {
  console.log(pokemonSpeciesData);
  const sprites = pokemonData?.map(
    (pokemon) => pokemon.sprites.other['home'].front_default,
  );
  const names = pokemonSpeciesData?.map((pokemon) => pokemon.name);
  const nationalDexNumbers = pokemonSpeciesData?.map(
    (pokemon) => pokemon.pokedex_numbers[0].entry_number,
  );

  return (
    <div className="pokedex__body pokedex-font">
      <div className="body__main">
        <div className="body__main__front face">
          <div className="body__upper-overhang">
            <div className="upper-overhang__front face">
              <svg viewBox="0 0 112.5 112.5" xmlns="http://www.w3.org/2000/svg">
                <g className="circle">
                  <circle className="circle__outer" cx="56.25" cy="56.25" r="35"></circle>
                  <circle className="circle__inner" cx="56.25" cy="56.25" r="30"></circle>
                </g>
              </svg>
            </div>

            <div className="upper-overhang__left vert-edge"></div>
            <div className="upper-overhang__right vert-edge"></div>
            <div className="upper-overhang__top horiz-edge"></div>
            <div className="upper-overhang__bottom flat1 horiz-edge"></div>
            <div className="upper-overhang__bottom flat2 horiz-edge"></div>
            <div className="upper-overhang__bottom slant1 horiz-edge"></div>
          </div>
          <div className="screen screen--on">
            <div className="screen-frame">
              <div className="screen-inner">
                {sprites ? (
                  <img
                    className="pokedex__pkmn-sprite"
                    src={sprites[0]}
                    alt="a pokemon"
                  />
                ) : (
                  <div className="loading-dex-sprites">Loading...</div>
                )}
                <div className="screen-text">
                  <div className="pokemon-info">
                    <div className="pokemon-info__name">{names ? names[0] : '...'}</div>
                    <div className="pokemon-info__number">
                      #{nationalDexNumbers ? nationalDexNumbers[0] : '...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="body__buttons">
            <div className="buttons__dpad"></div>
            <div className="buttons__ab">
              <div className="ab ab__a"></div>
              <div className="ab ab__b"></div>
            </div>
          </div>
        </div>
        <div className="body__main__left vert-edge"></div>
        <div className="body__main__right vert-edge"></div>
        <div className="body__main__top horiz-edge"></div>
        <div className="body__main__bottom horiz-edge"></div>
        <div className="body__main__back face"></div>
      </div>
    </div>
  );
}
