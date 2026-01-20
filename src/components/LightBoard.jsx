import { useState, useRef, useEffect } from 'react';

/**
 * LightBoard Component - Interactive light board with wire connections
 * @param {Object} props
 * @param {Array} props.nodes - Light node definitions [{id, label, color}]
 * @param {Array} props.connections - Current wire connections [{from, to}]
 * @param {Function} props.onWireStart - Callback when wire drag starts
 * @param {Function} props.onWireComplete - Callback when wire is completed
 * @param {boolean} props.interactive - Whether user can draw wires
 * @param {Object} props.highlightWire - Wire to highlight {from, to, color}
 * @param {boolean} props.showAllPossible - Show all possible wire paths
 * @param {Array} props.possibleWires - All possible wire pairs
 */
export default function LightBoard({
  nodes = [],
  connections = [],
  onWireComplete,
  interactive = false,
  highlightWire = null,
  showAllPossible = false,
  possibleWires = [],
  pendingWire = null,
}) {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);

  // Calculate node positions in a circular pattern
  const getNodePosition = (index, total) => {
    const centerX = 200;
    const centerY = 200;
    const radius = 140;
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  const nodePositions = nodes.map((node, i) => ({
    ...node,
    ...getNodePosition(i, nodes.length),
  }));

  const handleMouseMove = (e) => {
    if (!selectedNode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleNodeClick = (node) => {
    if (!interactive) return;

    if (!selectedNode) {
      setSelectedNode(node);
    } else if (selectedNode.id !== node.id) {
      // Complete wire connection
      onWireComplete?.({
        from: selectedNode.id,
        to: node.id,
      });
      setSelectedNode(null);
    } else {
      // Clicked same node, cancel
      setSelectedNode(null);
    }
  };

  const getNodePos = (nodeId) => {
    return nodePositions.find((n) => n.id === nodeId);
  };

  // Render wire between two nodes
  const renderWire = (
    fromId,
    toId,
    color = '#88ff88',
    key,
    animated = false,
    dashed = false
  ) => {
    const from = getNodePos(fromId);
    const to = getNodePos(toId);
    if (!from || !to) return null;

    return (
      <g key={key}>
        {/* Glow effect */}
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={color}
          strokeWidth="8"
          strokeOpacity="0.3"
          strokeLinecap="round"
          style={dashed ? { strokeDasharray: '8 4' } : {}}
        />
        {/* Main wire */}
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={dashed ? { strokeDasharray: '8 4' } : {}}
          className={animated ? 'wire-animated' : ''}
        />
      </g>
    );
  };

  return (
    <div className="light-board-container">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="light-board-svg"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSelectedNode(null)}
      >
        {/* Background circle */}
        <circle
          cx="200"
          cy="200"
          r="170"
          fill="rgba(0,20,40,0.8)"
          stroke="rgba(100,150,200,0.3)"
          strokeWidth="2"
        />

        {/* Inner rings */}
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="none"
          stroke="rgba(100,150,200,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Show all possible wires (for Player B reference) */}
        {showAllPossible &&
          possibleWires.map((wire, i) =>
            renderWire(
              wire.from,
              wire.to,
              'rgba(100,100,100,0.4)',
              `possible-${i}`,
              false,
              true
            )
          )}

        {/* Existing connections */}
        {connections.map((conn, i) =>
          renderWire(
            conn.from,
            conn.to,
            conn.color || '#44ff88',
            `conn-${i}`,
            true
          )
        )}

        {/* Highlight wire (for pending question) */}
        {highlightWire &&
          renderWire(
            highlightWire.from,
            highlightWire.to,
            highlightWire.color || '#ffff44',
            'highlight',
            true
          )}

        {/* Pending wire for Player B */}
        {pendingWire &&
          renderWire(
            pendingWire.from,
            pendingWire.to,
            '#44aaff',
            'pending',
            true
          )}

        {/* Drawing wire */}
        {selectedNode && interactive && (
          <line
            x1={getNodePos(selectedNode.id)?.x}
            y1={getNodePos(selectedNode.id)?.y}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="#ffff44"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 4"
            className="wire-drawing"
          />
        )}

        {/* Light nodes */}
        {nodePositions.map((node) => (
          <g
            key={node.id}
            onClick={() => handleNodeClick(node)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            {/* Outer glow */}
            <circle
              cx={node.x}
              cy={node.y}
              r={
                selectedNode?.id === node.id
                  ? 28
                  : hoveredNode === node.id
                    ? 25
                    : 20
              }
              fill={node.color}
              opacity={0.3}
              className="node-glow"
            />
            {/* Main node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={15}
              fill={node.color}
              stroke={
                selectedNode?.id === node.id
                  ? '#ffffff'
                  : 'rgba(255,255,255,0.5)'
              }
              strokeWidth={selectedNode?.id === node.id ? 3 : 1}
              className="node-main"
            />
            {/* Inner highlight */}
            <circle
              cx={node.x - 4}
              cy={node.y - 4}
              r={5}
              fill="rgba(255,255,255,0.5)"
            />
            {/* Label */}
            <text
              x={node.x}
              y={node.y + 35}
              textAnchor="middle"
              fill="rgba(255,255,255,0.8)"
              fontSize="11"
              fontWeight="500"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {interactive && selectedNode && (
        <div className="wire-hint">
          Click đèn khác để nối dây từ{' '}
          <strong style={{ color: selectedNode.color }}>
            {selectedNode.label}
          </strong>
        </div>
      )}
    </div>
  );
}
