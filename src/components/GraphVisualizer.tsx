import React, { useEffect, useState, useRef } from 'react';
import { OKFVerseNode, OKFCrossRefEdge } from '../types/okf';
import { OKFEngine } from '../services/okfEngine';
import { ZoomIn, ZoomOut, RefreshCw, Layers, Move } from 'lucide-react';

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
  vx: number;
  vy: number;
  isRoot: boolean;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  rootVerseId,
  onSelectVerse
}) => {
  const [nodes, setNodes] = useState<OKFVerseNode[]>([]);
  const [edges, setEdges] = useState<OKFCrossRefEdge[]>([]);
  const [layoutNodes, setLayoutNodes] = useState<NodeLayout[]>([]);
  
  const [depth, setDepth] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [hoveredNode, setHoveredNode] = useState<NodeLayout | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 900;
  const height = 650;
  const cx = width / 2;
  const cy = height / 2;

  // Fetch graph data when rootVerseId or depth changes
  useEffect(() => {
    const fetchGraph = async () => {
      const graph = await OKFEngine.getKnowledgeGraphSubnet(rootVerseId, depth);
      setNodes(graph.nodes);
      setEdges(graph.edges);

      // Initialize force layout positions
      const initialLayout: NodeLayout[] = [];
      const rootNodeObj = graph.nodes.find(n => n.id === rootVerseId);
      
      // Place root at center
      initialLayout.push({
        id: rootVerseId,
        ref: OKFEngine.formatRef(rootVerseId),
        text: rootNodeObj?.text || '',
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        isRoot: true
      });

      const otherNodes = graph.nodes.filter(n => n.id !== rootVerseId);
      const totalOthers = otherNodes.length;

      otherNodes.forEach((node, idx) => {
        // Multi-ring concentric radial distribution for clear spacing when many nodes exist
        const ring = Math.floor(idx / 12) + 1;
        const countInRing = Math.min(12, totalOthers - (ring - 1) * 12);
        const idxInRing = idx % 12;
        
        const radius = ring * 160;
        const angle = (idxInRing / countInRing) * 2 * Math.PI + (ring * 0.3);
        
        initialLayout.push({
          id: node.id,
          ref: OKFEngine.formatRef(node.id),
          text: node.text,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          vx: 0,
          vy: 0,
          isRoot: false
        });
      });

      setLayoutNodes(initialLayout);
    };

    fetchGraph();
  }, [rootVerseId, depth]);

  // Handle Dragging Node Movement
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    // Translate mouse screen coordinates to SVG viewBox space
    const mouseX = (e.clientX - rect.left) * (width / rect.width);
    const mouseY = (e.clientY - rect.top) * (height / rect.height);

    setLayoutNodes(prev => prev.map(node => {
      if (node.id === draggedNodeId) {
        return {
          ...node,
          x: mouseX,
          y: mouseY
        };
      }
      return node;
    }));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

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

  const nodeMap = new Map<string, NodeLayout>();
  layoutNodes.forEach(n => nodeMap.set(n.id, n));

  return (
    <div className="graph-canvas-container" ref={containerRef} onMouseUp={handleMouseUp}>
      {/* Top Bar Info & Controls */}
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 10, display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', padding: '0.55rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.88rem' }}>
          <Move size={16} />
          <span>Root: {OKFEngine.formatRef(rootVerseId)}</span>
          <span style={{ fontSize: '0.75rem', background: 'var(--accent-light)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>
            {nodes.length} Nodes • {edges.length} Edges
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '0.5rem' }}>
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

      {/* Zoom Controls */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, display: 'flex', gap: '4px', background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <button className="btn-icon" onClick={() => setZoom(z => Math.min(2.5, z + 0.15))} title="Zoom In">
          <ZoomIn size={16} />
        </button>
        <button className="btn-icon" onClick={() => setZoom(z => Math.max(0.4, z - 0.15))} title="Zoom Out">
          <ZoomOut size={16} />
        </button>
        <button className="btn-icon" onClick={() => setZoom(1)} title="Reset Zoom">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Interactive SVG Canvas */}
      <svg 
        ref={svgRef}
        className="graph-svg" 
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: draggedNodeId ? 'none' : 'transform 0.2s ease', cursor: draggedNodeId ? 'grabbing' : 'default' }}
      >
        <defs>
          <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Edges */}
        {edges.map(edge => {
          const source = nodeMap.get(edge.sourceVerseId);
          const target = nodeMap.get(edge.targetVerseId);
          if (!source || !target) return null;

          const color = getCategoryColor(edge.category);
          const isHovered = hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id);

          return (
            <g key={edge.id}>
              <line 
                x1={source.x} 
                y1={source.y} 
                x2={target.x} 
                y2={target.y} 
                stroke={color} 
                strokeWidth={isHovered ? edge.weight * 1.2 + 2 : edge.weight * 0.7 + 1} 
                strokeOpacity={isHovered ? 0.95 : 0.45} 
                strokeDasharray={edge.category === 'topical_echo' ? '5,4' : 'none'}
              />
            </g>
          );
        })}

        {/* Draggable Nodes */}
        {layoutNodes.map(node => {
          const isBeingDragged = draggedNodeId === node.id;
          const isHovered = hoveredNode?.id === node.id;

          return (
            <g 
              key={node.id} 
              transform={`translate(${node.x}, ${node.y})`}
              style={{ cursor: isBeingDragged ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
              onClick={() => {
                if (!isBeingDragged) onSelectVerse(node.id);
              }}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Central Glow for Root Node */}
              {node.isRoot && (
                <circle r={44} fill="url(#rootGlow)" />
              )}
              
              {/* Node Circle */}
              <circle 
                r={node.isRoot ? 22 : isHovered ? 18 : 14} 
                fill={node.isRoot ? '#6366f1' : isHovered ? 'var(--accent-primary)' : 'var(--bg-secondary)'} 
                stroke={node.isRoot ? '#ffffff' : isHovered ? '#ffffff' : 'var(--accent-primary)'} 
                strokeWidth={node.isRoot ? 3 : isHovered ? 2.5 : 2}
                filter="url(#shadow)"
                style={{ transition: isBeingDragged ? 'none' : 'all 0.15s ease' }}
              />

              {/* Node Reference Label */}
              <text 
                y={node.isRoot ? 38 : 28} 
                textAnchor="middle" 
                fill={node.isRoot ? '#ffffff' : isHovered ? 'var(--accent-primary)' : 'var(--text-primary)'} 
                fontSize={node.isRoot ? '12px' : '10px'} 
                fontWeight={node.isRoot || isHovered ? 'bold' : '500'}
                fontFamily="var(--font-display)"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {node.ref}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Dragging Help Tip */}
      <div style={{ position: 'absolute', bottom: '1rem', right: '1.25rem', fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-glass)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', pointerEvents: 'none' }}>
        💡 Drag any verse node to arrange references freely
      </div>

      {/* Hovered Node Text Preview Drawer */}
      {hoveredNode && (
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', maxWidth: '520px', boxShadow: 'var(--glass-shadow)', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
              {hoveredNode.ref} ({hoveredNode.id})
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Click to open in reader</span>
          </div>
          <p style={{ fontFamily: 'var(--font-scripture)', fontSize: '0.95rem', color: 'var(--text-scripture)', margin: 0, lineHeight: 1.5 }}>
            "{hoveredNode.text}"
          </p>
        </div>
      )}
    </div>
  );
};
