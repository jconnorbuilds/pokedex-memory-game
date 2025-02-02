import styles from '../styles/DisplayListMode.module.css';
import PkmnListButton from './PkmnListButton.jsx';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList as List } from 'react-window';

import { memo } from 'react';

const DisplayListMode = memo(function DisplayListMode({
  allPokemon,
  infiniteLoaderRef,
  pkmnToDisplay,
  selectPokemon,
  fetchPokemonDetails,
  isLoading,
}) {
  // Check if there are more pokemon to load (necessary for InfiniteLoader)
  const hasNextPage = Object.keys(pkmnToDisplay).length < 1200; // Hardcoded placeholder for now
  const itemCount = Object.keys(pkmnToDisplay).length + (hasNextPage ? 1 : 0);
  const isItemLoaded = (index) => pkmnToDisplay[index]?.fullyLoaded;
  const getPkmnGlobalIdx = (index) => +Object.values(pkmnToDisplay)[index]?.idx;
  // console.log('PKMN TO DISPLAY:', pkmnToDisplay);

  // The render function for each row in the list
  const Row = ({ index, style }) => {
    // console.log('INDEX:', index);
    // const hasIdxProp = Object.values(pkmnToDisplay)[index]?.idx;

    // console.log(Object.values(pkmnToDisplay)[index]);
    const globalIdx = getPkmnGlobalIdx(index) || 0;
    // console.log('GLOBAL IDX:', globalIdx);

    // const pkmn = Object.entries(pkmnToDisplay)[index];
    // console.log(pkmn);

    // console.log('ID?', id);
    return (
      <PkmnListButton
        pkmnIdx={globalIdx}
        allPkmn={allPokemon}
        onClick={() => selectPokemon({ id: globalIdx })}
        styles={{ ...styles, reactWindow: style }}
        isLoading={!isItemLoaded(index) || !Object.keys(pkmnToDisplay).length}
      ></PkmnListButton>
    );
  };

  // Load more pokemon when the user scrolls to the bottom of the list
  const loadMoreItems = async (startIdx, stopIdx) => {
    // console.log(startIdx, stopIdx);
    fetchPokemonDetails({ offset: startIdx, size: stopIdx - startIdx });
  };

  return (
    <InfiniteLoader
      ref={infiniteLoaderRef}
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={isLoading ? () => {} : loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          className={styles.displayList}
          height={325}
          itemSize={90}
          width="100%"
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );
});

export default DisplayListMode;
