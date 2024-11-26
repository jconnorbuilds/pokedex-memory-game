export default function PokedexLid({ children }) {
  return (
    <div className="pokedex__lid">
      <div className="lid__main">
        <div className="lid__main__inside face">
          <div className="lid__main-content">{children}</div>
        </div>
        {/* <div className="lid__main__left vert-edge"></div> */}
        <div className="lid__main__right vert-edge"></div>
        {/* <div className="lid__main__top horiz-edge"></div> */}
        <div className="lid__main__top flat1 horiz-edge"></div>
        <div className="lid__main__top flat2 horiz-edge"></div>
        <div className="lid__main__top slant1 horiz-edge"></div>
        <div className="lid__main__bottom horiz-edge"></div>
        <div className="lid__main__outside face"></div>
      </div>
    </div>
  );
}
