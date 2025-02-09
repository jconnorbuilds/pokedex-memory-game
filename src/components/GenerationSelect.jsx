// import MenuButton from './MenuButton.jsx';
import Button from './Button.jsx';
import * as Game from './constants.js';

export default function GenerationSelect({ generation, styles, handleSelect }) {
  return (
    <>
      <h2>Generation</h2>
      <div onClick={handleSelect} className={styles.genSelectBtns}>
        {Array(10)
          .fill('')
          .map((_, idx) => {
            const genNumber = idx + 1;
            const needsLabel = genNumber <= Game.NUM_OF_GENERATIONS;
            return (
              <Button
                key={genNumber}
                className={+generation === genNumber ? 'selected' : ''}
                value={needsLabel ? genNumber : 0}
              >
                {needsLabel ? genNumber : ''}
              </Button>
            );
          })}
      </div>
    </>
  );
}
