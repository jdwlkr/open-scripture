import React, { useEffect, useState, useRef } from 'react';
import { OKFVerseNode, OKFCrossRefEdge } from '../types/okf';
import { OKFEngine } from '../services/okfEngine';
import { ZoomIn, ZoomOut, RefreshCw, Info, Layers } from 'lucide-react';

interface GraphVisualizerProps {
  rootVerseId: string;
  onSelectVerse: (verseId: string) => void;
}

interface NodeLayout {
  id: string;
  ref: string;
  text: string;
  x: number;
  y: number;
  isRoot: boolean;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  rootVerseId,
  onSelectVerse
}) => {
  const [nodes, setNodes] = useState<OKFVerseNode[]>([]);
  const [edges, setEdges] = useState<OKFCrossRefEdge[]>([]);
  const [depth, setDepth] = useState<number>(2);
  const [zoom, setZoom] = useState<number>(1);
  const [hoveredNode, setHoveredNode] = useState<NodeLayout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      const graph = await OKFEngine.getKnowledgeGraphSubnet(rootVerseId, depth);
      setNodes(graph.nodes);
      setEdges(graph.edges);
    };

    fetchGraph();
  }, [rootVerseId, depth]);

  // Compute radial layout coordinates around the central root verse
  const width = 800;
  const height = 600;
  const cx = width / 2;
  const cy = height / 2;

  const nodeMap = new Map<string, NodeLayout>();

  // Place root at center
  const rootNodeObj = nodes.find(n => n.id === rootVerseId);
  nodeMap.set(rootVerseId, {
    id: rootVerseId,
    ref: OKFEngine.formatRef(rootVerseId),
    text: rootNodeObj?.text || '',
    x: cx,
    y: cy,
    isRoot: true
  });

  const otherNodes = nodes.filter(n => n.id !== rootVerseId);
  const radius = 220;

  otherNodes.forEach((node, idx) => {
    const angle = (idx / Math.max(1, otherNodes.length)) * 2 * Math.PI;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    nodeMap.set(node.id, {
      id: node.id,
      ref: OKFEngine.formatRef(node.id),
      text: node.text,
      x,
      y,
      isRoot: false
    });
  });

  const layoutNodes = Array.from(nodeMap.values());

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'direct_quote': return '#ec4899';
      case 'prophecy_fulfillment': return '#8b5cf6';
      case 'parallel_account': return '#3b82f6';
      case 'topical_echo': return '#10b981';
      case 'linguistic_link': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  return (
    <div className="graph-canvas-container" ref={containerRef}>
      {/* Controls Overlay */}
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 10, display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Root: {OKFEngine.formatRef(rootVerseId)}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Depth:</span>
          <button 
            className="btn-icon" 
            style={{ width: '26px', height: '26px', fontSize: '0.75rem', background: depth === 1 ? 'var(--accent-primary)' : 'transparent', color: depth === 1 ? '#fff' : 'var(--text-secondary)' }}
            onClick={() => setDepth(1)}
          >
            1
          </button>
          <button 
            className="btn-icon" 
            style={{ width: '26px', height: '26px', fontSize: '0.75rem', background: depth === 2 ? 'var(--accent-primary)' : 'transparent', color: depth === 2 ? '#fff' : 'var(--text-secondary)' }}
            onClick={() => setDepth(2)}
          >
            2
          </button>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, display: 'flex', gap: '4px', background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <button className="btn-icon" onClick={() => setZoom(z => Math.min(2, z + 0.15))} title="Zoom In">
          <ZoomIn size={16} />
        </button>
        <button className="btn-icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.15))} title="Zoom Out">
          <ZoomOut size={16} />
        </button>
        <button className="btn-icon" onClick={() => setZoom(1)} title="Reset View">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* SVG Canvas */}
      <svg 
        className="graph-svg" 
        viewBox={`0 0 ${width} ${height}`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
      >
        <defs>
          <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {edges.map(edge => {
          const source = nodeMap.get(edge.sourceVerseId);
          const target = nodeMap.get(edge.targetVerseId);
          if (!source || !target) return null;

          const color = getCategoryColor(edge.category);

          return (
            <g key={edge.id}>
              <line 
                x1={source.x} 
                y1={source.y} 
                x2={target.x} 
                y2={target.y} 
                stroke={color} 
                strokeWidth={edge.weight * 0.8 + 1} 
                strokeOpacity={0.6} 
                strokeDasharray={edge.category === 'topical_echo' ? '4,4' : 'none'}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {layoutNodes.map(node => (
          <g 
            key={node.id} 
            transform={`translate(${node.x}, ${node.y})`}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelectVerse(node.id)}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {node.isRoot && (
              <circle r={36} fill="url(#rootGlow)" />
            )}
            
            <circle 
              r={node.isRoot ? 20 : 14} 
              fill={node.isRoot ? '#6366f1' : 'var(--bg-tertiary)'} 
              stroke={node.isRoot ? '#ffffff' : 'var(--accent-primary)'} 
              strokeWidth={2}
            />

            <text 
              y={node.isRoot ? 34 : 26} 
              textAnchor="middle" 
              fill="var(--text-primary)" 
              fontSize={node.isRoot ? '12px' : '10px'} 
              fontWeight={node.isRoot ? 'bold' : 'normal'}
              fontFamily="var(--font-display)"
            >
              {node.ref}
            </text>
          </g>
        ))}
      </svg>

      {/* Hovered Node Preview Tooltip */}
      {hoveredNode && (
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', maxWidth: '480px', boxShadow: 'var(--glass-shadow)', zIndex: 20 }}>
          <span style={{ fontWeight: 700, color: 'var(--accent-primary)', display: 'block', marginBottom: '4px' }}>
            {hoveredNode.ref} ({hoveredNode.id})
          </span>
          <p style={{ fontFamily: 'var(--font-scripture)', fontSize: '0.95rem', color: 'var(--text-scripture)', margin: 0 }}>
            "{hoveredNode.text}"
          </p>
        </div>
      )}
    </div>
  );
};
