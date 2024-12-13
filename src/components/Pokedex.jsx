import '../styles/Pokedex.css';

export default function Pokedex({ children, toggleOpenClosed, style }) {
  return (
    <div id="pokedex" className="pokedex" onClick={toggleOpenClosed} style={style}>
      {children}
    </div>
  );
}
