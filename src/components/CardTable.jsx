import { useMemo } from 'react';
import Card from './Card.jsx';

export default function CardTable({
  pkmnData,
  gameWon,
  handleClick,
  clickedIds,
  handId,
}) {
  // Gets an idx between 0 and <max> that's not present in the <used> array
  const _getRandomUnselectedIdx = (max, used) => {
    let idx;
    const isUnusedIdx = (idx) => !used.includes(idx);

    do {
      const randomIdx = Math.floor(Math.random() * max);
      if (isUnusedIdx(randomIdx)) idx = randomIdx;
    } while (idx === undefined);

    return idx;
  };

  // Selects a random subset of the <pokemon> prop
  const pokemonToShow = useMemo(() => {
    // Return all pokemon if player has won
    if (gameWon) return pkmnData;

    const _selectPokemon = () => {
      const numberOfPkmn = Math.floor(pkmnData.length * 0.75);
      const usedIdxs = [];
      const selectedPokemon = [];

      for (let i = 0; i < numberOfPkmn; i++) {
        const idx = _getRandomUnselectedIdx(pkmnData.length, usedIdxs);
        selectedPokemon.push(pkmnData[idx]);
        usedIdxs.push(idx);
      }

      return selectedPokemon;
    };

    const _selectionIsValid = (selection) =>
      selection.some((pkmn) => !clickedIds.includes(pkmn.name));

    // Return a valid subset of pokemon if game is still in play
    let selectedPokemon;
    do {
      selectedPokemon = _selectPokemon();
    } while (!_selectionIsValid(selectedPokemon));

    return selectedPokemon;
  }, [clickedIds, gameWon, pkmnData]);

  return (
    <>
      <Hand key={handId}>
        {pokemonToShow.map((pokemon) => {
          const singlePkmnData = pkmnData.find((pkmn) => {
            // console.log(pokemon, pkmn);
            return pkmn.name === pokemon.name;
          });
          return (
            <Card
              pkmnData={singlePkmnData}
              handleClick={handleClick}
              gameWon={gameWon}
              key={pokemon.name}
              colorsOn={true}
            />
          );
        })}
      </Hand>
    </>
  );
}

function Hand({ id, children }) {
  return (
    <div className="card-table" key={id}>
      {children}
    </div>
  );
}
