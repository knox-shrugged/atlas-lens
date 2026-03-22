import { useEffect, useState } from 'react';

interface RowNode {
  id: string;
  data: {
    label: string;
    description: string;
    category: string;
  };
}

interface TableViewProps {
  category: string;
}

export default function TableView({ category }: TableViewProps) {
  const [data, setData] = useState<RowNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/graph_data.json')
      .then((res) => res.json())
      .then((json) => {
        const filtered = json.nodes.filter((node: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => node.data.category === category);
        setData(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load table data:', err);
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div role="status" aria-live="polite" style={{ padding: '40px', color: '#8b949e', textAlign: 'center' }}>
        Synthesizing strategic data...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', color: '#f3f4f6', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 600 }}>{category}</h2>
      
      <div style={{ 
        background: 'rgba(22, 27, 34, 0.5)', 
        backdropFilter: 'blur(8px)',
        border: '1px solid #30363d',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(33, 38, 45, 0.7)', borderBottom: '1px solid #30363d' }}>
              <th style={{ padding: '16px', fontWeight: 600, color: '#8b949e' }}>Identifier</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#8b949e' }}>Title</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#8b949e' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#8b949e' }}>
                  No records found in this vector.
                </td>
              </tr>
            ) : (
              data.map((node) => (
                <tr key={node.id} style={{ borderBottom: '1px solid #21262d', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#3b82f6', fontFamily: 'monospace' }}>
                    {node.id}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>
                    {node.data.label}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#8b949e', lineHeight: 1.5 }}>
                    {node.data.description || 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
