import '../styles/Pokedex.css';

export default function Pokedex({ children, toggleOpenClosed }) {
  return (
    <div id="pokedex" className="pokedex" onClick={toggleOpenClosed}>
      {children}
    </div>
  );
}
