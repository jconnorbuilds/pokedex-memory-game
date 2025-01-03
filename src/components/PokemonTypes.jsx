import styles from '../styles/MainDisplay.module.css';

function TypePill({ typeInfo }) {
  {
    const typeName = typeInfo ? typeInfo.type.name : null;
    const typeClassName = typeInfo
      ? 'typePill' + typeName.charAt(0).toUpperCase() + typeName.slice(1)
      : 'typePillLoading';
    return (
      <div className={styles.type}>
        <span className={styles[typeClassName]}>{typeName || '---'}</span>
      </div>
    );
  }
}

export default function PokemonTypes({ currentPokemon, loadingFinished }) {
  const types = currentPokemon?.data.types || null;
  const renderTypePill = (data) => {
    return data.map((typeInfo) => (
      <TypePill
        key={typeInfo ? typeInfo.type.name : 0}
        typeInfo={typeInfo || null}
        styles={styles}
      />
    ));
  };

  return (
    <div className={styles.types}>
      {types && loadingFinished ? (
        renderTypePill(types)
      ) : (
        <TypePill typeInfo={null} styles={styles} />
      )}
    </div>
  );
}
