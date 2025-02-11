import styles from '../styles/MainDisplay.module.css';

export function TypePill({ typeInfo }) {
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

export default function PokemonTypes({ currentPkmn, loadingFinished = true }) {
  const renderTypePill = (data) => {
    return data.map((typeInfo) => (
      <TypePill key={typeInfo ? typeInfo.type.name : 0} typeInfo={typeInfo || null} />
    ));
  };

  const types = loadingFinished ? currentPkmn?.data?.types : [];
  return (
    <div className={styles.types}>
      {types?.length ? renderTypePill(types) : <TypePill typeInfo={null} />}
    </div>
  );
}
