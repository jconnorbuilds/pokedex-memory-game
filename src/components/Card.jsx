import styles from '../styles/Card.module.css';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandFist } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const ANIMATION_DURATION = 1.25;

// TODO: Remove this, do it with css
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Card({ pokemon, handleClick, gameStatus }) {
  const [hovered, setHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Removes the hovered state if the card if the not hovered.
  // Adds the hovered state only if the card is hovered and also not currently being animated.
  const setHoveredIfNotBusy = (isHovered) => {
    if (isHovered && !isAnimating) {
      setHovered(true);
    } else setHovered(false);
  };

  const sprite = pokemon.isShiny
    ? pokemon?.data?.sprites.other['official-artwork'].front_shiny
    : pokemon?.data?.sprites.other['official-artwork'].front_default;

  const typeName = pokemon?.data?.types[0].type.name;
  const ability = pokemon?.data?.moves[0].move.name;

  const cardWrapperVariants = {
    initial: { translateZ: '1px' },
    hover: {
      translateZ: '15px',
    },
    win: {
      rotateZ: ['-2deg', '2deg'],
      transition: {
        rotateZ: {
          repeat: Infinity,
          repeatType: 'mirror',
          duration: 0.5,
        },
      },
    },
  };

  const cardVariants = {
    initial: {
      translateZ: '1px',
    },
    flip: {
      rotateY: [null, null, '179.9deg', '179.9deg'],
      translateZ: [null, '50px', '110px', '1px'],
    },
    win: {
      rotateY: [0, '179.9deg', '179.9deg'],
      translateZ: ['110px', '1px'],
      duration: 2,
    },
  };

  // TODO: clean this up. Currently buggy because of the mixture of css and framer-motion animations
  // Specifically, it looks bad when hovering while the flip animation is happening.
  // Attempted to fix this by adding isAnimation state, but it's not working as expected.
  const shadowVariants = {
    initial: {
      width: '100%',
      height: '100%',
      backgroundColor: '#00000055',
      boxShadow: '0 0 20px 20px #00000055',
    },
    flip: {
      width: ['100%', '80%', '1%', '80%', '100%'],
      height: ['100%', '80%', '80%', '80%', '100%'],
      boxShadow: [
        '0 0 5px 0px #00000055',
        '0 0 20px 20px #00000055',
        '0 0 10px 5px #00000011',
        '0 0 20px 20px #00000055',
        '0 0 5px 0px #00000055',
      ],
      backgroundColor: ['#00000055', '#00000055', '#00000011', '#00000055', '#00000055'],
    },
    win: {
      width: ['80%', '10%', '80%', '100%'],
      height: ['80%', '80%', '80%', '100%'],
      boxShadow: [
        '0 0 20px 20px #00000055',
        '0 0 10px 5px #00000011',
        '0 0 20px 20px #00000055',
        '0 0 5px 0px #00000055',
      ],
      backgroundColor: ['#00000055', '#00000011', '#00000055', '#00000055'],
      transition: {
        times: [0, 0.05, 0.15, 1],
        duration: 2,
      },
    },
  };

  return (
    // TODO: Change the outer motion.div to motion.button for better accessibility + keyboard navigation
    // Currently swapping out div for button causes the shadow animation to break.
    <motion.div
      initial="initial"
      className={styles.cardWrapper}
      variants={cardWrapperVariants}
      onClick={() => handleClick(pokemon.name)}
      onHoverStart={() => setHoveredIfNotBusy(true)}
      onHoverEnd={() => setHoveredIfNotBusy(false)}
      whileHover={() => {
        const hover = !document.querySelector('.card-table.no-hover');
        if (hover) return 'hover';
      }}
      animate={gameStatus === 'won' ? 'win' : 'flip'} // TODO: add a loading state, and use gameStatus directly as the key to animate
    >
      <motion.div
        initial="initial"
        variants={shadowVariants}
        className={`${styles.shadow} ${hovered ? styles.hovered : ''}`}
        animate={gameStatus === 'won' ? 'win' : 'flip'} // TODO: add a loading state, and use gameStatus directly as the key to animate
        transition={{
          duration: ANIMATION_DURATION,
          times: [0, 0.33, 0.4, 0.6, 0.98],
        }}
      ></motion.div>
      <motion.div
        initial="initial"
        className={`${styles.card}`}
        variants={cardVariants}
        animate={gameStatus === 'won' ? 'win' : 'flip'}
        transition={{
          duration: ANIMATION_DURATION,
        }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        <div
          className={`${styles.front} ${pokemon.isShiny && styles.shiny} ${
            styles[`${typeName}Type`]
          }`}
        >
          <div className={`${styles.name} ${styles.blurBg}`}>
            <p>{capitalize(pokemon.name)}</p>
            <hr />
          </div>

          <div className={styles.sprite}>
            <img src={sprite} alt={pokemon.name} width="168px" />
          </div>
          <hr />
          <div className={`${styles.moves} ${styles.blurBg}`}>
            <FontAwesomeIcon icon={faHandFist} className="icon-shadow" />
            {ability && <p>{capitalize(ability)}</p>}
          </div>
        </div>
        <div className={styles.back}></div>
      </motion.div>
    </motion.div>
  );
}
