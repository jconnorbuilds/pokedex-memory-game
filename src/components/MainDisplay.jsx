import styles from '../styles/MainDisplay.module.css';
import useDelay from './useDelay.jsx';

export default function MainDisplay({ isLoading, wait, children }) {
  const showContent = useDelay(isLoading, wait);

  return (
    <div className={showContent ? styles.mainContentShown : styles.mainContentLoading}>
      {children}
    </div>
  );
}
