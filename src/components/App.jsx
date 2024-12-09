import { useState, useEffect, useMemo } from 'react';
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

const NUM_OF_GENERATIONS = 9;
const AXES = ['x', 'y', 'z'];
const LEVELS = ['easy', 'medium', 'hard'];
const SHINY_ODDS = 20; //Full odds is 1 in 8192, post-Gen 6 is 1 in 4096

const usePokemon = (showStarters, needsNewPkmn, setNeedsNewPkmn, generation, level) => {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const LEVELS = { easy: 4, medium: 8, hard: 12 };
    const rollForShiny = () => Math.floor(Math.random() * 65536) < 65536 / SHINY_ODDS;

    const fetchPokemon = async () => {
      // Can't I just change this to the /pokemon endpoint and filter the data by generation?
      const url = `https://pokeapi.co/api/v2/generation/${generation}`;
      const result = await fetch(url);
      const generationData = await result.json();
      const pokemonSpecies = generationData.pokemon_species;

      // Starter pokemon to always include on the first round
      const starterPokemon = showStarters[generation - 1]
        ? [pokemonSpecies[0], pokemonSpecies[1], pokemonSpecies[2]]
        : [];

      starterPokemon.forEach((pkmn) =>
        Object.defineProperty(pkmn, 'isShiny', { value: rollForShiny() }),
      );

      const selectedPokemon = [...starterPokemon];

      const _getRandomIdx = (range, offset = 0) =>
        Math.floor(Math.random() * range - offset) + offset;

      const _getRandomPokemon = () =>
        pokemonSpecies[_getRandomIdx(pokemonSpecies.length, starterPokemon.length)];

      const selectPokemon = () => {
        const randomPokemon = _getRandomPokemon();
        if (!selectedPokemon.includes(randomPokemon)) return randomPokemon;

        // Duplicate pokemon error handling
        if (selectedPokemon.length > new Set(selectedPokemon).length) {
          throw new Error(`Duplicate pokemon! ${selectedPokemon}`);
        }
      };

      while (selectedPokemon.length < LEVELS[level]) {
        try {
          const randomPokemon = selectPokemon(); // Can be undefined, which is a bug. This whole try/catch block should probably be reworked.
          const isShiny = rollForShiny();
          Object.defineProperty(randomPokemon, 'isShiny', { value: isShiny });
          selectedPokemon.push(randomPokemon);
        } catch (err) {
          console.error(err);
        }
      }

      if (!ignore) setPokemon(selectedPokemon);
      setNeedsNewPkmn(false);
    };

    let ignore = false;
    fetchPokemon();

    return () => {
      ignore = true;
    };
  }, [generation, level, setNeedsNewPkmn, showStarters]);

  return pokemon;
};

export default function App() {
  // const [pokemon, setPokemon] = useState(null);
  const [pokemonDexSprites, setPokemonDexSprites] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [needsNewPkmn, setNeedsNewPkmn] = useState(true);

  const [showStarters, setShowStarters] = useState(
    JSON.parse(localStorage.getItem('showStarters')) ||
      Array(NUM_OF_GENERATIONS).fill(true),
  );
  const [level, setLevel] = useState('easy');
  const [generation, setGeneration] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [gameOn, setGameOn] = useState(true);
  const [clickedIds, setClickedIds] = useState([]);
  const [handId, setHandId] = useState(0);
  const [genSizes, setGenSizes] = useState({});
  const [genCompletion, setGenCompletion] = useState(
    JSON.parse(localStorage.getItem('genCompletion')) || {},
  );
  const [sceneAngle, setSceneAngle] = useState({ x: '25', y: '40', z: '0' });
  const [pokedexAngle, setPokedexAngle] = useState({ x: '0', y: '0', z: '0' });

  const pokemon = usePokemon(
    showStarters,
    needsNewPkmn,
    setNeedsNewPkmn,
    generation,
    level,
  );

  const rotate3d = (target, { x, y, z }) => {
    target.style.transform = `rotateY(${y}deg) rotateX(${x}deg) rotateZ(${z}deg)`;
  };

  useMemo(() => {
    const scene = document.querySelector('#scene');
    if (scene) rotate3d(scene, sceneAngle);
  }, [sceneAngle]);

  useMemo(() => {
    const scene = document.querySelector('#pokedex');
    if (scene) rotate3d(scene, pokedexAngle);
  }, [pokedexAngle]);

  useEffect(() => {
    if (pokemon) {
      const dexSpriteUrls = pokemon.map((pkmn) => {
        return `https://pokeapi.co/api/v2/pokemon/${pkmn.name}`;
      });

      const getPokemonData = async (urls) => {
        try {
          const promises = urls.map((urls) => fetch(urls));
          const responses = await Promise.all(promises);
          const data = await Promise.all(responses.map((response) => response.json()));
          return data;
        } catch (error) {
          throw new Error(`Failed to fetch data: ${error}`);
        }
      };

      // setTestPkmn(spriteData);
      getPokemonData(dexSpriteUrls).then((data) => {
        const dexSprites = data.map(
          (pokemon) => pokemon.sprites.other['showdown'].front_default,
        );
        setPokemonDexSprites(dexSprites);
      });
    }
  }, [pokemon]);

  useEffect(() => {
    const fetchGenerationData = async () => {
      const pokemonInGen = {};
      for (let i = 0; i < NUM_OF_GENERATIONS; i++) {
        const genNumber = i + 1;
        const url = `https://pokeapi.co/api/v2/generation/${genNumber}`;
        const result = await fetch(url);
        const generationData = await result.json();
        pokemonInGen[genNumber] = generationData.pokemon_species.length;
      }
      return pokemonInGen;
    };

    const generationData = fetchGenerationData();
    generationData.then((res) => setGenSizes(res));
  }, []);

  const updateScores = (newScore) => {
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);
  };

  const createSelectionHandler = (setState) => {
    return (e) => {
      if (e.target.tagName === 'BUTTON') {
        setState(+e.target.value);
        resetGame();
      }
    };
  };

  const handleGenerationSelect = createSelectionHandler(setGeneration);
  const handleLevelSelect = createSelectionHandler(setLevel);

  const resetGame = () => {
    const genIdx = generation - 1;
    setGameOn(true);
    setGameWon(false);
    setScore(0);
    setClickedIds([]);
    setHandId(0);
    setNeedsNewPkmn(gameWon);
    if (gameWon && showStarters[genIdx])
      setShowStarters(showStarters.map((gen, idx) => (idx === genIdx ? false : gen)));
  };

  const toggleDexOpenClosed = (e) => {
    if (e.target.closest('.body__upper-overhang')) {
      const pokedex = document.querySelector('#pokedex');
      const willOpen = !pokedex.classList.contains('pokedex--open');
      pokedex.classList.toggle('pokedex--open', willOpen);
    }
  };

  localStorage.setItem('showStarters', JSON.stringify(showStarters));

  const createRotationSetter = (setState) => {
    return (axis, degrees) => setState((previous) => ({ ...previous, [axis]: degrees }));
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
        <div id="scene" className="scene">
          {pokemon ? (
            <CardTable
              pokemon={pokemon}
              updateScores={updateScores}
              score={score}
              setScore={setScore}
              setNeedsNewPkmn={setNeedsNewPkmn}
              gameWon={gameWon}
              setGameWon={setGameWon}
              gameOn={gameOn}
              setGameOn={setGameOn}
              resetGame={resetGame}
              clickedIds={clickedIds}
              setClickedIds={setClickedIds}
              handId={handId}
              setHandId={setHandId}
              genCompletion={genCompletion}
              setGenCompletion={setGenCompletion}
              generation={generation}
            />
          ) : (
            <div>Loading cards...</div>
          )}{' '}
          <div className="pokedex-wrapper container">
            <Pokedex toggleOpenClosed={toggleDexOpenClosed}>
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
