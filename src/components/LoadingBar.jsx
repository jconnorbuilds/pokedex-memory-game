import styles from '../styles/LoadingBar.module.css';

export default function LoadingBar({ loadingFinished, progress }) {
  return (
    <div className={styles.loadingWrapper}>
      <p>Loading...</p>
      <div className={styles.progressBarOuter}>
        <div
          className={loadingFinished ? styles.progressBarFull : styles.progressBar}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
