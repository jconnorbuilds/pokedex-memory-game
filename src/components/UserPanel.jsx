import styles from '../styles/UserPanel.module.css';

export default function UserPanel({ user, logUserOut }) {
  return (
    <div className={styles.userPanel}>
      <div className={styles.userInfo}>
        <div>{user.displayName}</div>
        <div className={styles.avatar}>{getInitials(user.displayName)}</div>
      </div>
      <button onClick={() => logUserOut()} className={styles.logOut}>
        Log out
      </button>
    </div>
  );
}

function getInitials(name) {
  return name.split(' ').map((n) => n[0].toUpperCase());
}
