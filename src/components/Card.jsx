import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Card({ pokemon, handleClick, gameWon }) {
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

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return color ? (
    <motion.div
      className="card"
      animate={{ rotateY: '179.9deg' }}
      transition={{ delay: gameWon ? 0 : 0.5, duration: 0.5 }}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: '600px',
      }}
    >
      <div
        onClick={() => handleClick(pokemon.name)}
        style={{ backgroundColor: color }}
        className="card__front"
      >
        <div className="card__name">{capitalize(pokemon.name)}</div>
        <div className="card__picture">
          {sprite ? (
            <img src={sprite} alt={pokemon.name} width="168px" />
          ) : (
            <div>Loading sprites...</div>
          )}
        </div>
      </div>
      <div className="card__back"></div>
    </motion.div>
  ) : (
    <div>Loading...</div>
  );
}
