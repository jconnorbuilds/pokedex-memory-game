import { useState, useCallback } from 'react';
import '../styles/App.css';
import CardTable from './CardTable.jsx';
import InputGroup from './InputGroup.jsx';
import Pokedex from './Pokedex.jsx';
import Scoreboard from './Scoreboard.jsx';
import SetAngleInput from './SetAngleInput.jsx';
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
import useGameProgress from './useGameProgress.jsx';

import * as Game from './constants.js';
import useStarters from './useStarters.jsx';

export default function App() {
  const [level, setLevel] = useState(Game.LEVELS.find((l) => l.name === 'Easy'));
  const [generation, setGeneration] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [gameOn, setGameOn] = useState(true);

  const [pokedexIsOpen, setPokedexIsOpen] = useState(true);

  const { score, best, incrementScore, resetScore } = UseScore();
  const { sceneRotation, setSceneRotationAxis } = useSceneRotation(pokedexIsOpen);
  const { updateGameProgress } = useGameProgress();
  const { shouldShowStartersForGen, hideStartersForGen } = useStarters({ generation });
  const { allPokemonInGen, isLoading, progress } = usePokemon(generation);
  const { pokemonInPlay, requestNewPokemon } = usePokemonInPlay(
    allPokemonInGen,
    generation,
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
      setLevel(Game.LEVELS.find((l) => l.name === e.target.value));
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

  const resetGame = () => {
    const startersShown = shouldShowStartersForGen(generation);

    setGameWon(false);
    setGameOn(true);

    if (gameWon) {
      if (startersShown) hideStartersForGen(generation);
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
        updateGameProgress(data, generation);
      } else if (status === 'lose') {
        setGameOn(false);
        resetScore();
      } else if (status === 'playing') {
        incrementScore();
      }
    },
    [generation, updateGameProgress, incrementScore, resetScore],
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
            <GameResult gameOn={gameOn} gameWon={gameWon}>
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
              <DifficultySelect handleSelect={handleLevelSelect} levels={Game.LEVELS} />
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
