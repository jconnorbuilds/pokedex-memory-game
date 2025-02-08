export default function Button({ action, value, className, children }) {
  return (
    <button value={value} className={className} onClick={action}>
      {children}
    </button>
  );
}
