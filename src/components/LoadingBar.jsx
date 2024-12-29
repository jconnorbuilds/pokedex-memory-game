import styles from '../styles/LoadingBar.module.css';

export default function LoadingBar({ isLoading }) {
  let loadingAnimationClass = styles.loadingBarInit;

  if (!isLoading) {
    console.log('hitting me');
    setTimeout((loadingAnimationClass = styles.loadingBarFull), 2000);
  }

  return (
    <div className="screen--loading">
      <p>Loading...</p>
      <div className={loadingAnimationClass}></div>
    </div>
  );
}
