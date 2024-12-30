import styles from '../styles/LoadingBar.module.css';
import useDelay from './useDelay.jsx';

export default function LoadingBar({ isLoading, progress, wait }) {
  const hideLoader = useDelay(isLoading, wait);

  return (
    <div className={hideLoader ? styles.hidden : ''}>
      <p>Loading...</p>
      <div className={styles.progressBarOuter}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
