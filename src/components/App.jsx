import { useState, useEffect } from 'react';
import '../styles/App.css';

import CardTable from './CardTable.jsx';

export default function App() {
  const [pokemon, setPokemon] = useState(null);

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

  return pokemon ? <CardTable pokemon={pokemon} /> : <div>Loading cards...</div>;
}
