import '../styles/Pokedex.css';

export default function Pokedex({ children, isOpen, toggleOpen, style }) {
  return (
    <div className="pokedex-wrapper">
      <div
        id="pokedex"
        className={`pokedex ${isOpen && 'pokedex--open'}`}
        onClick={toggleOpen}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
