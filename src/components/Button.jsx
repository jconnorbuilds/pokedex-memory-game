export default function Button({ action, children, styles = null }) {
  return (
    <button className={styles} onClick={action}>
      {children}
    </button>
  );
}
