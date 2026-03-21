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

const colorMap: Record<string, string> = {
  Goals: '#3b82f6', // Blue
  Projects: '#22c55e', // Green
  Initiatives: '#eab308', // Yellow
  Learnings: '#a855f7', // Purple
  default: '#6b7280', // Gray
};

export default function GraphViewer() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/graph_data.json')
      .then((res) => res.json())
      .then((data: GraphData) => {
        const formattedNodes = data.nodes.map((node) => {
          const cat = node.data.category as string || 'default';
          const bgColor = colorMap[cat] || colorMap.default;

          return {
            ...node,
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
              width: 250,
            },
          };
        });

        const formattedEdges = data.edges.map((edge) => ({
          ...edge,
          animated: true,
          style: { stroke: '#4b5563', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#4b5563',
          },
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load graph data:', err);
        setLoading(false);
      });
  }, [setNodes, setEdges]);

  if (loading) {
    return <div className="loading">Loading Graph Data...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0D1117' }}>
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
    </div>
  );
}
