// Renders each connection between nodes
export default function EvoChartConnections({ chartData, getNodePosition }) {
  const { segments, connections } = chartData;
  return connections.map((conn) => {
    const fromNode = segments.find((seg) => seg.id === conn.from);
    const toNode = segments.find((seg) => seg.id === conn.to);
    const startPos = getNodePosition(fromNode);
    const endPos = getNodePosition(toNode);
    return (
      <line
        key={`${conn.from}-${conn.to}`}
        x1={startPos.x + 7} // Adjusted so the line doesn't intersect with the node
        y1={startPos.y}
        x2={endPos.x - 7} // Adjusted so the line doesn't intersect with the node
        y2={endPos.y}
      ></line>
    );
  });
}
