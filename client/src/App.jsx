import React, { useState, useEffect } from 'react';
import { api } from './utils/api';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('hub_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.getCurrentUser();
      setUser(res.user);
    } catch (err) {
      console.log('Session expired or invalid:', err.message);
      api.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  const handleRefreshUser = async () => {
    try {
      const res = await api.getCurrentUser();
      setUser(res.user);
    } catch (err) {}
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-gradient)'
      }}>
        <div style={{ fontSize: '54px', animation: 'float 2s ease-in-out infinite' }}>🌟</div>
        <h2 style={{ marginTop: '16px', color: '#4F46E5', fontFamily: 'var(--font-heading)' }}>
          Loading Reading HUB...
        </h2>
      </div>
    );
  }

  return (
    <div className="app-layout" id="reading-hub-root">
      <Navbar user={user} onLogout={handleLogout} />

      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        {!user && (
          <LoginModal onLoginSuccess={handleLoginSuccess} />
        )}

        {user && user.role === 'student' && (
          <StudentDashboard user={user} onRefreshUser={handleRefreshUser} />
        )}

        {user && user.role === 'teacher' && (
          <TeacherDashboard user={user} />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '24px 16px',
        color: '#64748B',
        fontSize: '0.85rem',
        borderTop: '1px solid #E2E8F0',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        marginTop: '40px'
      }}>
        <p style={{ fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>
          🌟 Grade 3 Full-Year Online Learning Hub (Reading HUB)
        </p>
        <p>
          San Vicente Elementary School • Concepcion District, SDO Romblon • Section Masinadyahon • SY 2026–2027
        </p>
        <p style={{ marginTop: '6px', fontSize: '0.75rem', color: '#94A3B8' }}>
          3 Terms • 33 Weeks • 6 Subjects • 198 Competency Modules • Powered by DepEd MATATAG BOW
        </p>
      </footer>
    </div>
  );
}
