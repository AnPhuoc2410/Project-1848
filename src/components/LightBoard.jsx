import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * LightBoard Component - Interactive light board with wire connections
 * Updated for light theme matching main web design
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
    const radius = 130;
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
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    setMousePos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
  };

  const handleNodeClick = (node) => {
    if (!interactive) return;

    if (!selectedNode) {
      setSelectedNode(node);
    } else if (selectedNode.id !== node.id) {
      onWireComplete?.({
        from: selectedNode.id,
        to: node.id,
      });
      setSelectedNode(null);
    } else {
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
    color = '#16a34a',
    key,
    animated = false,
    dashed = false
  ) => {
    const from = getNodePos(fromId);
    const to = getNodePos(toId);
    if (!from || !to) return null;

    return (
      <g key={key}>
        {/* Shadow/glow effect */}
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={color}
          strokeWidth="6"
          strokeOpacity="0.25"
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
        className="light-board-svg light-theme"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSelectedNode(null)}
      >
        {/* Light background */}
        <defs>
          <linearGradient
            id="boardGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <filter id="dropShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Outer background circle */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="url(#boardGradient)"
          stroke="#e2e8f0"
          strokeWidth="2"
          filter="url(#dropShadow)"
        />

        {/* Inner rings */}
        <circle
          cx="200"
          cy="200"
          r="130"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
          strokeDasharray="6 4"
        />

        {/* Center dot */}
        <circle cx="200" cy="200" r="4" fill="#94a3b8" />

        {/* Show all possible wires */}
        {showAllPossible &&
          possibleWires.map((wire, i) =>
            renderWire(
              wire.from,
              wire.to,
              '#94a3b8',
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
            conn.color || '#16a34a',
            `conn-${i}`,
            true
          )
        )}

        {/* Highlight wire (for pending question) */}
        {highlightWire &&
          renderWire(
            highlightWire.from,
            highlightWire.to,
            highlightWire.color || '#eab308',
            'highlight',
            true
          )}

        {/* Pending wire for Player B */}
        {pendingWire &&
          renderWire(
            pendingWire.from,
            pendingWire.to,
            '#3b82f6',
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
            stroke="#eab308"
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
                  ? 26
                  : hoveredNode === node.id
                    ? 23
                    : 18
              }
              fill={node.color}
              opacity={0.25}
              className="node-glow"
            />
            {/* Main node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={14}
              fill={node.color}
              stroke={selectedNode?.id === node.id ? '#1f2937' : '#ffffff'}
              strokeWidth={selectedNode?.id === node.id ? 3 : 2}
              filter="url(#dropShadow)"
              className="node-main"
            />
            {/* Inner highlight */}
            <circle
              cx={node.x - 3}
              cy={node.y - 3}
              r={4}
              fill="rgba(255,255,255,0.6)"
            />

            {/* Label with background for readability */}
            <rect
              x={node.x - 28}
              y={node.y + 22}
              width="56"
              height="18"
              rx="4"
              fill="white"
              fillOpacity="0.9"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={node.x}
              y={node.y + 34}
              textAnchor="middle"
              fill="#1f2937"
              fontSize="11"
              fontWeight="600"
              fontFamily="var(--font-atkinson)"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {interactive && selectedNode && (
        <div className="wire-hint-light">
          Click đèn khác để nối dây từ{' '}
          <strong style={{ color: selectedNode.color }}>
            {selectedNode.label}
          </strong>
        </div>
      )}
    </div>
  );
}

LightBoard.propTypes = {
  nodes: PropTypes.array,
  connections: PropTypes.array,
  onWireComplete: PropTypes.func,
  interactive: PropTypes.bool,
  highlightWire: PropTypes.object,
  showAllPossible: PropTypes.bool,
  possibleWires: PropTypes.array,
  pendingWire: PropTypes.object,
};
