import styles from '../styles/EvolutionChart.module.css';
import { useMemo } from 'react';
const CHART_VB_W = 100;
const CHART_VB_H = 30;

function createChartData(eChain, segments = [], connections = [], currentBranch = 0) {
  const doesEvolve = Array.isArray(eChain.evolvesTo);
  const evolutionDiverges = eChain.evolvesTo?.length > 1;

  // Add the current pokemon to the segments array
  segments.push({ id: eChain.pkmnIdx, branch: currentBranch });

  // Recursively assign branches to the evolution chain.
  // Branch 0 is the base branch, and all other branches are children of the base branch.
  if (doesEvolve) {
    eChain.evolvesTo.forEach((evo, idx) => {
      const nextBranch = evolutionDiverges ? idx + 1 : currentBranch;
      connections.push({ from: eChain.pkmnIdx, to: evo.pkmnIdx });
      createChartData(evo, segments, connections, nextBranch);
    });
  }

  return { segments, connections };
}

export default function EvolutionChart({
  evolutionChain,
  handlePkmnSelection,
  currentPokemonId,
}) {
  const chartData = useMemo(() => createChartData(evolutionChain), [evolutionChain]);
  const chartBranches = useMemo(
    () => groupByBranch(chartData.segments),
    [chartData.segments],
  );

  return (
    <div className={styles.evoChart}>
      <svg viewBox={`0 0 ${CHART_VB_W} ${CHART_VB_H}`} xmlns="http://www.w3.org/2000/svg">
        {renderNodes(chartData)}
        {renderConnections(chartData)}
      </svg>
    </div>
  );

  function renderNodes({ segments }) {
    return segments.map((seg) => {
      const { x, y } = getNodePosition(seg);
      const isActive = seg.id === currentPokemonId;
      return (
        <g
          key={seg.id}
          className={styles.node + (isActive ? ` ${styles.nodeActive}` : '')}
          onClick={() => handlePkmnSelection({ id: seg.id })}
        >
          <circle className={styles.nodeHoverRadius} r="8" cx={x} cy={y}></circle>
          {isActive && (
            <circle className={styles.activeHighlight} r="5" cx={x} cy={y}></circle>
          )}
          <circle className={styles.nodeInner} r="3" cx={x} cy={y}></circle>
        </g>
      );
    });
  }

  function renderConnections({ segments, connections }) {
    return connections.map((conn) => {
      const fromNode = segments.find((seg) => seg.id === conn.from);
      const toNode = segments.find((seg) => seg.id === conn.to);
      const fromPos = getNodePosition(fromNode);
      const toPos = getNodePosition(toNode);
      return (
        <line
          key={`${conn.from}-${conn.to}`}
          x1={fromPos.x + 7}
          y1={fromPos.y}
          x2={toPos.x - 7}
          y2={toPos.y}
        ></line>
      );
    });
  }

  // Calculate the position of a node in the chart
  function getNodePosition(node) {
    const x = getXPos(node);
    const y = getYPos(node.branch);
    return { x, y };
  }

  function getXPos(node, branches = chartBranches, chartW = CHART_VB_W) {
    // Calculate which branch the node is in, and its position in that branch
    const nodeBranch = branches[node.branch];
    const indexInBranch = nodeBranch.findIndex((seg) => seg.id === node.id);
    const pos = indexInBranch + (node.branch === 0 ? 0 : branches[0].length);

    // Calculate the x coordinate based on the number of columns in the chart
    const columnCount = calculateColCount(branches);
    const columnWidth = chartW / columnCount;
    const x = pos * columnWidth + columnWidth / 2;

    return x;
  }

  function getYPos(row, branches = chartBranches, chartH = CHART_VB_H) {
    // Calculate the y position dynamically based on the number of branches
    const branchCount = Object.keys(branches).length;
    return row === 0 ? chartH / 2 : (chartH / branchCount) * row;
  }

  function calculateColCount(branches) {
    const baseBranchLength = branches[0].length;
    const maxOtherBranchLength = Math.max(
      0,
      ...Object.keys(branches)
        .filter((key) => key !== '0')
        .map((key) => branches[key].length),
    );
    return baseBranchLength + maxOtherBranchLength;
  }

  function groupByBranch(segs) {
    return segs.reduce((acc, cur) => {
      acc[cur.branch] = acc[cur.branch] || [];
      acc[cur.branch].push(cur);
      return acc;
    }, {});
  }
}
