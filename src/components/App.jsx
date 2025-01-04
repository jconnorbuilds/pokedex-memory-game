import { useState, useEffect, useCallback } from 'react';
import '../styles/App.css';
import CardTable from './CardTable.jsx';
import InputGroup from './InputGroup.jsx';
import Pokedex from './Pokedex.jsx';
import Scoreboard from './Scoreboard.jsx';
import SetAngleInput from './SetAngleInput.jsx';
import useGenSizes from './useGenSizes.jsx';
import useLocalStorage from './useLocalStorage.jsx';
import usePokemon from './usePokemon.jsx';
import usePokemonInPlay from './usePokemonInPlay.jsx';
import GenerationSelect from './GenerationSelect.jsx';
import DifficultySelect from './DifficultySelect.jsx';
import GameOptionsMenu from '../styles/GameOptionsMenu.jsx';
import UseScore from './UseScore.jsx';
import Scene from './Scene.jsx';
import useSceneRotation from './useSceneRotation.jsx';
import GameArea from './GameArea.jsx';
import Button from './Button.jsx';
import GameResult from './GameResult.jsx';

const LEVELS = [
  { name: 'Easy', size: 4 },
  { name: 'Medium', size: 8 },
  { name: 'Hard', size: 12 },
];

const NUM_OF_GENERATIONS = 9;

export default function App() {
  const [level, setLevel] = useState(LEVELS.find((l) => l.name === 'Easy'));
  const [generation, setGeneration] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [gameOn, setGameOn] = useState(true);

  const [pokedexIsOpen, setPokedexIsOpen] = useState(true);

  const { score, best, incrementScore, resetScore } = UseScore();
  const { sceneRotation, setSceneRotationAxis } = useSceneRotation(pokedexIsOpen);

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

  const hideStarters = (currentGen) => {
    setShowStarters(
      showStarters.map((gen, idx) => (idx + 1 === +currentGen ? false : gen)),
    );
  };

  const resetGame = () => {
    const startersShown = showStarters[generation - 1];

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
        incrementScore();
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
        resetScore();
      } else if (status === 'playing') {
        incrementScore();
      }
    },
    [generation, setGenCompletion, incrementScore, resetScore],
  );

  function AngleInputs({ labelPrefix, target, onChange }) {
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
  }

  // return <div>under construction </div>;
  return (
    <div className="app">
      <main className="container">
        <header className="header container">
          <Scoreboard scores={{ score, best }} />
        </header>
        <Scene rotation={sceneRotation}>
          <GameArea pokedexIsOpen={pokedexIsOpen}>
            <CardTable
              pokemon={pokemonInPlay}
              gameWon={gameWon}
              gameOn={gameOn}
              generation={generation}
              gameStatusCallback={gameStatusCallback}
            />
            <GameResult>
              <Button action={resetGame} styles="game-result">
                Play Again
              </Button>
            </GameResult>
          </GameArea>
          <Pokedex
            allPokemon={allPokemonInGen}
            isOpen={pokedexIsOpen}
            isLoading={isLoading}
            progress={progress}
            toggleOpen={toggleDexOpenClosed}
          >
            <GameOptionsMenu>
              <GenerationSelect
                handleSelect={handleGenerationSelect}
                generation={generation}
              ></GenerationSelect>
              <DifficultySelect handleSelect={handleLevelSelect} levels={LEVELS} />
            </GameOptionsMenu>
          </Pokedex>
        </Scene>
        <footer className="footer container">
          <div className="placeholder">
            <p>
              ©︎jconnorbuilds 2025 <a href="https://github.com/jconnorbuilds">GitHub</a>
            </p>
          </div>
          <div className="dev-toolbar">
            <div className="toolbar__widget">
              <h2>Scene</h2>
              <AngleInputs
                labelPrefix={'scene'}
                target={sceneRotation}
                onChange={setSceneRotationAxis}
              ></AngleInputs>
            </div>
            <div className="toolbar__widget">
              <h2>Pokedex</h2>
              {/* {renderAngleInputs('scene', pokedexAngle, setPokedexRotation)} */}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
