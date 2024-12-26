import { useState, useEffect, useCallback } from 'react';
import '../styles/App.css';
import CardTable from './CardTable.jsx';
import InputGroup from './InputGroup.jsx';
import MenuButton from './MenuButton.jsx';
import Pokedex from './Pokedex.jsx';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import Scoreboard from './Scoreboard.jsx';
import SetAngleInput from './SetAngleInput.jsx';
import useGenSizes from './useGenSizes.jsx';
import useLocalStorage from './useLocalStorage.jsx';
import usePokemon from './usePokemon.jsx';
import usePokedexParallax from './usePokedexParallax.jsx';
import { p } from 'framer-motion/client';

const AXES = ['x', 'y', 'z'];
const LEVELS = ['easy', 'medium', 'hard'];
const NUM_OF_GENERATIONS = 9;
const SCENE_ROTATION_DEFAULT = { x: 40, y: 20, z: -5 };
const SCENE_ROTATION_POKEDEX_OPEN = { x: 15, y: -10, z: 0 };

const createSingleAxisRotationSetter = (setState) => {
  return (axis, degrees) => setState((previous) => ({ ...previous, [axis]: degrees }));
};

let baseSceneRotation = SCENE_ROTATION_DEFAULT;

export default function App() {
  // Retrieve saved settings from localstorage
  const savedStarters = JSON.parse(localStorage.getItem('showStarters'));
  const savedGenCompletion = JSON.parse(localStorage.getItem('genCompletion'));

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [level, setLevel] = useState('easy');
  const [generation, setGeneration] = useState(1);
  const [showStarters, setShowStarters] = useState(
    savedStarters || Array(NUM_OF_GENERATIONS).fill(true),
  );
  const [gameWon, setGameWon] = useState(false);
  const [gameOn, setGameOn] = useState(true);
  const [clickedCardIds, setClickedCardIds] = useState([]);
  const [handId, setHandId] = useState(0);
  const [genCompletion, setGenCompletion] = useState(savedGenCompletion || {});
  const [sceneAngle, setSceneAngle] = useState(SCENE_ROTATION_DEFAULT);
  const [pokedexIsOpen, setPokedexIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: null, y: null });

  const { pokemonData, pokemonSpeciesData, requestNewPokemon } = usePokemon(
    showStarters,
    generation,
    level,
  );

  // console.log(pokemonData);
  const genSizes = useGenSizes(NUM_OF_GENERATIONS);

  useLocalStorage(showStarters, genCompletion);

  baseSceneRotation = pokedexIsOpen
    ? SCENE_ROTATION_POKEDEX_OPEN
    : SCENE_ROTATION_DEFAULT;

  const throttle = (cb, delay = 150) => {
    let shouldWait = false;

    // Return the throttled function
    return (...args) => {
      if (shouldWait) return;

      cb(...args);
      shouldWait = true;

      setTimeout(() => {
        shouldWait = false;
      }, delay);
    };
  };

  // The mousemove event handler, throttled to limit re-renders
  const handleMouseMove = useCallback(
    throttle((e) => setMousePos((state) => ({ ...state, x: e.clientX, y: e.clientY }))),
    [],
  );

  const { pokedexAngle, setPokedexAngle } = usePokedexParallax(
    pokedexIsOpen,
    mousePos,
    handleMouseMove,
  );

  useEffect(() => {
    setSceneAngle(baseSceneRotation);
    setPokedexAngle({ x: 0, y: 0, z: 0 });
  }, [pokedexIsOpen, setPokedexAngle]);

  const setSceneRotation = createSingleAxisRotationSetter(setSceneAngle);
  const setPokedexRotation = createSingleAxisRotationSetter(setPokedexAngle);

  let sceneTransform = `
  rotateY(${sceneAngle.y}deg)
  rotateX(${sceneAngle.x}deg)
  rotateZ(${sceneAngle.z}deg)`;

  let pokedexTransform = `
  rotateX(${pokedexAngle.x}deg)
  rotateY(${pokedexAngle.y}deg)
  rotateZ(${pokedexAngle.z}deg)`;

  const createSelectionHandler = (setState) => {
    return (e) => {
      if (e.target.tagName === 'BUTTON') {
        setState(e.target.value);
        requestNewPokemon();
        resetGame();
      }
    };
  };

  const handleGenerationSelect = createSelectionHandler(setGeneration);
  const handleLevelSelect = createSelectionHandler(setLevel);

  const toggleDexOpenClosed = (e) => {
    if (e.target.closest('.body__upper-overhang')) {
      const willOpen = pokedexIsOpen !== true;
      setPokedexIsOpen(willOpen);
    }
  };

  const updateScores = (newScore) => {
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);
  };

  const hideStarters = (currentGen) => {
    setShowStarters(
      showStarters.map((gen, idx) => (idx + 1 === +currentGen ? false : gen)),
    );
  };

  const resetGame = () => {
    const startersShown = showStarters[generation - 1];

    setGameOn(true);
    setGameWon(false);
    setScore(0);
    setClickedCardIds([]);
    setHandId(0);

    if (gameWon) {
      requestNewPokemon();
      if (startersShown) hideStarters(generation);
    }
  };

  const handleCardClick = (id) => {
    if (!gameOn) return;
    const choiceSucceeded = (id) => !clickedCardIds.includes(id);

    if (choiceSucceeded(id)) {
      const newClickedIds = clickedCardIds.concat([id]);
      setClickedCardIds(newClickedIds);
      updateScores(score + 1);

      // Check if player wins round
      if (newClickedIds.length === pokemonData.length) {
        // Keep track of seen pokemon per generation, without duplicates
        const pokemonNames = pokemonData.map((pkmn) => pkmn.name);
        const newData = {
          [generation]: genCompletion[generation]
            ? [...new Set(genCompletion[generation].concat(pokemonNames))]
            : pokemonNames,
        };

        setGameOn(false);
        setGameWon(true);
        setGenCompletion({ ...genCompletion, ...newData });
      }
      setHandId(handId + 1);
    } else {
      setGameOn(false);
    }
  };

  const renderAngleInputs = (labelPrefix, target, onChange) => {
    return (
      <InputGroup>
        {AXES.map((axis) => {
          return (
            <SetAngleInput
              key={`${labelPrefix}-${axis}`}
              axis={axis}
              label={`${labelPrefix}-${axis}`}
              value={target[axis]}
              onChange={(value) => onChange(axis, value)}
            />
          );
        })}
      </InputGroup>
    );
  };

  return (
    <div className="app">
      <header className="header container">
        <Scoreboard score={score} bestScore={bestScore} />
      </header>
      <main className="container">
        <div
          id="scene"
          className="scene"
          style={{
            transform: sceneTransform,
          }}
        >
          <div
            className="game-area"
            style={pokedexIsOpen ? { transform: 'scale(0.75)' } : {}}
          >
            {pokemonData ? (
              <>
                <CardTable
                  pkmnData={pokemonData}
                  gameWon={gameWon}
                  handleClick={handleCardClick}
                  clickedIds={clickedCardIds}
                  handId={handId}
                />
                <div className="game-result">
                  {gameWon && <p>You win!</p>}
                  {!gameOn && !gameWon && <p>You lose! </p>}
                  {!gameOn && (
                    <button className="play-again" onClick={resetGame}>
                      Play again
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div>Loading cards...</div>
            )}{' '}
          </div>

          <Pokedex
            isOpen={pokedexIsOpen}
            toggleOpen={toggleDexOpenClosed}
            style={{ transform: pokedexTransform }}
          >
            <PokedexBody
              pokemonData={pokemonData}
              pokemonSpeciesData={pokemonSpeciesData}
            ></PokedexBody>
            <PokedexLid>
              <section className="lid__menu-area">
                <h2>Generation</h2>
                <div onClick={handleGenerationSelect} className="lid__gen-buttons">
                  {Array(10)
                    .fill('')
                    .map((_, idx) => {
                      const genNumber = idx + 1;
                      const needsLabel = genNumber <= NUM_OF_GENERATIONS;
                      return (
                        <MenuButton
                          key={genNumber}
                          className={
                            +generation === genNumber ? 'lid__button--selected' : ''
                          }
                          value={needsLabel ? genNumber : 0}
                        >
                          {needsLabel ? genNumber : ''}
                        </MenuButton>
                      );
                    })}
                </div>

                <h2>Difficulty</h2>
                <div onClick={handleLevelSelect} className="lid__difficulty-buttons">
                  {LEVELS.map((level) => {
                    const levelNameFormatted =
                      level.charAt(0).toUpperCase() + level.slice(1);
                    return (
                      <MenuButton key={level} value={level}>
                        {levelNameFormatted}
                      </MenuButton>
                    );
                  })}
                </div>
              </section>
              <div className="lid__display">
                <p>Generation: {generation}</p>
                <div>Pokémon caught</div>
              </div>
            </PokedexLid>
          </Pokedex>
        </div>
      </main>
      <footer className="footer container">
        <div className="placeholder">
          <p>
            ©︎jconnorbuilds 2025 <a href="https://github.com/jconnorbuilds">GitHub</a>
          </p>
        </div>
        <div className="dev-toolbar">
          <div className="toolbar__widget">
            <h2>Scene</h2>
            {renderAngleInputs('scene', sceneAngle, setSceneRotation)}
          </div>
          <div className="toolbar__widget">
            <h2>Pokedex</h2>
            {renderAngleInputs('scene', pokedexAngle, setPokedexRotation)}
          </div>
        </div>
      </footer>
    </div>
  );
}
