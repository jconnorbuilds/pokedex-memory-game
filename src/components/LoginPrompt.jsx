import styles from '../styles/LoginPrompt.module.css';
import heart from '../assets/images/heart-solid.svg';
import Login from './Login.jsx';

export default function LoginPrompt({ open, hide, logUserIn }) {
  return (
    <>
      {open ? <div className={styles.backdrop}></div> : null}
      <dialog open={open} className={styles.loginModal}>
        <h1>
          Save favorites
          <img className={styles.heartIcon} src={heart} alt="" />
        </h1>
        <hr />
        <p>
          To keep track of your favorite
          <img className={styles.heartIcon} src={heart} alt="" /> Pokémon,{' '}
          <Login logUserIn={logUserIn} /> with your Google account!
        </p>
        <button onClick={hide} className={styles.noThanks}>
          No thanks
        </button>
      </dialog>
    </>
  );
}
