import Button from './Button.jsx';
import * as Game from '../utils/constants.js';

export default function GenerationSelect({ generation, styles, handleSelect }) {
  return (
    <div className={styles.generationSelect}>
      <h2>Generation</h2>
      <div onClick={handleSelect} className={styles.menuSection}>
        {Array(10)
          .fill('')
          .map((_, idx) => {
            if (idx === 9) return <button key={0} disabled></button>;

            const genNumber = idx + 1;
            const needsLabel = genNumber <= Game.NUM_OF_GENERATIONS;
            const selectedClass = +generation === genNumber ? styles.selected : '';
            return (
              <Button
                key={genNumber}
                className={selectedClass}
                value={needsLabel ? genNumber : 0}
              >
                {needsLabel ? genNumber : ''}
              </Button>
            );
          })}
      </div>
    </div>
  );
}
