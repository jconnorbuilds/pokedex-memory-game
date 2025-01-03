export default function Button({ action, styles, children }) {
  return (
    <button onClick={action} className={styles.showList}>
      {children}
    </button>
  );
}
