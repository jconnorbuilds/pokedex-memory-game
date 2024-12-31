import styles from '../styles/LoadingBar.module.css';
import useDelay from './useDelay.jsx';

export default function LoadingBar({ isLoading, progress, wait }) {
  const hideLoader = useDelay(isLoading, wait);
  const isLoadingOrHidden = isLoading || (!isLoading && hideLoader);
  const loadingClass = isLoadingOrHidden ? styles.progressBar : styles.progressBarFull;

  return (
    <div className="screen--loading">
      <div className={hideLoader ? styles.hidden : ''}>
        <p>Loading...</p>
        <div className={styles.progressBarOuter}>
          <div className={loadingClass} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
