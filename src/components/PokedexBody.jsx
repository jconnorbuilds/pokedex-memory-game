export default function PokedexBody({ children }) {
  return (
    <div className="pokedex__body">
      <svg
        className="body__upper"
        viewBox="0 0 100 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="circle">
          <circle className="circle__outer" cx="12" cy="10" r="8"></circle>
          <circle className="circle__inner" cx="12" cy="10" r="7"></circle>
        </g>

        <path className="upper__main" d="M 0 23 L 50 23 L 75 8 L 100 8" />
      </svg>

      <div className="body__inner">{children}</div>
    </div>
  );
}
