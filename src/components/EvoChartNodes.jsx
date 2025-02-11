import styles from '../styles/Node.module.css';

// Render each data node, with a hover radius and styling for the active node
export default function EvoChartNodes({
  segments,
  handlePkmnSelection,
  getNodePosition,
  currentPokemonId,
}) {
  return segments.map((seg) => <Node key={seg.id} segment={seg} />);

  function Node({ segment }) {
    const { x, y } = getNodePosition(segment);
    const isActive = segment.id === currentPokemonId;
    return (
      <g
        key={segment.id}
        className={styles.node + (isActive ? ` ${styles.nodeActive}` : '')}
        onClick={() => handlePkmnSelection(segment.id)}
      >
        <circle className={styles.nodeHoverRadius} r="8" cx={x} cy={y}></circle>
        {isActive && (
          <circle className={styles.activeHighlight} r="5" cx={x} cy={y}></circle>
        )}
        <circle className={styles.nodeInner} r="3" cx={x} cy={y}></circle>
      </g>
    );
  }
}
