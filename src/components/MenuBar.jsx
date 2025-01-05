import styles from '../styles/PokedexMenuBar.module.css'; // pokedex screen styles

export default function MenuBar({ mode, children }) {
  const className = `menuBar${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
  return <div className={styles[className]}>{children}</div>;
}
