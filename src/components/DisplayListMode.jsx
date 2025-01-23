import styles from '../styles/DisplayListMode.module.css';
import PkmnListButton from './PkmnListButton.jsx';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList as List } from 'react-window';

import { memo } from 'react';

const DisplayListMode = memo(function DisplayListMode({
  pkmnToDisplay,
  selectPokemon,
  fetchMorePokemon,
  isLoading,
}) {
  const isItemLoaded = (index) => index < pkmnToDisplay.length;
  const hasNextPage = pkmnToDisplay.length < 1200;
  const itemCount = hasNextPage ? pkmnToDisplay.length + 1 : pkmnToDisplay.length;

  const Row = ({ index, style }) => {
    return !isItemLoaded(index) ? (
      <div style={style}>Loading...</div>
    ) : (
      <PkmnListButton
        pkmn={pkmnToDisplay[index]}
        styles={styles}
        style={style}
        selectPokemon={selectPokemon}
      />
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={isLoading ? () => {} : fetchMorePokemon}
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
