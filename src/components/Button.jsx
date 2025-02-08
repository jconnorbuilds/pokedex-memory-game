export default function Button({ action, children, styles = null }) {
  return (
    <button style={styles} onClick={action}>
      {children}
    </button>
  );
}
