import styles from '../styles/PokedexLidDisplay.module.css';

export default function PokedexLidDisplay({ pokemon }) {
  return <div className={styles.lidDisplay}>{pokemon && pokemon.name}</div>;
}
