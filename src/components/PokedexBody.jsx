import LoadingBar from './LoadingBar.jsx';
import MainDisplay from './MainDisplay.jsx';
import LoadedContent from './LoadedContent.jsx';
import LoadingContent from './LoadingContent.jsx';

import pdxStyles from '../styles/MainDisplay.module.css'; // pokedex screen styles
import useDelay from './useDelay.jsx';

export default function PokedexBody({ pokemon, isLoading, progress }) {
  // const loadingFinished = false;
  const sprite = pokemon?.data.sprites.other['home'].front_default;
  const name = pokemon?.name;
  const nationalDexNumber = pokemon?.speciesData.pokedex_numbers[0].entry_number;

  const renderTypeDisplay = (loading) => {
    if (loading) {
      return (
        <div className={pdxStyles.type}>
          <span className={pdxStyles.typePillLoading}>---</span>
        </div>
      );
    } else if (pokemon) {
      return pokemon?.data.types.map((typeInfo) => {
        const typeName = typeInfo.type.name;
        const typeClassName =
          'typePill' + typeName.charAt(0).toUpperCase() + typeName.slice(1);
        return (
          <div key={typeInfo.type.name} className={pdxStyles.type}>
            <span className={pdxStyles[typeClassName]}>{typeName}</span>
          </div>
        );
      });
    }
  };

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
              <div id="screen-inner" className="screen-inner">
                <MainDisplay>
                  <LoadingContent isLoading={isLoading}>
                    <div className={pdxStyles.typeInfo}>
                      {renderTypeDisplay(isLoading)}
                    </div>
                    <LoadingBar isLoading={isLoading} progress={progress} />
                  </LoadingContent>
                  <LoadedContent isLoading={isLoading}>
                    <div className={pdxStyles.typeInfo}>
                      {renderTypeDisplay(isLoading)}
                    </div>

                    <div className={pdxStyles.pokemonImg}>
                      <img
                        className={pdxStyles.sprite}
                        src={sprite ? sprite : '#'}
                        alt="a pokemon"
                      />
                    </div>
                    <div className={pdxStyles.basicInfo}>
                      <div className="pokemon-info__name">{name ? name : '...'}</div>
                      <div className="pokemon-info__number">
                        #{nationalDexNumber ? nationalDexNumber : '...'}
                      </div>
                    </div>
                  </LoadedContent>
                </MainDisplay>
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
