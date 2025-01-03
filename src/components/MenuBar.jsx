import pdxStyles from '../styles/MainDisplay.module.css'; // pokedex screen styles

export default function MenuBar({ children }) {
  return <div className={pdxStyles.menuBar}>{children}</div>;
}
