import styles from '../styles/LoadingContent.module.css';

export default function LoadingContent({ loadingFinished, children }) {
  return (
    <div id="loading-screen" className={loadingFinished ? styles.hidden : styles.shown}>
      {children}
    </div>
  );
}
