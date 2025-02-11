import styles from '../styles/EvolutionChart.module.css';
import EvoChartNodes from './EvoChartNodes.jsx';
import EvoChartConnections from './EvoChartConnections.jsx';
import { useMemo } from 'react';
const CHART_VB_W = 100;
const CHART_VB_H = 30;

export default function EvolutionChart({
  evolutionChain,
  handlePkmnSelection,
  currentPokemonId,
}) {
  // Get the nested data structure of branches and segments for the chart
  const chartData = useMemo(() => createChartData(evolutionChain), [evolutionChain]);
  const chartBranches = useMemo(
    () => groupByBranch(chartData.segments),
    [chartData.segments],
  );

  return (
    <div className={styles.evoChart}>
      <svg viewBox={`0 0 ${CHART_VB_W} ${CHART_VB_H}`} xmlns="http://www.w3.org/2000/svg">
        <EvoChartNodes
          segments={chartData.segments}
          currentPokemonId={currentPokemonId}
          handlePkmnSelection={handlePkmnSelection}
          getNodePosition={getNodePosition}
        />
        <EvoChartConnections chartData={chartData} getNodePosition={getNodePosition} />
      </svg>
    </div>
  );

  // Calculate the position of a node in the chart, based on its branch and position in the branch.
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

  // Calculate the y position dynamically based on the number of branches
  function getYPos(row, branches = chartBranches, chartH = CHART_VB_H) {
    const branchCount = Object.keys(branches).length;
    return row === 0 ? chartH / 2 : (chartH / branchCount) * row;
  }

  // Calculate number of columns in the evolution chart based on the longest branch
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

  // Group segments by branch for easier access. Could use useCallback but maybe overkill
  function groupByBranch(segs) {
    return segs.reduce((acc, cur) => {
      acc[cur.branch] = acc[cur.branch] || [];
      acc[cur.branch].push(cur);
      return acc;
    }, {});
  }
}

// Create the nested data structure of branches and segments for the chart
function createChartData(eChain, segments = [], connections = [], currentBranch = 0) {
  const doesEvolve = Array.isArray(eChain.evolvesTo);
  const evolutionDiverges = eChain.evolvesTo?.length > 1;

  // Add the current pokemon to the segments array
  segments.push({ id: eChain.pkmnId, branch: currentBranch });

  // Recursively assign branches to the evolution chain.
  // Branch 0 is the base branch, and all other branches are children of the base branch.
  if (doesEvolve) {
    eChain.evolvesTo.forEach((evo, idx) => {
      const nextBranch = evolutionDiverges ? idx + 1 : currentBranch;
      connections.push({ from: eChain.pkmnId, to: evo.pkmnId });
      createChartData(evo, segments, connections, nextBranch);
    });
  }

  return { segments, connections };
}
