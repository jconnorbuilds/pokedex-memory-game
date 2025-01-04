export default function GameArea({ pokedexIsOpen, children }) {
  return (
    <div className="game-area" style={pokedexIsOpen ? { transform: 'scale(0.75)' } : {}}>
      {children}
    </div>
  );
}
