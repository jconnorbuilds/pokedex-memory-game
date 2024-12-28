import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandFist } from '@fortawesome/free-solid-svg-icons';

const ANIMATION_DURATION = 1.25;

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Card({ pokemon, handleClick, gameWon }) {
  const sprite = pokemon.isShiny
    ? pokemon.data.sprites.other['official-artwork'].front_shiny
    : pokemon.data.sprites.other['official-artwork'].front_default;

  const typeName = pokemon.data.types[0].type.name;
  const ability = pokemon.data.moves[0].move.name;

  const toggleShadowHover = (e, isHovered) => {
    const shadow = e.target.querySelector('.card-shadow');
    const noHover = !!e.target.closest('.no-hover');
    if (!noHover) {
      if (isHovered && !noHover) {
        shadow.style.transform = 'translate3d(0, 0, -15px)';
        shadow.style.boxShadow = '0 0 20px 20px #00000055';
        shadow.style.width = '80%';
        shadow.style.height = '80%';
        shadow.style.transition = '0.1s ease-in-out';
      } else {
        shadow.style.transform = 'translate3d(0, 0, 0)';
        shadow.style.boxShadow = '0 0 5px 0px #00000055';
        shadow.style.width = '100%';
        shadow.style.height = '100%';
      }
    }
  };

  const toggleDisableHover = (disabled) => {
    const cardTable = document.querySelector('.card-table');
    cardTable.classList.toggle('no-hover', disabled);
  };

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

  const shadowVariants = {
    initial: {
      width: '100%',
      height: '100%',
      backgroundColor: '#00000055',
      boxShadow: '0 0 5px 0px #00000055',
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
    <motion.div
      initial="initial"
      className="card-wrapper"
      variants={cardWrapperVariants}
      onClick={() => handleClick(pokemon.name)}
      onHoverStart={(e) => toggleShadowHover(e, true)}
      onHoverEnd={(e) => toggleShadowHover(e, false)}
      whileHover={() => {
        const hover = !document.querySelector('.card-table.no-hover');
        if (hover) return 'hover';
      }}
      animate={gameWon ? 'win' : 'flip'}
    >
      <motion.div
        initial="initial"
        variants={shadowVariants}
        className="card-shadow"
        animate={gameWon ? 'win' : 'flip'}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          translateZ: '0px',
        }}
        transition={{
          duration: ANIMATION_DURATION,
          times: [0, 0.33, 0.4, 0.6, 0.98],
        }}
      ></motion.div>
      <motion.div
        initial="initial"
        className="card"
        variants={cardVariants}
        animate={gameWon ? 'win' : 'flip'}
        transition={{
          duration: ANIMATION_DURATION,
        }}
        onAnimationStart={() => toggleDisableHover(true)}
        onAnimationComplete={() => toggleDisableHover(false)}
      >
        <div className={`card__front ${pokemon.isShiny && 'shiny'} type-${typeName}`}>
          <div className="card__name blur-bg">
            <p>{capitalize(pokemon.name)}</p>
            <hr />
          </div>

          <div className="card__picture">
            <img src={sprite} alt={pokemon.name} width="168px" />
          </div>
          <hr />
          <div className="card__moves blur-bg">
            <FontAwesomeIcon icon={faHandFist} className="icon-shadow" />
            {ability && <p>{capitalize(ability)}</p>}
          </div>
        </div>
        <div className="card__back"></div>
      </motion.div>
    </motion.div>
  );
}
