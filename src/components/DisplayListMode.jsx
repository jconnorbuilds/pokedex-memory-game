import styles from '../styles/DisplayListMode.module.css';
import PkmnListButton from './PkmnListButton.jsx';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList as List } from 'react-window';

import { memo } from 'react';

const DisplayListMode = memo(function DisplayListMode({
  filteredPkmn,
  selectPokemon,
  getMorePokemon,
}) {
  const Row = ({ index, style }) => (
    <PkmnListButton
      // key={pkmn.name}
      pkmn={filteredPkmn[index]}
      styles={styles}
      style={style}
      selectPokemon={selectPokemon}
    />
  );

  return (
    // <InfiniteLoader
    //   className={styles.displayList}
    //   dataLength={filteredPkmn.length}
    //   next={getMorePokemon}
    //   hasMore={true}
    //   loader={<h4>Loading...</h4>}
    //   endMessage={<p>End of List</p>}
    //   scrollableTarget="screen-wrapper"
    // >
    <List
      className={styles.displayList}
      height={350}
      itemCount={filteredPkmn.length}
      itemSize={90}
      width="100%"
    >
      {Row}
    </List>
    // </InfiniteLoader>
  );
});

export default DisplayListMode;
