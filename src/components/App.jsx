import { useState } from 'react';
import '../styles/App.css';
import Scoreboard from './Scoreboard.jsx';
import CardTable from './CardTable.jsx';
import MenuButton from './MenuButton.jsx';
import GenerationDisplay from './GenerationDisplay.jsx';
import Pokedex from './Pokedex.jsx';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';
import SetAngleInput from './SetAngleInput.jsx';
import InputGroup from './InputGroup.jsx';
import usePokemon from './usePokemon.jsx';
import useGenSizes from './useGenSizes.jsx';
import usePokemonDexSprites from './usePokemonSprites.jsx';

const AXES = ['x', 'y', 'z'];
const LEVELS = ['easy', 'medium', 'hard'];
const NUM_OF_GENERATIONS = 9;

const getFromLocalStorage = (itemName) => JSON.parse(localStorage.getItem(itemName));

const createRotationSetter = (setState) => {
  return (axis, degrees) => setState((previous) => ({ ...previous, [axis]: degrees }));
};

const toggleDexOpenClosed = (e) => {
  if (e.target.closest('.body__upper-overhang')) {
    const pokedex = document.querySelector('#pokedex');
    const willOpen = !pokedex.classList.contains('pokedex--open');
    pokedex.classList.toggle('pokedex--open', willOpen);
  }
};

export default function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [level, setLevel] = useState('easy');
  const [generation, setGeneration] = useState(1);
  const [showStarters, setShowStarters] = useState(
    getFromLocalStorage('showStarters') || Array(NUM_OF_GENERATIONS).fill(true),
  );
  const [gameWon, setGameWon] = useState(false);
  const [gameOn, setGameOn] = useState(true);
  const [clickedCardIds, setClickedCardIds] = useState([]);
  const [handId, setHandId] = useState(0);
  const [genCompletion, setGenCompletion] = useState(
    getFromLocalStorage('genCompletion') || {},
  );
  const [sceneAngle, setSceneAngle] = useState({ x: '25', y: '40', z: '0' });
  const [pokedexAngle, setPokedexAngle] = useState({ x: '0', y: '0', z: '0' });

  const { pokemon, requestNewPokemon } = usePokemon(showStarters, generation, level);
  const genSizes = useGenSizes(NUM_OF_GENERATIONS);
  const pokemonDexSprites = usePokemonDexSprites(pokemon);

  const sceneTransform = `rotateY(${sceneAngle.y}deg) rotateX(${sceneAngle.x}deg) rotateZ(${sceneAngle.z}deg)`;
  const pokedexTransform = `rotateY(${pokedexAngle.y}deg) rotateX(${pokedexAngle.x}deg) rotateZ(${pokedexAngle.z}deg)`;

  const createSelectionHandler = (setState) => {
    return (e) => {
      if (e.target.tagName === 'BUTTON') {
        setState(e.target.value);
        requestNewPokemon();
        resetGame();
      }
    };
  };

  const updateScores = (newScore) => {
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);
  };

  const handleGenerationSelect = createSelectionHandler(setGeneration);
  const handleLevelSelect = createSelectionHandler(setLevel);

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

  const choiceSucceeded = (id) => !clickedCardIds.includes(id);

  const handleCardClick = (id) => {
    if (!gameOn) return;

    if (choiceSucceeded(id)) {
      const newClickedIds = clickedCardIds.concat([id]);
      setClickedCardIds(newClickedIds);
      updateScores(score + 1);

      // Check if player wins round
      if (newClickedIds.length === pokemon.length) {
        // Keep track of seen pokemon per generation, without duplicates
        const pokemonNames = pokemon.map((pkmn) => pkmn.name);
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

  localStorage.setItem('showStarters', JSON.stringify(showStarters));

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

  const setSceneRotation = createRotationSetter(setSceneAngle);
  const setPokedexRotation = createRotationSetter(setPokedexAngle);

  return (
    <div className="app">
      <header className="header container">
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
          {pokemon ? (
            <>
              <CardTable
                pokemon={pokemon}
                gameWon={gameWon}
                clickedIds={clickedCardIds}
                setClickedIds={setClickedCardIds}
                handId={handId}
                genCompletion={genCompletion}
                handleClick={handleCardClick}
              />
              <div className="game-result">
                {gameWon && <p>You win!</p>}
                {!gameOn && !gameWon && <p>You lose! </p>}
                {!gameOn && <button onClick={resetGame}>Play again</button>}
              </div>
            </>
          ) : (
            <div>Loading cards...</div>
          )}{' '}
          <div className="pokedex-wrapper container">
            <Pokedex
              toggleOpenClosed={toggleDexOpenClosed}
              style={{ transform: pokedexTransform }}
            >
              <PokedexBody sprite={pokemonDexSprites[0]}></PokedexBody>
              <PokedexLid>
                <div className="choose-gen" onClick={handleGenerationSelect}>
                  <h2>Generations</h2>
                  {Array(NUM_OF_GENERATIONS)
                    .fill('')
                    .map((_, idx) => {
                      const genNumber = idx + 1;
                      const genSize = genSizes[genNumber];
                      return (
                        <GenerationDisplay key={idx}>
                          <MenuButton value={genNumber}>{genNumber}</MenuButton>
                          <div className="gen-dex-completion">
                            {genCompletion[genNumber]
                              ? genCompletion[genNumber].length
                              : 0}{' '}
                            / {genSize ? genSize : '...'}
                          </div>
                        </GenerationDisplay>
                      );
                    })}
                </div>
                <div className="choose-difficulty" onClick={handleLevelSelect}>
                  <h2>Difficulty</h2>
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
              </PokedexLid>
            </Pokedex>
          </div>
        </div>
      </main>
      <footer className="footer container">
        <div className="placeholder">
          <p>Footer text</p>
        </div>
      </footer>
    </div>
  );
}
