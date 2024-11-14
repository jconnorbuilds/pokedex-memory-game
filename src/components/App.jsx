import { useState, useEffect } from 'react';
import '../styles/App.css';
import Scoreboard from './Scoreboard.jsx';
import CardTable from './CardTable.jsx';
import MenuButton from './MenuButton.jsx';
import GenerationDisplay from './GenerationDisplay.jsx';

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [needsNewPkmn, setNeedsNewPkmn] = useState(true);
  const [winCount, setWinCount] = useState(
    JSON.parse(localStorage.getItem('winCount')) || 0,
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

  const NUM_OF_GENERATIONS = 9;
  const LEVELS = ['easy', 'medium', 'hard'];

  useEffect(() => {
    const LEVELS = { easy: 4, medium: 8, hard: 12 };

    const fetchPokemon = async () => {
      const url = `https://pokeapi.co/api/v2/generation/${generation}`;
      const result = await fetch(url);
      const generationData = await result.json();
      const pokemonSpecies = generationData.pokemon_species;

      // Starter pokemon to always include on the first round
      const starterPokemon = !winCount
        ? [pokemonSpecies[0], pokemonSpecies[1], pokemonSpecies[2]]
        : [];

      const selectedPokemon = [...starterPokemon];

      const _getRandomIdx = (range, offset = 0) =>
        Math.floor(Math.random() * range - offset) + offset;

      const _getRandomPokemon = () =>
        pokemonSpecies[_getRandomIdx(pokemonSpecies.length, starterPokemon.range)];

      const selectPokemon = () => {
        const randomPokemon = _getRandomPokemon();
        if (!selectedPokemon.includes(randomPokemon)) selectedPokemon.push(randomPokemon);

        // Duplicate pokemon error handling
        if (selectedPokemon.length > new Set(selectedPokemon).length) {
          throw new Error(`Duplicate pokemon! ${selectedPokemon}`);
        }
      };

      while (selectedPokemon.length < LEVELS[level]) {
        try {
          selectPokemon();
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
  }, [winCount, needsNewPkmn, generation, level]);

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

  const handleGenerationSelect = (e) => {
    if (e.target.tagName === 'BUTTON') {
      setGeneration(+e.target.value);
      resetGame();
    }
  };

  const handleLevelSelect = (e) => {
    if (e.target.tagName === 'BUTTON') {
      setLevel(e.target.value);
      resetGame();
    }
  };

  const resetGame = () => {
    setGameOn(true);
    setGameWon(false);
    setScore(0);
    setClickedIds([]);
    setHandId(0);
    setNeedsNewPkmn(gameWon);
    if (gameWon) setWinCount(winCount + 1);
  };

  localStorage.setItem('winCount', JSON.stringify(winCount));

  return (
    <div className="app">
      <header className="header container">
        <Scoreboard score={score} bestScore={bestScore} />
      </header>
      {pokemon ? (
        <CardTable
          pokemon={pokemon}
          updateScores={updateScores}
          score={score}
          setScore={setScore}
          setNeedsNewPkmn={setNeedsNewPkmn}
          winCount={winCount}
          setWinCount={setWinCount}
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
      <div className="game-menu">
        <div className="choose-difficulty" onClick={handleLevelSelect}>
          <h2>Difficulty</h2>
          {LEVELS.map((level) => {
            const levelNameFormatted = level.charAt(0).toUpperCase() + level.slice(1);
            return (
              <MenuButton key={level} value={level}>
                {levelNameFormatted}
              </MenuButton>
            );
          })}
        </div>
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
                    {genCompletion[genNumber] ? genCompletion[genNumber].length : 0} /{' '}
                    {genSize ? genSize : '...'}
                  </div>
                </GenerationDisplay>
              );
            })}
        </div>
      </div>
      <footer className="footer container">
        <div className="placeholder">
          <p>Footer text</p>
        </div>
      </footer>
    </div>
  );
}
