import { useEffect, useState } from 'react';

interface ActivityNode {
  id: string;
  data: {
    label: string;
    description?: string;
    schedule?: string;
    status?: string;
    project?: string;
    category: string;
  };
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const sanitize = (val: string) => val.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

export default function CalendarView() {
  const [activities, setActivities] = useState<ActivityNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/graph_data.json')
      .then(res => res.json())
      .then(data => {
        const filtered = (data.nodes || []).filter((n: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => n.id.startsWith('Activities/Jobs/') && !n.data.label.toLowerCase().includes('ledger'));
        setActivities(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching calendar data:', err);
        setLoading(false);
      });
  }, []);

  const getActivitiesForDay = (day: string) => {
    return activities.filter(a => {
      const sch = (a.data.schedule || '').toLowerCase();
      if (sch.includes('daily')) return true;
      if (sch.includes('weekday') && !['sat', 'sun'].includes(day.toLowerCase())) return true;
      if (sch.includes('weekend') && ['sat', 'sun'].includes(day.toLowerCase())) return true;
      return sch.includes(day.toLowerCase());
    });
  };

  if (loading) return <div role="status" aria-live="polite" style={{ color: '#8b949e', padding: '2rem', textAlign: 'center' }}>Loading Schedule...</div>;

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#f3f4f6', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Operational Jobs</h1>
        <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Recurring activities and scheduled agent behaviors across the ecosystem.</p>
      </header>

      <div style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '12px',
        overflowY: 'auto',
        minHeight: 0
      }}>
        {DAYS.map(day => (
          <div key={day} style={{ 
            background: 'rgba(21, 26, 33, 0.4)', 
            border: '1px solid rgba(48, 54, 61, 0.8)', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ 
              background: 'rgba(48, 54, 61, 0.3)', 
              padding: '12px', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: '#f3f4f6', 
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid rgba(48, 54, 61, 0.8)'
            }}>
              {day}
            </div>
            <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              {getActivitiesForDay(day).length === 0 ? (
                <div style={{ color: '#484f58', fontSize: '0.75rem', fontStyle: 'italic', textAlign: 'center', marginTop: '12px' }}>No Scheduled Tasks</div>
              ) : (
                getActivitiesForDay(day).map(a => (
                  <div key={a.id} style={{ 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)', 
                    borderRadius: '8px', 
                    padding: '10px',
                    transition: 'transform 0.2s',
                    cursor: 'default'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '4px' }}>{a.data.label}</div>
                    {a.data.project && (
                      <div style={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 700, 
                        color: '#3b82f6', 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}>
                        {sanitize(a.data.project)}
                      </div>
                    )}
                    {a.data.description && (
                      <div style={{ fontSize: '0.7rem', color: '#8b949e', lineHeight: '1.2' }}>{a.data.description}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
