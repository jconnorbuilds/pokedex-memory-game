import styles from '../styles/DisplayListMode.module.css';
import PkmnListButton from './PkmnListButton.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { memo } from 'react';

const DisplayListMode = memo(function DisplayListMode({
  filteredPkmn,
  selectPokemon,
  getMorePokemon,
}) {
  return (
    <InfiniteScroll
      className={styles.displayList}
      dataLength={filteredPkmn.length}
      next={getMorePokemon}
      hasMore={true}
      loader={<h4>Loading...</h4>}
      endMessage={<p>End of List</p>}
      scrollableTarget="screen-wrapper"
    >
      {filteredPkmn?.map((pkmn) => (
        <PkmnListButton
          key={pkmn.name}
          pkmn={pkmn}
          styles={styles}
          selectPokemon={selectPokemon}
        />
      ))}
    </InfiniteScroll>
  );
});

export default DisplayListMode;
