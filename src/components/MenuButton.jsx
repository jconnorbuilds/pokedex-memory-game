export default function MenuButton({ className, value, children }) {
  return (
    <button className={className} value={value}>
      {children}
    </button>
  );
}
