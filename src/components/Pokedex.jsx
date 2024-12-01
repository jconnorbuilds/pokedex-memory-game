import '../styles/Pokedex.css';

export default function Pokedex({ children, toggleOpenClosed }) {
  return (
    <div className="pokedex" onClick={toggleOpenClosed}>
      {children}
    </div>
  );
}
