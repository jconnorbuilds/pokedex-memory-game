import MenuButton from './MenuButton.jsx';
import * as Game from './constants.js';

export default function GenerationSelect({ generation, handleSelect }) {
  return (
    <>
      <h2>Generation</h2>
      <div onClick={handleSelect} className="lid__gen-buttons">
        {Array(10)
          .fill('')
          .map((_, idx) => {
            const genNumber = idx + 1;
            const needsLabel = genNumber <= Game.NUM_OF_GENERATIONS;
            return (
              <MenuButton
                key={genNumber}
                className={+generation === genNumber ? 'lid__button--selected' : ''}
                value={needsLabel ? genNumber : 0}
              >
                {needsLabel ? genNumber : ''}
              </MenuButton>
            );
          })}
      </div>
    </>
  );
}
