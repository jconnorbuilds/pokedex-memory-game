import { useState, useEffect } from 'react';
import '../styles/App.css';
import Scoreboard from './Scoreboard.jsx';
import CardTable from './CardTable.jsx';
import MenuButton from './MenuButton.jsx';
import GenerationDisplay from './GenerationDisplay.jsx';
import Pokedex from './Pokedex.jsx';
import PokedexBody from './PokedexBody.jsx';
import PokedexLid from './PokedexLid.jsx';

export default function App() {
  const NUM_OF_GENERATIONS = 9;

  const [pokemon, setPokemon] = useState(null);
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

  const LEVELS = ['easy', 'medium', 'hard'];
  const SHINY_ODDS = 20; //Full odds is 1 in 8192, post-Gen 6 is 1 in 4096

  useEffect(() => {
    const LEVELS = { easy: 4, medium: 8, hard: 12 };
    const rollForShiny = () => Math.floor(Math.random() * 65536) < 65536 / SHINY_ODDS;

    const fetchPokemon = async () => {
      // Can't I just change this to the /pokemon endpoint and filter the data by generation?
      const url = `https://pokeapi.co/api/v2/generation/${generation}`;
      const result = await fetch(url);
      const generationData = await result.json();
      const pokemonSpecies = generationData.pokemon_species;
      console.log(generationData);

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
  }, [showStarters, needsNewPkmn, generation, level]);

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

  localStorage.setItem('showStarters', JSON.stringify(showStarters));

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
      <div className="pokedex-wrapper">
        <Pokedex>
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
                        {genCompletion[genNumber] ? genCompletion[genNumber].length : 0} /{' '}
                        {genSize ? genSize : '...'}
                      </div>
                    </GenerationDisplay>
                  );
                })}
            </div>
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
          </PokedexLid>
        </Pokedex>
      </div>
      <footer className="footer container">
        <div className="placeholder">
          <p>Footer text</p>
        </div>
      </footer>
    </div>
  );
}
