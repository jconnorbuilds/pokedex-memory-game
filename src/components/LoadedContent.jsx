import styles from '../styles/MainDisplay.module.css';

export default function LoadedContent({ loadingFinished, children }) {
  return (
    <div
      id="loaded-screen"
      className={loadingFinished ? styles.mainContentShown : styles.mainContentLoading}
    >
      {children}
    </div>
  );
}
