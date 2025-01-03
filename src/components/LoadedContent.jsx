import styles from '../styles/MainDisplay.module.css';

export default function LoadedContent({ isLoading, children }) {
  return (
    <div id="loaded-content-wrapper">
      <div
        id="loaded-screen"
        className={isLoading ? styles.mainContentLoading : styles.mainContentShown}
      >
        {children}
      </div>
    </div>
  );
}
