import styles from '../styles/MainDisplay.module.css';

function TypePill({ typeInfo }) {
  {
    const typeName = typeInfo?.type?.name ?? '---';
    const isUnknownType = typeName === '---';

    const typeClassName = isUnknownType
      ? 'typePillLoading'
      : 'typePill' + typeName.charAt(0).toUpperCase() + typeName.slice(1);

    return (
      <div className={styles.type}>
        <span className={styles[typeClassName]}>{typeName}</span>
      </div>
    );
  }
}

export default function PokemonTypes({ currentPokemon, loadingFinished }) {
  // Set types to an empty array if still loading, but this implementation might be buggy...
  const types = loadingFinished ? currentPokemon?.data.types : [];
  const renderTypePill = (data) => {
    return data.map((typeInfo) => (
      <TypePill key={typeInfo ? typeInfo.type.name : 0} typeInfo={typeInfo || null} />
    ));
  };

  return (
    <div className={styles.types}>
      {types?.length ? renderTypePill(types) : <TypePill typeInfo={null} />}
    </div>
  );
}
