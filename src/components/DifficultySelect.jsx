import Button from './Button.jsx';
import * as Game from './constants.js';

export default function DifficultySelect({ level, handleSelect, styles }) {
  console.log('Level: ', level);
  return (
    <div className={styles.difficultySelect}>
      <h2>Difficulty</h2>
      <div onClick={handleSelect} className={styles.menuSection}>
        {Game.LEVELS.map((lvl) => {
          const selectedClass = lvl.name === level?.name ? styles.selected : '';
          return (
            <Button key={lvl.name} value={lvl.name} className={selectedClass}>
              {lvl.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
