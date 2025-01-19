import { useMemo, useRef, useState, useEffect } from 'react';
import styles from '../styles/EvolutionChart.module.css';

export default function EvolutionChart({ evolutionChain }) {
  const segments = useMemo(() => {
    return [
      { id: 'scyther', row: 'base' },
      { id: 'scizor', row: 'upper' },
      { id: 'kleavor', row: 'lower' },
      { id: 'scizorEvo', row: 'upper' },
      { id: 'kleavorEvo', row: 'lower' },
    ];
  }, []);

  // Suppose we want to connect 'base2' -> 'branchUp' and 'branchUp' -> 'lower1', etc.
  // In a real scenario, you'd figure out exactly which nodes are connected and map over them.
  const connections = [
    { from: 'scyther', to: 'scizor' },
    { from: 'scyther', to: 'kleavor' },
    { from: 'scizor', to: 'scizorEvo' },
    { from: 'kleavor', to: 'kleavorEvo' },
  ];

  const CHART_VB_W = 100;
  const CHART_VB_H = 30;

  function getNodePosition(idx, segs = segments) {
    if (idx < 0) return null;
    const x = getXPos(segs[idx]);
    const y = getYPos(segs[idx].row);
    return { x, y };
  }

  function getXPos(node, segs = segments, chartW = CHART_VB_W) {
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

  function getLineCoords(idx, segs = segments) {
    const fromNode = segments.find(
      (seg) => seg.id === connections.find((c) => c.to === segs[idx].id).from,
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
          {segments.map((seg, idx) => {
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

function SvgConnections({ coords, connections }) {
  // We need the bounding rect of the parent to properly align lines
  // If `evoChart` is our bounding container, we can measure it
  // Or you can just rely on absolute positioning at the page level.
  // For simplicity, let's assume we place an absolutely positioned SVG
  // at (0,0) of the entire window, so our line coords can be used directly.
  // If you want to *offset* them so the SVG only covers the chart,
  // measure the chart container's top/left and subtract that from x/y.

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none', // allows clicking through to the nodes
        width: '100%',
        height: '100%',
      }}
    >
      {connections.map(({ from, to }, idx) => {
        if (!coords[from] || !coords[to]) return null;
        return (
          <line
            key={idx}
            x1={coords[from].x}
            y1={coords[from].y}
            x2={coords[to].x}
            y2={coords[to].y}
            stroke="#555"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}
