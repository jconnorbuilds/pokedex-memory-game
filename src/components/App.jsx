import { useState, useEffect, useCallback } from 'react';
import '../styles/App.css';
import CardTable from './CardTable.jsx';
import InputGroup from './InputGroup.jsx';
import Pokedex from './Pokedex.jsx';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import Scoreboard from './Scoreboard.jsx';
import SetAngleInput from './SetAngleInput.jsx';
import useGenSizes from './useGenSizes.jsx';
import useLocalStorage from './useLocalStorage.jsx';
import usePokemon from './usePokemon.jsx';
import usePokedexParallax from './usePokedexParallax.jsx';
import usePokemonInPlay from './usePokemonInPlay.jsx';
import GenerationSelect from './GenerationSelect.jsx';
import DifficultySelect from './DifficultySelect.jsx';

const LEVELS = [
  { name: 'Easy', size: 4 },
  { name: 'Medium', size: 8 },
  { name: 'Hard', size: 12 },
];
const NUM_OF_GENERATIONS = 9;
const SCENE_ROTATION_DEFAULT = { x: 40, y: 20, z: -5 };
const SCENE_ROTATION_POKEDEX_OPEN = { x: 15, y: -10, z: 0 };

const createSingleAxisRotationSetter = (setState) => {
  return (axis, degrees) => setState((previous) => ({ ...previous, [axis]: degrees }));
};

export default function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [level, setLevel] = useState(LEVELS.find((l) => l.name === 'Easy'));
  const [generation, setGeneration] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [gameOn, setGameOn] = useState(true);
  const [sceneAngle, setSceneAngle] = useState(SCENE_ROTATION_DEFAULT);
  const [pokedexIsOpen, setPokedexIsOpen] = useState(true);
  const [mousePos, setMousePos] = useState({ x: null, y: null });
  const genSizes = useGenSizes(NUM_OF_GENERATIONS);
  const [showStarters, setShowStarters] = useLocalStorage(
    'showStarters',
    Array(NUM_OF_GENERATIONS).fill(true),
  );
  const [genCompletion, setGenCompletion] = useLocalStorage(
    'genCompletion',
    Object.fromEntries(
      Array(NUM_OF_GENERATIONS)
        .fill('')
        .map((_, idx) => [idx + 1, []]),
    ),
  );
  const { allPokemonInGen, isLoading, progress } = usePokemon(generation);
  const { pokemonInPlay, requestNewPokemon } = usePokemonInPlay(
    allPokemonInGen,
    showStarters[generation - 1],
    level.size,
  );

  const baseSceneRotation = pokedexIsOpen
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
  }, [pokedexIsOpen, setPokedexAngle, baseSceneRotation]);

  const setSceneRotation = createSingleAxisRotationSetter(setSceneAngle);
  const setPokedexRotation = createSingleAxisRotationSetter(setPokedexAngle);

  const sceneTransform = {
    transform: `
  rotateY(${sceneAngle.y}deg)
  rotateX(${sceneAngle.x}deg)
  rotateZ(${sceneAngle.z}deg)`,
  };

  const pokedexTransform = {
    transform: `
  rotateX(${pokedexAngle.x}deg)
  rotateY(${pokedexAngle.y}deg)
  rotateZ(${pokedexAngle.z}deg)`,
  };

  const handleGenerationSelect = (e) => {
    if (e.target.tagName === 'BUTTON') {
      setGeneration(e.target.value);
      requestNewPokemon();
      resetGame();
    }
  };

  const handleLevelSelect = (e) => {
    if (e.target.tagName === 'BUTTON') {
      setLevel(LEVELS.find((l) => l.name === e.target.value));
      requestNewPokemon();
      resetGame();
    }
  };

  const toggleDexOpenClosed = useCallback(
    (e) => {
      if (e.target.closest('.body__upper-overhang')) {
        const willOpen = pokedexIsOpen !== true;
        setPokedexIsOpen(willOpen);
      }
    },
    [pokedexIsOpen],
  );

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

    console.log('resetting game');
    setGameWon(false);
    setGameOn(true);

    if (gameWon) {
      if (startersShown) hideStarters(generation);
      requestNewPokemon();
    }
  };

  // TODO: reset score to 0 when the generation changes mid-hand
  const gameStatusCallback = useCallback(
    (status, data = {}) => {
      if (status === 'win') {
        updateScores(score + 1);
        setGameWon(true);
        setGameOn(false);
        // Adds NEW pokemon to the list.
        // TODO: update this to keep track of the number of times each pkmn has been caught
        setGenCompletion((prev) => {
          return {
            ...prev,
            [generation]: [...new Set([...prev[generation], ...data['pokemon']])],
          };
        });
      } else if (status === 'lose') {
        setGameOn(false);
        updateScores(0);
      } else if (status === 'playing') {
        updateScores(score + 1);
      }
    },
    [generation, setGenCompletion, score, updateScores],
  );

  const renderAngleInputs = (labelPrefix, target, onChange) => {
    return (
      <InputGroup>
        {['x', 'y', 'z'].map((axis) => {
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

  const renderResultButton = () => {
    const gameLost = !gameOn && !gameWon;
    return (
      <div className="game-result">
        {gameWon && <p>You win!</p>}
        {gameLost && <p>You lose! </p>}
        {!gameOn && (
          <button className="play-again" onClick={resetGame}>
            Play again
          </button>
        )}
      </div>
    );
  };

  // return <div>under construction </div>;
  return (
    <div className="app">
      <header className="header container">
        <Scoreboard score={score} bestScore={bestScore} />
      </header>
      <main className="container">
        <div id="scene" className="scene" style={sceneTransform}>
          <div
            className="game-area"
            style={pokedexIsOpen ? { transform: 'scale(0.75)' } : {}}
          >
            <CardTable
              pokemon={pokemonInPlay}
              gameWon={gameWon}
              gameOn={gameOn}
              generation={generation}
              gameStatusCallback={gameStatusCallback}
            />
            <div className="game-result">{renderResultButton()}</div>
          </div>
          <Pokedex
            isOpen={pokedexIsOpen}
            toggleOpen={toggleDexOpenClosed}
            style={pokedexTransform}
          >
            <PokedexBody
              pokemonInPlay={pokemonInPlay}
              pokemon={allPokemonInGen}
              isLoading={isLoading}
              progress={progress}
            ></PokedexBody>
            <PokedexLid>
              <section className="lid__menu-area">
                <GenerationSelect
                  handleSelect={handleGenerationSelect}
                  generation={generation}
                />
                <DifficultySelect handleSelect={handleLevelSelect} levels={LEVELS} />
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
