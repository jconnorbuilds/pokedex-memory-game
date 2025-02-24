import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useState } from 'react';
import { auth, db, provider } from '../firebase.js';
import useCurrentGenPkmnIds from '../hooks/useCurrentGenPkmnIds.js';
import usePokemon from '../hooks/usePokemon.js';
import useSceneRotation from '../hooks/useSceneRotation.js';
import UseScore from '../hooks/useScore.js';
import '../styles/App.css';
import styles from '../styles/App.module.css';
import GameOptionsMenu from '../styles/GameOptionsMenu.jsx';
import AngleInput from './AngleInput.jsx';
import Button from './Button.jsx';
import DifficultySelect from './DifficultySelect.jsx';
import GameArea from './GameArea.jsx';
import GenerationSelect from './GenerationSelect.jsx';
import InputGroup from './InputGroup.jsx';
import Login from './Login.jsx';
import Pokedex from './Pokedex.jsx';
import Scene from './Scene.jsx';
import Scoreboard from './Scoreboard.jsx';
import Sidebar from './Sidebar.jsx';

import { AuthContext } from '../context/AuthContext.jsx';
import useGameStatus from '../hooks/useGameStatus.js';
import * as Game from '../utils/constants.js';

import LoginPrompt from './LoginPrompt.jsx';
import UserPanel from './UserPanel.jsx';

export default function App() {
  const [level, setLevel] = useState(Game.LEVELS.find((l) => l.name === 'easy'));
  const [generation, setGeneration] = useState(1);
  const user = useContext(AuthContext);
  const [pokedexIsOpen, setPokedexIsOpen] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { score, best, incrementScore, resetScore } = UseScore();
  const { sceneRotation, setSceneSingleAxisRotation } = useSceneRotation(pokedexIsOpen);
  const { gameOn, gameStatus, nextGame, reportGameStatus } = useGameStatus();
  const { pokemonDict, fetchPokemonDetails, isLoading } = usePokemon({ isOpen: true });
  const { currentGenPkmnIds } = useCurrentGenPkmnIds({ generation, pokemonDict });

  const createOrUpdateUserDbEntry = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });
    } catch (e) {
      console.error('Error adding user entry: ', e);
    }
  };

  const logUserIn = async () => {
    // Use the login flow outlined in the Firebase docs
    // https://firebase.google.com/docs/auth/web/google-signin#web
    signInWithPopup(auth, provider)
      .then((result) => createOrUpdateUserDbEntry(result.user))
      .then(() => setShowLoginPrompt(false))
      .catch((error) => {
        console.error(error); // TODO: Actually handle errors
      });
  };

  const logUserOut = () => {
    signOut(auth)
      .then(() => {
        // TODO: show logout UI?
      })
      .catch((error) => {
        console.error(error.code); // TODO: Actually handle errors
      });
  };

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
        <LoginPrompt
          open={showLoginPrompt}
          hide={() => setShowLoginPrompt(false)}
          logUserIn={logUserIn}
        />
        <Scene rotation={sceneRotation}>
          {pokedexIsOpen ? (
            <Pokedex
              isOpen={pokedexIsOpen}
              pokemonDict={pokemonDict}
              fetchPokemonDetails={fetchPokemonDetails}
              isLoading={isLoading}
              toggleOpen={() => {}}
              showLoginPrompt={() => setShowLoginPrompt(true)}
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
        {user ? (
          <UserPanel logUserOut={logUserOut} logUserIn={logUserIn} />
        ) : (
          <Login logUserIn={logUserIn} />
        )}

        <Button className={styles.pokedexToggleBtn} action={toggleDexOpenClosed}>
          Open/close
        </Button>
        {!pokedexIsOpen ? (
          <>
            <Scoreboard styles={styles} scores={{ score, best }} />
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
          </>
        ) : null}

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
