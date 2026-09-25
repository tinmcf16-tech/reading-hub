import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { sounds } from '../utils/audio';
import { User, Lock, Sparkles, GraduationCap, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

function getAvatarEmoji(avatarId) {
  if (avatarId && avatarId.includes('girl')) return '👧';
  return '👦';
}

export default function LoginModal({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'teacher'
  const [selectedStudent, setSelectedStudent] = useState(null); // student object if chosen from grid
  const [manualMode, setManualMode] = useState(false);
  
  // Real registered students from database
  const [studentsList, setStudentsList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [gradeFilter, setGradeFilter] = useState('All');

  const filteredStudents = gradeFilter === 'All'
    ? studentsList
    : studentsList.filter(s => (s.grade_level || 'Grade 3') === gradeFilter);

  // Form credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teacherUser, setTeacherUser] = useState('teacher');
  const [teacherPass, setTeacherPass] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActiveStudents();
  }, []);

  const loadActiveStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await api.getPublicStudents();
      setStudentsList(res.students || []);
    } catch (err) {
      console.error('Could not fetch active students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const submitLogin = async (userVal, passVal) => {
    if (!userVal || !passVal) {
      setError('Please enter both username and password/PIN.');
      return;
    }

    setLoading(true);
    setError('');
    sounds.init();
    try {
      const res = await api.login(userVal.trim(), passVal.trim());
      sounds.playCorrect();
      onLoginSuccess(res.user);
    } catch (err) {
      sounds.playTryAgain();
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (st) => {
    setSelectedStudent(st);
    setUsername(st.username);
    setPassword('');
    setError('');
  };

  const handleStudentFormSubmit = (e) => {
    e.preventDefault();
    submitLogin(username, password);
  };

  const handleTeacherFormSubmit = (e) => {
    e.preventDefault();
    submitLogin(teacherUser, teacherPass);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>
      <div className="card-3d" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '36px 32px',
        background: '#FFFFFF',
        borderRadius: '32px',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)'
      }} id="login-container">
        
        {/* Header Mascot */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '8px',
            display: 'inline-block',
            animation: 'float 3s ease-in-out infinite'
          }}>
            🌟
          </div>
          <h2 style={{ fontSize: '1.9rem', color: '#1E1B4B', marginBottom: '6px' }}>
            Reading HUB
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            Multi-Grade Online Learning Hub • Grades 1, 2 & 3 • San Vicente ES
          </p>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          borderRadius: '16px',
          padding: '4px',
          marginBottom: '24px',
          gap: '4px'
        }}>
          <button
            id="tab-student-login"
            type="button"
            onClick={() => { setActiveTab('student'); setError(''); setSelectedStudent(null); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '12px',
              border: 'none',
              fontFamily: 'var(--font-heading)',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              background: activeTab === 'student' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'student' ? '#4F46E5' : '#64748B',
              boxShadow: activeTab === 'student' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            👦👧 Student Login
          </button>
          <button
            id="tab-teacher-login"
            type="button"
            onClick={() => { setActiveTab('teacher'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '12px',
              border: 'none',
              fontFamily: 'var(--font-heading)',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              background: activeTab === 'teacher' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'teacher' ? '#4F46E5' : '#64748B',
              boxShadow: activeTab === 'teacher' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            👩‍🏫 Teacher Portal
          </button>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
            borderRadius: '14px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.95rem',
            textAlign: 'center',
            fontWeight: '600'
          }} id="login-error-msg">
            ⚠️ {error}
          </div>
        )}

        {/* ===================================================================
            TAB 1: 👦👧 STUDENT LOGIN (Shows LIVE Registered Learners from DB)
            =================================================================== */}
        {activeTab === 'student' && (
          <div>
            {!selectedStudent && !manualMode ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <p style={{ fontWeight: '700', color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                    Select your learner profile:
                  </p>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '8px', fontWeight: '700' }}>
                    {studentsList.length} Learners
                  </span>
                </div>

                {/* Grade Level Filter Buttons */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {['All', 'Grade 1', 'Grade 2', 'Grade 3'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGradeFilter(g)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1.5px solid',
                        borderColor: (gradeFilter === g) ? '#4F46E5' : '#E2E8F0',
                        background: (gradeFilter === g) ? '#EEF2FF' : '#FFFFFF',
                        color: (gradeFilter === g) ? '#4F46E5' : '#64748B',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {g === 'All' ? '🌟 All Grades' : `🎒 ${g}`}
                    </button>
                  ))}
                </div>

                {loadingStudents ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                    <span>Loading learners...</span>
                  </div>
                ) : filteredStudents.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    {filteredStudents.map(st => (
                      <button
                        key={st.id}
                        id={`btn-select-student-${st.username}`}
                        type="button"
                        onClick={() => handleStudentSelect(st)}
                        style={{
                          background: '#F8FAFC',
                          border: '2px solid #E2E8F0',
                          borderRadius: '18px',
                          padding: '14px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'center'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
                      >
                        <span style={{ fontSize: '36px', marginBottom: '6px' }}>{getAvatarEmoji(st.avatar_id)}</span>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B', marginBottom: '4px' }}>
                          {st.full_name}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          background: st.grade_level === 'Grade 1' ? '#FEF3C7' : st.grade_level === 'Grade 2' ? '#E0E7FF' : '#DCFCE7',
                          color: st.grade_level === 'Grade 1' ? '#92400E' : st.grade_level === 'Grade 2' ? '#3730A3' : '#166534',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          marginBottom: '4px'
                        }}>
                          {st.grade_level || 'Grade 3'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          <code>{st.username}</code>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', background: '#F8FAFC', borderRadius: '16px', color: '#64748B', marginBottom: '20px' }}>
                    <p style={{ margin: 0, fontWeight: '600' }}>No registered learners in {gradeFilter}.</p>
                    <span style={{ fontSize: '0.85rem' }}>Teacher Tin can register learners inside the Teacher Portal.</span>
                  </div>
                )}

                <div style={{ textAlign: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => { setManualMode(true); setUsername(''); setPassword(''); }}
                    className="btn-3d btn-outline"
                    style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                  >
                    ✏️ Type Username & PIN Manually
                  </button>
                </div>
              </div>
            ) : (
              /* PIN Input Form for Selected or Manual Student */
              <form onSubmit={handleStudentFormSubmit} id="form-student-login">
                {selectedStudent ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#EEF2FF',
                    border: '2px solid #C7D2FE',
                    borderRadius: '18px',
                    padding: '14px 16px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '36px' }}>{getAvatarEmoji(selectedStudent.avatar_id)}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#4F46E5', textTransform: 'uppercase' }}>Selected Learner</span>
                      <h4 style={{ fontSize: '1.15rem', color: '#1E1B4B', margin: 0 }}>{selectedStudent.full_name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>User: <code>{selectedStudent.username}</code></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedStudent(null); setPassword(''); }}
                      style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  /* Manual Username Input */
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>Student Username</label>
                      <button
                        type="button"
                        onClick={() => { setManualMode(false); setUsername(''); setPassword(''); }}
                        style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                      >
                        Pick from list
                      </button>
                    </div>
                    <input
                      id="input-student-username"
                      type="text"
                      autoFocus
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="e.g. zydnie or aishleen"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #CBD5E1',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {/* PIN / Password Field */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                    Secret PIN or Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="input-student-password"
                      type="password"
                      autoFocus={Boolean(selectedStudent)}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your student PIN / password"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #CBD5E1',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <button
                  id="btn-student-submit"
                  type="submit"
                  disabled={loading || !password}
                  className="btn-3d btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
                >
                  <KeyRound size={18} />
                  <span>{loading ? 'Verifying...' : 'Sign In to Learning Hub'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: 👩‍🏫 TEACHER PORTAL LOGIN (Strict Password Entry Required)
            =================================================================== */}
        {activeTab === 'teacher' && (
          <form onSubmit={handleTeacherFormSubmit} id="form-teacher-login">
            <div style={{
              background: '#F0FDF4',
              border: '2px solid #BBF7D0',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '38px', marginBottom: '6px' }}>👩‍🏫</div>
              <h3 style={{ fontSize: '1.25rem', color: '#166534', marginBottom: '2px' }}>
                Teacher Tin's Control Center
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#15803D' }}>
                Section Masinadyahon • Grade 3 Administrator
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                Teacher Username
              </label>
              <input
                id="input-teacher-username"
                type="text"
                required
                value={teacherUser}
                onChange={e => setTeacherUser(e.target.value)}
                placeholder="teacher"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #CBD5E1',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                Teacher Password
              </label>
              <input
                id="input-teacher-password"
                type="password"
                required
                autoFocus
                value={teacherPass}
                onChange={e => setTeacherPass(e.target.value)}
                placeholder="Enter teacher password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #CBD5E1',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              id="btn-teacher-submit"
              type="submit"
              disabled={loading || !teacherPass}
              className="btn-3d btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem', background: '#059669' }}
            >
              <ShieldCheck size={20} />
              <span>{loading ? 'Checking Access...' : 'Unlock Teacher Hub'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
