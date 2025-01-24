import styles from '../styles/DisplayListMode.module.css';
import PkmnListButton from './PkmnListButton.jsx';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList as List } from 'react-window';

import { memo, useState } from 'react';

const DisplayListMode = memo(function DisplayListMode({
  pkmnToDisplay,
  selectPokemon,
  // fetchMorePokemon,
  fetchPokemonDetails,
  isLoading,
}) {
  const isItemLoaded = (index) => index < pkmnToDisplay.length; // FIX THIS FUNCTION to check if all of the data is loaded, not just length
  const hasNextPage = pkmnToDisplay.length < 1200;
  const itemCount = hasNextPage ? pkmnToDisplay.length + 1 : pkmnToDisplay.length;

  const [offset, setOffset] = useState(0);
  const pageSize = 20;

  const Row = ({ index, style }) => {
    return !isItemLoaded(index) ? (
      <div style={style}>Loading...</div>
    ) : (
      <PkmnListButton
        pkmn={pkmnToDisplay[index]}
        styles={styles}
        style={style}
        selectPokemon={selectPokemon}
        // fetchPokemonDetails={fetchPokemonDetails}
      />
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={
        isLoading
          ? () => {}
          : () => {
              fetchPokemonDetails(offset, pageSize);
              setOffset((prev) => prev + pageSize);
            }
      }
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
