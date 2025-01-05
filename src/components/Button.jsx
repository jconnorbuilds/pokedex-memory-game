export default function Button({ action, styles = null, children }) {
  return <button onClick={action}>{children}</button>;
}
