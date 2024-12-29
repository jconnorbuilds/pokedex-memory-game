import MenuButton from './MenuButton.jsx';

export default function DifficultySelect({ handleSelect, levels }) {
  return (
    <>
      <h2>Difficulty</h2>
      <div onClick={handleSelect} className="lid__difficulty-buttons">
        {levels.map((level) => (
          <MenuButton key={level.name} value={level.name}>
            {level.name}
          </MenuButton>
        ))}
      </div>
    </>
  );
}
