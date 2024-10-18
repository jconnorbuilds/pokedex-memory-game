export default function Card({ color }) {
  // style={{ backgroundColor: color.hex }}
  return (
    <>
      <div style={{ backgroundColor: '#' + color.hex }} className="card">
        <div className="picture"></div>
      </div>
    </>
  );
}
