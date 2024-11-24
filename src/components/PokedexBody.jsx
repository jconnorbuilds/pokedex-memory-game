export default function PokedexBody({ children }) {
  return (
    <div className="pokedex__body">
      <div className="body__front face ">
        {/* <svg
          className="front__upper"
          viewBox="0 0 500 133.33"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="circle">
            <circle className="circle__outer" cx="70" cy="66.665" r="45"></circle>
            <circle className="circle__inner" cx="70" cy="66.665" r="38"></circle>
          </g>
          <path className="upper__main" d="M 0 132 L 250 132 L 375 53.332 L 500 53.332" />
        </svg> */}
        <div className="front__inner">{children}</div>
      </div>

      <div className="body__left vert-edge"></div>
      <div className="body__right vert-edge"></div>
      <div className="body__top horiz-edge"></div>
      <div className="body__bottom horiz-edge"></div>
      <div className="body__back face"></div>
    </div>
  );
}
