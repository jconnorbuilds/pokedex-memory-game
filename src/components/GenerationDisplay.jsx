import MenuButton from './MenuButton.jsx';

const NUM_OF_GENERATIONS = 9;

export default function GenerationDisplay({ children }) {
  return (
    <>
      {Array(NUM_OF_GENERATIONS)
        .fill('')
        .map((_, idx) => {
          const genNumber = idx + 1;
          return (
            <MenuButton key={genNumber} value={genNumber}>
              {genNumber}
            </MenuButton>
          );
        })}
      <div className="gen-container">{children}</div>;
    </>
  );
}
