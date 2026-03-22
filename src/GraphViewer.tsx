import { useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface GraphViewerProps {
  viewMode?: 'ledgers' | 'vision';
}

const colorMap: Record<string, string> = {
  Goals: '#3b82f6', // Blue
  Initiatives: '#eab308', // Yellow
  Projects: '#22c55e', // Green
  Agents: '#f97316', // Orange
  Learnings: '#a855f7', // Purple
  default: '#6b7280', // Gray
};

export default function GraphViewer({ viewMode = 'vision' }: GraphViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [legendOpen, setLegendOpen] = useState(true);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [rawNodes, setRawNodes] = useState<Node[]>([]);
  const [rawEdges, setRawEdges] = useState<Edge[]>([]);

  const toggleNodeCollapse = (nodeId: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  useEffect(() => {
    fetch('/graph_data.json')
      .then((res) => res.json())
      .then((data: GraphData) => {
        setRawNodes(data.nodes);
        setRawEdges(data.edges);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load graph data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || rawNodes.length === 0) return;

    // 1. Identify descendants that should be hidden
    const hiddenByCollapse = new Set<string>();
    
    // Helper to recursively find children (remember: edge source is child, target is parent)
    const findChildren = (parentId: string) => {
      rawEdges.forEach(edge => {
        if (edge.target === parentId) {
          hiddenByCollapse.add(edge.source);
          findChildren(edge.source);
        }
      });
    };

    collapsedNodes.forEach(nodeId => findChildren(nodeId));

    // 2. Filter nodes based on viewMode and collapse state
    let filteredNodes = rawNodes;
    if (viewMode === 'vision') {
      const coreCategories = ['Goals', 'Initiatives', 'Projects', 'Agents'];
      filteredNodes = rawNodes.filter(n => 
        !n.data.isLedger && 
        coreCategories.includes(n.data.category as string)
      );
    }

    const formattedNodes = filteredNodes.filter(n => !hiddenByCollapse.has(n.id)).map((node) => {
      const cat = node.data.category as string || 'default';
      const bgColor = colorMap[cat] || colorMap.default;
      const isLedger = node.data.isLedger as boolean;
      const status = (node.data.status as string || 'Active').toLowerCase();
      const isCollapsed = collapsedNodes.has(node.id);
      
      // Check if node has children in the raw data
      const hasChildren = rawEdges.some(e => e.target === node.id);

      // Status icon mapping
      const getStatusIcon = (s: string) => {
        switch(s) {
          case 'active': return (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#22c55e' }}>
              <circle cx="12" cy="12" r="10" />
            </svg>
          );
          case 'paused': return (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#eab308' }}>
              <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
            </svg>
          );
          case 'completed': return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" style={{ color: '#3b82f6' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          );
          default: return (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: '#8b949e' }}>
              <circle cx="12" cy="12" r="10" />
            </svg>
          );
        }
      };

      return {
        ...node,
        data: {
          ...node.data,
          label: (
            <div style={{ position: 'relative', textAlign: 'center' }}>
              {!isLedger && (
                <div style={{ position: 'absolute', top: -10, right: -10, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {getStatusIcon(status)}
                </div>
              )}
              
              {hasChildren && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleNodeCollapse(node.id); }}
                  aria-expanded={!isCollapsed}
                  aria-label={isCollapsed ? 'Expand node' : 'Collapse node'}
                  title={isCollapsed ? 'Expand node' : 'Collapse node'}
                  style={{ 
                    position: 'absolute', 
                    top: -10, 
                    left: -10, 
                    background: bgColor, 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    fontSize: '10px',
                    fontWeight: 900,
                    color: '#000',
                    border: 'none',
                    padding: 0
                  }}
                >
                  {isCollapsed ? '+' : '−'}
                </button>
              )}

              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', color: '#f3f4f6' }}>
                {String(node.data.label)}
              </div>
              {Boolean(node.data.description) && (
                <div style={{ fontSize: '0.7rem', color: '#8b949e', lineHeight: '1.3', fontStyle: 'italic' }}>
                  {String(node.data.description)}
                </div>
              )}

              {isCollapsed && hasChildren && (
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '0.65rem', 
                  color: bgColor, 
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  • Sub-nodes hidden
                </div>
              )}

              {node.data.category === 'Agents' && Boolean(node.data.role) && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '4px 8px', 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  borderRadius: '6px', 
                  fontSize: '0.65rem', 
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  fontWeight: 600,
                  lineHeight: '1.2'
                }}>
                  {String(node.data.role)}
                </div>
              )}
            </div>
          )
        },
        style: {
          ...node.style,
          background: 'rgba(13, 17, 23, 0.7)',
          backdropFilter: 'blur(8px)',
          border: `2px solid ${bgColor}`,
          borderRadius: '12px',
          padding: '16px',
          color: '#f3f4f6',
          boxShadow: `0 0 15px ${bgColor}40`, // glowing effect
          transition: 'all 0.3s ease',
          width: isLedger ? 280 : 250,
          opacity: isCollapsed ? 0.8 : 1
        },
      };
    });

    const nodeIds = new Set(formattedNodes.map(n => n.id));
    const finalEdges = rawEdges.filter(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)).map((edge) => ({
      ...edge,
      animated: true,
      style: { stroke: '#4b5563', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#4b5563',
      },
    }));

    setNodes(formattedNodes);
    setEdges(finalEdges);
  }, [rawNodes, rawEdges, loading, collapsedNodes, viewMode]);


  if (loading) {
    return <div role="status" aria-live="polite" className="loading" style={{
      color: '#8b949e', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#0D1117',
      fontSize: '1.2rem'
    }}>Loading Atlas Strategy...</div>;
  }

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 64px)', background: '#0D1117', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="dark"
        className="atlas-lens-graph"
      >
        <Background color="#1f2937" gap={16} />
        <Controls />
      </ReactFlow>

      {/* Floating Legend */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        background: 'rgba(21, 26, 33, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(48, 54, 61, 0.8)',
        borderRadius: '16px',
        padding: legendOpen ? '20px' : '10px 16px',
        zIndex: 10,
        boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: legendOpen ? '20px' : '0',
        minWidth: legendOpen ? '240px' : 'auto',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          aria-expanded={legendOpen}
          aria-label="Toggle Legend"
          title="Toggle Legend"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            cursor: 'pointer',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            width: '100%',
            padding: 0
          }}
        >
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            color: '#f3f4f6', 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em',
            margin: 0
          }}>
            Legend
          </div>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            style={{ 
              color: '#8b949e', 
              transition: 'transform 0.3s ease',
              transform: legendOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>

        {legendOpen && (
          <>
            {/* Entity Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                STRATEGIC ENTITIES
              </div>
              {[
                { label: 'Goals', color: colorMap.Goals, desc: 'Strategic Zenith' },
                { label: 'Initiatives', color: colorMap.Initiatives, desc: 'Frameworks' },
                { label: 'Projects', color: colorMap.Projects, desc: 'Execution' },
                { label: 'Agents', color: colorMap.Agents, desc: 'Workforce' }
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '3px', 
                    background: item.color,
                    boxShadow: `0 0 10px ${item.color}60`
                  }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f3f4f6' }}>{item.label}</div>
                    <div style={{ fontSize: '0.65rem', color: '#8b949e' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div style={{ height: '1px', background: 'rgba(48, 54, 61, 0.5)', margin: '0 -4px' }} />

            {/* Status Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                OPERATIONAL STATUS
              </div>
              {[
                { 
                  label: 'Active', 
                  icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>,
                  color: '#22c55e'
                },
                { 
                  label: 'Paused', 
                  icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>,
                  color: '#eab308'
                },
                { 
                  label: 'Completed', 
                  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>,
                  color: '#3b82f6'
                },
                { 
                  label: 'Planned', 
                  icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /></svg>,
                  color: '#8b949e'
                }
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '12px' }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#e5e7eb', fontWeight: 500 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
