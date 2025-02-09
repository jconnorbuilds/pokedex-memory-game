import MenuButton from './MenuButton.jsx';
import * as Game from './constants.js';

export default function DifficultySelect({ styles, handleSelect }) {
  return (
    <>
      <h2>Difficulty</h2>
      <div onClick={handleSelect} className={styles.difficultySelectBtns}>
        {Game.LEVELS.map((level) => (
          <MenuButton key={level.name} value={level.name}>
            {level.name}
          </MenuButton>
        ))}
      </div>
    </>
  );
}
