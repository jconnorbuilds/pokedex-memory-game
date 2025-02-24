import { useContext } from 'react';
import styles from '../styles/UserPanel.module.css';
import { AuthContext } from '../context/AuthContext.jsx';

export default function UserPanel({ logUserOut, logUserIn }) {
  const user = useContext(AuthContext);
  return (
    <div className={styles.userPanel}>
      <div className={styles.manageLogin}>
        <button onClick={() => logUserIn()} className={styles.logOut}>
          switch user
        </button>
        <button onClick={() => logUserOut()} className={styles.logOut}>
          log out
        </button>
      </div>
      <div className={styles.userInfo}>
        <div>{user.displayName}</div>
        <img src={user.photoURL} className={styles.avatar} alt="User avatar" />
      </div>
    </div>
  );
}
