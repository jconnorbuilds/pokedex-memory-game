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
  const hasNextPage = Object.keys(pkmnToDisplay).length < 1025; // Hardcoded placeholder for now
  const itemCount = Object.keys(pkmnToDisplay).length + (hasNextPage ? 1 : 0);
  const isItemLoaded = (index) => pkmnToDisplay[index]?.fullyLoaded;
  const getPkmnId = (index) => +Object.values(pkmnToDisplay)[index]?.idx;

  // The render function for each row in the list
  const Row = ({ index, style }) => {
    const id = getPkmnId(index);
    return (
      <PkmnListButton
        index={index}
        allPkmn={allPokemon}
        onClick={() => selectPokemon({ id })}
        styles={{ ...styles, reactWindow: style }}
      ></PkmnListButton>
    );
  };

  // Load more pokemon as the user scrolls through the list
  const loadMoreItems = async (startIdx, stopIdx) => {
    for (let i = startIdx; i < stopIdx; i++) {
      fetchPokemonDetails({ singlePkmnId: pkmnToDisplay[i].idx });
    }
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
