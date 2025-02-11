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
  // Infinite Loader functions
  const itemCount = Object.keys(pkmnToDisplay).length;
  const isItemLoaded = (index) => pkmnToDisplay[index]?.fullyLoaded;
  const getPkmnId = (index) => +Object.values(pkmnToDisplay)[index]?.idx;

  // The render function for each row in the list
  const Row = ({ index, style }) => {
    const id = getPkmnId(index);
    return (
      <PkmnListButton
        index={index}
        pkmnToDisplay={pkmnToDisplay}
        onClick={() => selectPokemon({ id })}
        styles={{ ...styles, reactWindow: style }}
      ></PkmnListButton>
    );
  };

  // Load more pokemon as the user scrolls through the list
  const loadMoreItems = async (startIdx, stopIdx) => {
    for (let i = startIdx; i <= stopIdx; i++) {
      fetchPokemonDetails({ singlePkmnId: pkmnToDisplay[i].idx });
    }
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
