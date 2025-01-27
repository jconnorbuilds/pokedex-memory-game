import styles from '../styles/DisplayListMode.module.css';
import PkmnListButton from './PkmnListButton.jsx';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList as List } from 'react-window';

import { memo } from 'react';

const DisplayListMode = memo(function DisplayListMode({
  pkmnToDisplay,
  selectPokemon,
  fetchPokemonDetails,
  isLoading,
}) {
  // Check if there are more pokemon to load (necessary for InfiniteLoader)
  const hasNextPage = Object.keys(pkmnToDisplay).length < 1200; // Hardcoded placeholder for now
  const itemCount = Object.keys(pkmnToDisplay).length + (hasNextPage ? 1 : 0);
  const isItemLoaded = (index) => pkmnToDisplay[index]?.fullyLoaded;

  // The render function for each row in the list
  const Row = ({ index, style }) => {
    return (
      <PkmnListButton
        isLoading={!isItemLoaded(index) || !Object.keys(pkmnToDisplay).length}
        pkmn={pkmnToDisplay[index]}
        styles={styles}
        style={style}
        selectPokemon={selectPokemon}
      ></PkmnListButton>
    );
  };

  // Load more pokemon when the user scrolls to the bottom of the list
  const loadMoreItems = async (startIdx, stopIdx) => {
    fetchPokemonDetails(startIdx, stopIdx - startIdx);
  };

  return (
    <InfiniteLoader
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
