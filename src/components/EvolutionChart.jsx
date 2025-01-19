import styles from '../styles/EvolutionChart.module.css';

export default function EvolutionChart({ evolutionChain }) {
  console.log(evolutionChain);

  function getChartData(
    eChain = evolutionChain,
    segments = [],
    connections = [],
    currentBranchName = 'base',
  ) {
    const doesEvolve = Array.isArray(eChain.evolvesTo);
    const evolutionDiverges = eChain.evolvesTo?.length > 1;

    segments.push({ id: eChain.pkmn.name, row: currentBranchName });

    if (doesEvolve) {
      eChain.evolvesTo.forEach((evo, idx) => {
        const newBranchName = evolutionDiverges
          ? idx === 0
            ? 'upper'
            : 'lower'
          : currentBranchName;
        connections.push({ from: eChain.pkmn.name, to: evo.pkmn.name });
        getChartData(evo, segments, connections, newBranchName);
      });
    }

    console.log(segments, connections);

    return { segments, connections };
  }

  const chartData = getChartData();

  const CHART_VB_W = 100;
  const CHART_VB_H = 30;

  function getNodePosition(idx, segs = chartData.segments) {
    if (idx < 0) return null;
    const x = getXPos(segs[idx]);
    const y = getYPos(segs[idx].row);
    return { x, y };
  }

  function getXPos(node, segs = chartData.segments, chartW = CHART_VB_W) {
    // Group segments by row
    const branches = segs.reduce(
      (acc, cur) => ({ ...acc, [cur.row]: [...acc[cur.row], cur] }),
      { base: [], upper: [], lower: [] },
    );

    // Find the position of the node in its branch
    const branch = branches[node.row];
    const indexInBranch = branch.findIndex((seg) => seg.id === node.id);
    // Calculate the position of the node in the entire chart
    const pos = indexInBranch + (node.row !== 'base' ? branches.base.length : 0);

    // Calculate the x position based on the segment count
    const segmentCount =
      branches.base.length + Math.max(branches.upper.length, branches.lower.length);
    const segmentWidth = chartW / segmentCount;
    const x = pos * segmentWidth + segmentWidth / 2;

    return x;
  }

  function getYPos(row, chartH = CHART_VB_H) {
    const rowHeights = { base: chartH / 2, lower: chartH * 0.75, upper: chartH * 0.25 };
    return rowHeights[row];
  }

  function getLineCoords(idx, segs = chartData.segments) {
    const fromNode = segs.find(
      (seg) => seg.id === chartData.connections.find((c) => c.to === segs[idx].id).from,
    );

    const x1 = getXPos(fromNode);
    const y1 = getYPos(fromNode.row);
    const x2 = getXPos(segs[idx]);
    const y2 = getYPos(segs[idx].row);

    return { x1, y1, x2, y2 };
  }

  return (
    <>
      <div className={styles.evoChart}>
        <svg
          viewBox={`0 0 ${CHART_VB_W} ${CHART_VB_H}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {chartData.segments.map((seg, idx) => {
            const { x, y } = getNodePosition(idx);
            const lineCoords = idx > 0 ? getLineCoords(idx) : null;
            return (
              <>
                <g>
                  {idx > 0 && (
                    <line
                      x1={lineCoords.x1}
                      y1={lineCoords.y1}
                      x2={lineCoords.x2}
                      y2={lineCoords.y2}
                      stroke="#555"
                      strokeWidth="2"
                    ></line>
                  )}
                  <circle key={seg.id} r="3" cx={x} cy={y} fill="#555"></circle>
                </g>
              </>
            );
          })}
        </svg>
      </div>
    </>
  );
}
