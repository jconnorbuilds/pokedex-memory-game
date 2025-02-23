import styles from '../styles/UserPanel.module.css';

export default function UserPanel({ logUserOut }) {
  return (
    <div className={styles.userPanel}>
      <div className={styles.userInfo}>
        <div>jconnorbuilds</div>
        <div className={styles.avatarPlaceholder}>JC</div>
      </div>
      <button onClick={() => logUserOut()} className={styles.logOut}>
        Log out
      </button>
    </div>
  );
}
