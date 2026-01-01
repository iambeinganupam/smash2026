import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JournalHistoryPage from './pages/JournalHistoryPage';
import './styles/index.css';
import GoalSection from './components/GoalSection';
import TodoSection from './components/TodoSection';
import JournalSection from './components/JournalSection';
import { LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';

// Dashboard Component (extracted for cleaner routing)
function Dashboard() {
  const { logout, user } = useAuth();

  return (
    <div className="container">
      <header className="header" style={{ position: 'relative' }}>
        <h1>Smash2026</h1>
        <p style={{ opacity: 0.7, fontSize: '1.2rem' }}>Crush your goals. Own your day.</p>

        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Hello, {user?.username}</span>
          <button
            onClick={logout}
            className="glass-card"
            style={{
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 0, 110, 0.3)',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} color="#ff006e" />
          </button>
        </div>
      </header>

      <div className="grid-layout">
        {/* Goals Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <GoalSection title="Long Term Goals" type="long-term" />
          <GoalSection title="Short Term Goals" type="short-term" />
        </div>

        {/* Todos Column */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TodoSection />
        </div>
      </div>

      <JournalSection />
    </div>
  );
}

function App() {
  useEffect(() => {
    document.title = "Smash2026 | Focus";
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <JournalHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
