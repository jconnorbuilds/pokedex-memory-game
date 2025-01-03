import styles from '../styles/LoadingBar.module.css';

export default function LoadingBar({ isLoading, hide, progress }) {
  return (
    <div className={hide ? styles.hidden : styles.loadingWrapper}>
      <p>Loading...</p>
      <div className={styles.progressBarOuter}>
        <div
          className={isLoading ? styles.progressBar : styles.progressBarFull}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
