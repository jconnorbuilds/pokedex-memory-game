import styles from '../styles/LoadingContent.module.css';

export default function LoadingContent({ isLoading, children }) {
  return (
    <div id="loading-screen" className={isLoading ? styles.shown : styles.hidden}>
      {children}
    </div>
  );
}
