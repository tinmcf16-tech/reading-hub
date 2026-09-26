import React, { useState } from 'react';
import { Volume2, VolumeX, LogOut, Award, Flame, Star, Shield, User } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function Navbar({ user, onLogout, onOpenProfile }) {
  const [muted, setMuted] = useState(sounds.muted);

  const toggleSound = () => {
    sounds.muted = !sounds.muted;
    setMuted(sounds.muted);
  };

  return (
    <header className="app-navbar" id="app-navbar">
      <div className="nav-container">
        <div className="nav-brand" id="nav-brand-logo">
          <div className="brand-icon">📚</div>
          <div className="brand-text">
            <h1>
              Reading HUB <span style={{ fontSize: '0.8rem', background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '12px', border: '1px solid #C7D2FE' }}>
                {user?.role === 'student' ? (user.grade_level || 'GRADE 1') : 'GRADES 1, 2 & 3'}
              </span>
            </h1>
            <p>San Vicente ES • Multi-Grade Online Learning Portal</p>
          </div>
        </div>

        <div className="nav-user" id="nav-user-actions">
          {/* Audio toggle button */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            className="btn-3d btn-outline"
            style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {muted ? <VolumeX size={18} color="#EF4444" /> : <Volume2 size={18} color="#10B981" />}
            <span style={{ display: 'none' }}>Audio</span>
          </button>

          {user && (
            <>
              {user.role === 'student' && (
                <>
                  <div className="user-badge-pill" id="badge-stars" title="Stars Earned">
                    <Star size={18} color="#F59E0B" fill="#F59E0B" />
                    <span>{user.stats?.total_stars || 0}</span>
                  </div>

                  <div className="user-badge-pill" id="badge-streak" style={{ background: '#FFF1F2', borderColor: '#FECDD3', color: '#BE123C' }} title="Learning Streak">
                    <Flame size={18} color="#E11D48" fill="#E11D48" />
                    <span>{user.stats?.current_streak || 1}d</span>
                  </div>
                </>
              )}

              {user.role === 'teacher' && (
                <div className="user-badge-pill" id="badge-teacher" style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#065F46' }}>
                  <Shield size={18} color="#059669" />
                  <span>Teacher Admin</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: user.role === 'teacher' ? '#3B82F6' : '#EC4899',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B' }}>{user.full_name?.split(' ')[0]}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'capitalize' }}>{user.role}</span>
                </div>
              </div>

              <button
                id="btn-logout"
                onClick={onLogout}
                className="btn-3d btn-outline"
                style={{ padding: '8px 12px', borderColor: '#FEE2E2', color: '#DC2626' }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
