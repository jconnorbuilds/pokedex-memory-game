import { useState, useEffect } from 'react';

export default function Card({ pokemon, handleClick }) {
  const [color, setColor] = useState(null);
  const [sprite, setSprite] = useState(null);

  useEffect(() => {
    const COLORS = {
      red: '#DA073B',
      yellow: '#FFD452',
      green: '#66BB6A',
      blue: '#3498DB',
      pink: '#FF8ADE',
      black: '#1C1D21',
      brown: '#97715E',
      white: '#E9E9E9',
      grey: '#8C8C8C',
    };

    const getPokemonData = async () => {
      // Get the pokemon's "color"
      const result = await fetch(pokemon.url);
      const data = await result.json();
      const colorData = data.color.name;
      setColor(COLORS[colorData]);

      // Get the pokemon's official artwork
      const pokemonResult = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.id}`);
      const pokemonData = await pokemonResult.json();
      const spriteData = pokemonData.sprites.other['official-artwork'].front_default;
      setSprite(spriteData);
    };

    getPokemonData();
  }, [pokemon.url]);

  return color && sprite ? (
    <>
      <div
        onClick={() => handleClick(pokemon.name)}
        style={{ backgroundColor: color }}
        className="card"
      >
        <h2>{pokemon.name}</h2>
        <div className="picture">
          <img src={sprite} alt={pokemon.name} />
        </div>
      </div>
    </>
  ) : (
    <div>Loading sprites...</div>
  );
}
