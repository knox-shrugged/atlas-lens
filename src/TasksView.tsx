import { useEffect, useState } from 'react';

interface TaskNode {
  id: string;
  data: {
    label: string;
    description: string;
    status: string;
    project: string;
    role?: string;
  };
  children: TaskNode[];
}

const sanitize = (val: string) => val.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

export default function TasksView() {
  const [tree, setTree] = useState<TaskNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/graph_data.json')
      .then((res) => res.json())
      .then((json) => {
        const tasks = json.nodes.filter((n: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => n.id.startsWith('Activities/Tasks/'));
        const root: TaskNode[] = [];
        const taskMap: Record<string, TaskNode> = {};

        // Sort by depth (fewer slashes first)
        tasks.sort((a: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, b: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => a.id.split('/').length - b.id.split('/').length);

        tasks.forEach((node: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
          const taskObj = { ...node, children: [] };
          taskMap[node.id] = taskObj;

          // Find logical parent
          // A parent would be the node with the same path but one level up, 
          // but our folder structure has "Sub-Tasks" literally in the path sometimes.
          // Strategy: The parent is the nearest ancestor in the taskMap.
          // Simplification for now: find the node whose ID is a prefix of this one
          const parent = Object.values(taskMap).find(t => {
            const dir = t.id.replace(/\/[^/]+\.md$/, '');
            return node.id.startsWith(dir + '/') && node.id !== t.id;
          });

          if (parent && parent.id !== node.id) {
            parent.children.push(taskObj);
          } else {
            root.push(taskObj);
          }
        });

        setTree(root);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTask = (node: TaskNode, depth = 0) => {
    const isExpanded = expanded[node.id] !== false; // Default expanded
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(250px, 1fr) 200px 100px 150px',
          padding: '12px 16px',
          borderBottom: '1px solid #21262d',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(22, 27, 34, 0.3)',
          transition: 'background 0.2s',
          ':hover': { background: 'rgba(33, 38, 45, 0.4)' }
        } as any /* eslint-disable-line @typescript-eslint/no-explicit-any */}>
          <div style={{ paddingLeft: `${depth * 24}px`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasChildren ? (
              <button 
                onClick={() => toggleExpand(node.id)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse task' : 'Expand task'}
                title={isExpanded ? 'Collapse task' : 'Expand task'}
                style={{ 
                  background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer',
                  padding: 0, display: 'flex', alignItems: 'center'
                }}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s'
                }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : (
              <div style={{ width: '16px' }} />
            )}
            <span style={{ fontWeight: 600, color: '#f3f4f6' }}>{node.data.label}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#8b949e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {node.data.description}
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            background: node.data.status === 'Active' ? 'rgba(35, 134, 54, 0.15)' : 'rgba(139, 148, 158, 0.15)',
            color: node.data.status === 'Active' ? '#3fb950' : '#8b949e',
            padding: '2px 8px',
            borderRadius: '10px',
            textAlign: 'center',
            width: 'fit-content'
          }}>
            {node.data.status}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#3b82f6', opacity: 0.8 }}>
            {sanitize(node.data.project)}
          </div>
        </div>
        {hasChildren && isExpanded && node.children.map(c => renderTask(c, depth + 1))}
      </div>
    );
  };

  if (loading) return <div role="status" aria-live="polite" className="loading">Initializing tactical tree...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#f3f4f6' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Tactical Task Audit</h2>
      
      <div style={{ 
        background: 'rgba(13, 17, 23, 0.6)', 
        backdropFilter: 'blur(16px)',
        border: '1px solid #30363d',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(250px, 1fr) 200px 100px 150px',
          padding: '16px',
          background: 'rgba(22, 27, 34, 0.8)',
          borderBottom: '2px solid #30363d',
          fontWeight: 700,
          color: '#8b949e',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <div>Mission / Tactical Unit</div>
          <div>Operational Summary</div>
          <div>Status</div>
          <div>Strategic Project</div>
        </div>
        
        <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
          {tree.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8b949e' }}>
              No tactical missions currently identified in this sector.
            </div>
          ) : (
            tree.map(rootNode => renderTask(rootNode))
          )}
        </div>
      </div>
    </div>
  );
}
