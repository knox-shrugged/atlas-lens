import { useState } from 'react'
import GraphViewer from './GraphViewer'
import TableView from './TableView'
import CalendarView from './CalendarView'
import TasksView from './TasksView'
import './App.css'

type Screen = 'vision' | 'learnings' | 'jobs' | 'tasks';

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('vision');

  const navigation = [
    { id: 'vision', label: 'Vision' },
    { id: 'learnings', label: 'Learnings' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'tasks', label: 'Tasks' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0D1117', color: '#f3f4f6' }}>
      <header style={{ 
        background: 'rgba(13, 17, 23, 0.95)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #30363d',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
          }}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
              <path d="M2 12h20"/>
            </svg>
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.4rem', 
            fontWeight: 700, 
            letterSpacing: '-0.025em',
            background: 'linear-gradient(to right, #f3f4f6, #9ca3af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>ATLAS LENS</h1>
        </div>
        
        <nav aria-label="Primary Navigation" style={{ display: 'flex', gap: '4px' }}>
          {navigation.map((screen) => (
            <button
              key={screen.id}
              onClick={() => setActiveScreen(screen.id as Screen)}
              aria-current={activeScreen === screen.id ? 'page' : undefined}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeScreen === screen.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: activeScreen === screen.id ? '#3b82f6' : '#8b949e',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {screen.label}
              {activeScreen === screen.id && (
                <div style={{ 
                  height: '2px', 
                  background: '#3b82f6', 
                  borderRadius: '1px', 
                  marginTop: '4px',
                  boxShadow: '0 0 10px #3b82f6'
                }} />
              )}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
        {activeScreen === 'vision' && <GraphViewer viewMode="vision" />}
        {activeScreen === 'learnings' && <TableView category="Learnings" />}
        {activeScreen === 'jobs' && <CalendarView />}
        {activeScreen === 'tasks' && <TasksView />}
      </main>
    </div>
  )
}


export default App