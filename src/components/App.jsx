import { useState, useEffect } from 'react';
import '../styles/App.css';
import Scoreboard from './Scoreboard.jsx';

import CardTable from './CardTable.jsx';

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const LEVELS = { easy: 4, medium: 8, hard: 12 };

    const fetchPokemon = async () => {
      const level = 'easy';
      const generation = 3;

      const url = `https://pokeapi.co/api/v2/generation/${generation}`;
      const result = await fetch(url);
      const generationData = await result.json();
      const pokemonSpecies = generationData.pokemon_species;

      const selectedPokemon = [];
      for (let i = 0; i < LEVELS[level]; i++) {
        selectedPokemon.push(pokemonSpecies[i]);
      }

      if (!ignore) setPokemon(selectedPokemon);
    };

    let ignore = false;
    fetchPokemon();

    return () => {
      ignore = true;
    };
  }, []);

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
