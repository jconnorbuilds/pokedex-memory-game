import styles from '../styles/LoadingBar.module.css';

export default function LoadingBar({ isLoading, progress }) {
  return (
    <div className={styles.loadingWrapper}>
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
