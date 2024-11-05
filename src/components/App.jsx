import { useState, useEffect } from 'react';
import '../styles/App.css';
import Scoreboard from './Scoreboard.jsx';
import CardTable from './CardTable.jsx';
import MenuButton from './MenuButton.jsx';

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [needsNewPkmn, setNeedsNewPkmn] = useState(true);
  const [winCount, setWinCount] = useState(0);
  const [level, setLevel] = useState('easy');
  const [generation, setGeneration] = useState(1);

  const NUM_OF_GENERATIONS = 9;
  const LEVELS = ['easy', 'medium', 'hard'];

  useEffect(() => {
    const LEVELS = { easy: 4, medium: 8, hard: 12 };

    const fetchPokemon = async () => {
      const url = `https://pokeapi.co/api/v2/generation/${generation}`;
      const result = await fetch(url);
      const generationData = await result.json();
      const pokemonSpecies = generationData.pokemon_species;

      // Starter pokemon to always include
      const starterPokemon = !winCount
        ? [pokemonSpecies[0], pokemonSpecies[1], pokemonSpecies[2]]
        : [];

      const selectedPokemon = [...starterPokemon];
      for (let i = starterPokemon.length; i < LEVELS[level]; i++) {
        const randomIdx =
          Math.floor(Math.random() * pokemonSpecies.length - starterPokemon.length) +
          starterPokemon.length;
        selectedPokemon.push(pokemonSpecies[randomIdx]);
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

  const updateScores = (newScore) => {
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);
  };

  const handleGenerationSelect = (e) => {
    if (e.target.tagName === 'BUTTON') setGeneration(+e.target.value);
  };

  const handleLevelSelect = (e) => {
    if (e.target.tagName === 'BUTTON') setLevel(e.target.value);
  };

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
        />
      ) : (
        <div>Loading cards...</div>
      )}{' '}
      <div className="game-menu">
        <div className="choose-difficulty" onClick={handleLevelSelect}>
          <h2>Difficulty</h2>
          {LEVELS.map((level) => {
            return (
              <MenuButton key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </MenuButton>
            );
          })}
        </div>
        <div className="choose-gen" onClick={handleGenerationSelect}>
          <h2>Generations</h2>
          {Array(NUM_OF_GENERATIONS)
            .fill('')
            .map((_, idx) => {
              const val = idx + 1;
              return (
                <MenuButton key={val} value={val}>
                  {val}
                </MenuButton>
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
