import { useState, useEffect } from 'react';
import '../styles/App.css';
import Scoreboard from './Scoreboard.jsx';
import CardTable from './CardTable.jsx';

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [needsNewPkmn, setNeedsNewPkmn] = useState(true);
  const [winCount, setWinCount] = useState(0);

  useEffect(() => {
    const LEVELS = { easy: 4, medium: 8, hard: 12 };

    const fetchPokemon = async () => {
      const level = 'easy';
      const generation = 4;

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
  }, [winCount, needsNewPkmn]);

  const updateScores = (newScore) => {
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);
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
      )}
      <footer className="footer container">
        <div className="placeholder">
          <p>Footer text</p>
        </div>
      </footer>
    </div>
  );
}
