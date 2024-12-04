import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Card({ pokemon, handleClick, gameWon, colorsOn }) {
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
      purple: 'rebeccapurple',
      gray: '#8C8C8C',
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
      const spriteData = pokemon.isShiny
        ? pokemonData.sprites.other['official-artwork'].front_shiny
        : pokemonData.sprites.other['official-artwork'].front_default;

      setSprite(spriteData);
    };

    getPokemonData();
  }, [pokemon.isShiny, pokemon.url]);

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const ANIMATION_DURATION = 0.5;

  const cardVariants = {
    flip: {
      rotateY: '179.9deg',
      translateZ: '110px',
      transition: {
        rotateY: {
          delay: 0.25,
          duration: ANIMATION_DURATION,
        },
        translateZ: {
          from: '1px',
          to: '110px',
          delay: 0,
          duration: ANIMATION_DURATION,
          repeat: 1,
          repeatType: 'reverse',
        },
      },
    },

    'flip-win': {
      rotateY: '540deg',
      translateZ: '1px',
      rotateZ: '2deg',
      transition: {
        rotateY: { duration: 0.75 },
        rotateZ: {
          from: '-2deg',
          to: '2deg',
          repeat: Infinity,
          repeatType: 'mirror',
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
  };

  return (
    <>
      {/* <div className="card-base"> */}
      <div className="card-wrapper" onClick={() => handleClick(pokemon.name)}>
        <motion.div
          className="card"
          variants={cardVariants}
          animate={gameWon ? 'flip-win' : 'flip'}
        >
          <div
            style={{ backgroundColor: colorsOn ? color : '#999' }}
            className={`card__front ${pokemon.isShiny && 'shiny'}`}
          >
            <div className="card__name">{capitalize(pokemon.name)}</div>
            <div className="card__picture">
              {sprite ? (
                <img src={sprite} alt={pokemon.name} width="168px" />
              ) : (
                <div>Loading sprites...</div>
              )}
            </div>
            <p>isShiny is {`${pokemon.isShiny}`}</p>
          </div>
          <div className="card__back"></div>
        </motion.div>
      </div>
      {/* </div> */}
    </>
  );
}
