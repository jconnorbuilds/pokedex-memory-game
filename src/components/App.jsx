import { useCallback, useState } from 'react';
// import { GameContext } from './GameContext.js';
import '../styles/App.css';
import Pokedex from './Pokedex.jsx';
import Scoreboard from './Scoreboard.jsx';

import useCurrentGenPkmnIds from '../hooks/useCurrentGenPkmnIds.js';
import usePokemon from '../hooks/usePokemon.js';
import useSceneRotation from '../hooks/useSceneRotation.js';
import UseScore from '../hooks/useScore.js';
import styles from '../styles/App.module.css';
import GameOptionsMenu from '../styles/GameOptionsMenu.jsx';
import Button from './Button.jsx';
import DifficultySelect from './DifficultySelect.jsx';
import GameArea from './GameArea.jsx';
import GenerationSelect from './GenerationSelect.jsx';
import InputGroup from './InputGroup.jsx';
import AngleInput from './AngleInput.jsx';
import Scene from './Scene.jsx';
import Sidebar from './Sidebar.jsx';

import useGameStatus from '../hooks/useGameStatus.js';
import * as Game from './constants.js';

export default function App() {
  const [level, setLevel] = useState(Game.LEVELS.find((l) => l.name === 'easy'));
  const [generation, setGeneration] = useState(1);
  const [pokedexIsOpen, setPokedexIsOpen] = useState(true);

  const { score, best, incrementScore, resetScore } = UseScore();
  const { sceneRotation, setSceneSingleAxisRotation } = useSceneRotation(pokedexIsOpen);
  const { gameOn, gameStatus, nextGame, reportGameStatus } = useGameStatus();
  const { pokemonDict, fetchPokemonDetails, isLoading } = usePokemon({ isOpen: true });
  const { currentGenPkmnIds } = useCurrentGenPkmnIds({ generation, pokemonDict });

  const allPokemonInGen = currentGenPkmnIds;

  const handleGenerationSelect = (e) => {
    if (e.target.tagName === 'BUTTON') {
      setGeneration(e.target.value);
      nextGame();
    }
  };

  const handleLevelSelect = (e) => {
    if (e.target.tagName === 'BUTTON') {
      setLevel(Game.LEVELS.find((l) => l.name === e.target.value));
      nextGame();
    }
  };

  const toggleDexOpenClosed = useCallback(() => {
    const willOpen = pokedexIsOpen !== true;
    setPokedexIsOpen(willOpen);
  }, [pokedexIsOpen]);

  return (
    <div className="app">
      <main className="container">
        <Scene rotation={sceneRotation}>
          {pokedexIsOpen ? (
            <Pokedex
              isOpen={pokedexIsOpen}
              pokemonDict={pokemonDict}
              fetchPokemonDetails={fetchPokemonDetails}
              isLoading={isLoading}
              toggleOpen={() => {}}
            ></Pokedex>
          ) : (
            <GameArea
              style={pokedexIsOpen ? { transform: 'scale(0.75)' } : {}}
              level={level}
              pokemonDict={pokemonDict}
              allPokemonInGen={allPokemonInGen}
              generation={generation}
              incrementScore={incrementScore}
              resetScore={resetScore}
              gameOn={gameOn}
              gameStatus={gameStatus}
              nextGame={nextGame}
              reportGameStatus={reportGameStatus}
              fetchPokemonDetails={fetchPokemonDetails}
            />
          )}
        </Scene>
      </main>
      <Sidebar styles={styles}>
        <Scoreboard styles={styles} scores={{ score, best }} />
        <Button className={styles.pokedexToggleBtn} action={toggleDexOpenClosed}>
          Open/close
        </Button>
        <GameOptionsMenu styles={styles.gameOptionsMenu}>
          <GenerationSelect
            generation={generation}
            handleSelect={handleGenerationSelect}
            styles={styles}
          ></GenerationSelect>
          <DifficultySelect
            level={level}
            handleSelect={handleLevelSelect}
            styles={styles}
          />
        </GameOptionsMenu>
        <div className="dev-toolbar">
          <div className="toolbar__widget">
            <h2>Scene rotation</h2>
            <InputGroup>
              {['x', 'y', 'z'].map((axis) => {
                return (
                  <AngleInput
                    key={`scene-${axis}`}
                    axis={axis}
                    label={`scene-${axis}`}
                    value={sceneRotation[axis]}
                    axisRotationSetter={(value) =>
                      setSceneSingleAxisRotation(axis, value)
                    }
                  />
                );
              })}
            </InputGroup>
          </div>
        </div>
        <p className={styles.githubLink}>
          ©︎jconnorbuilds 2025 <a href="https://github.com/jconnorbuilds">GitHub</a>
        </p>
      </Sidebar>
    </div>
  );
}
