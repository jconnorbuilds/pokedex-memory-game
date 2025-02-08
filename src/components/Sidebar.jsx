import styles from '../styles/Sidebar.module.css';

export default function Sidebar({ children }) {
  return <aside className={styles.sidebar}>{children}</aside>;
}
