import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { sounds } from '../utils/audio';
import { 
  Play, Lock, CheckCircle2, Star, Flame, Trophy, 
  BookOpen, ChevronRight, Award, Compass, Sparkles, Layers 
} from 'lucide-react';
import ModulePlayer from './ModulePlayer';

export default function StudentDashboard({ user, onRefreshUser }) {
  const [selectedGrade, setSelectedGrade] = useState(user?.grade_level || 'Grade 1');
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [weekData, setWeekData] = useState(null);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard(selectedGrade);
  }, [selectedGrade]);

  useEffect(() => {
    if (selectedTermId) {
      loadWeeksForTerm(selectedTermId);
    }
  }, [selectedTermId]);

  useEffect(() => {
    if (selectedTermId && selectedWeekNum) {
      loadWeekData(selectedTermId, selectedWeekNum);
    }
  }, [selectedTermId, selectedWeekNum]);

  const loadDashboard = async (targetGrade) => {
    setLoading(true);
    setError('');
    try {
      const termsRes = await api.getTerms(targetGrade);
      const gradeTerms = termsRes.terms || [];
      setTerms(gradeTerms);
      if (gradeTerms.length > 0) {
        setSelectedTermId(gradeTerms[0].id);
        setSelectedWeekNum(1);
      }
    } catch (err) {
      setError(err.message || 'Failed to load terms');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (grade) => {
    if (grade === selectedGrade) return;
    sounds.playTone(400, 'triangle', 0.1, 0.1);
    setSelectedGrade(grade);
  };

  const loadWeeksForTerm = async (tId) => {
    try {
      const weeksRes = await api.getWeeks(tId);
      setWeeks(weeksRes.weeks || []);
      // Default to first unlocked week or week 1
      const unlocked = (weeksRes.weeks || []).find(w => w.is_unlocked);
      if (unlocked) {
        setSelectedWeekNum(unlocked.week_number);
      } else {
        setSelectedWeekNum(1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadWeekData = async (tId, wNum) => {
    setError('');
    try {
      const res = await api.getWeekModules(tId, wNum);
      setWeekData(res);
    } catch (err) {
      setWeekData(null);
      setError(err.message);
    }
  };

  const handleSelectWeek = (w) => {
    if (!w.is_unlocked) {
      sounds.playTryAgain();
      alert(`🔒 Term ${w.term_id} - Week ${w.week_number} is currently locked by your teacher. Please study your available weeks first!`);
      return;
    }
    sounds.playTone(440, 'sine', 0.1, 0.1);
    setSelectedWeekNum(w.week_number);
  };

  // If a subject module is open, show the ModulePlayer
  if (activeSubjectId) {
    return (
      <ModulePlayer
        termId={selectedTermId}
        weekNum={selectedWeekNum}
        subjectId={activeSubjectId}
        onBack={() => {
          setActiveSubjectId(null);
          loadWeekData(selectedTermId, selectedWeekNum);
          if (onRefreshUser) onRefreshUser();
        }}
      />
    );
  }

  const selectedTerm = terms.find(t => t.id === selectedTermId) || terms[0];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }} id="student-dashboard-main">
      
      {/* GRADE LEVEL SWITCHER BAR */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '16px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        border: '2px solid #E2E8F0'
      }} id="student-grade-switcher">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={22} color="#4F46E5" />
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
              Select Grade Level to Study
            </span>
            <h3 style={{ fontSize: '1.15rem', color: '#0F172A', margin: 0 }}>
              Multi-Grade Learning Portal
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'Grade 1', label: '🎒 Grade 1', desc: '5 Subjects (Reading, Language, Math, Makabansa, GMRC)' },
            { id: 'Grade 2', label: '🎒 Grade 2', desc: '5 Subjects (English, Filipino, Math, Makabansa, GMRC)' },
            { id: 'Grade 3', label: '🎒 Grade 3', desc: '6 Subjects (includes Science)' }
          ].map(g => {
            const isCurrent = selectedGrade === g.id;
            return (
              <button
                key={g.id}
                id={`btn-student-grade-${g.id.replace(' ', '')}`}
                onClick={() => handleGradeChange(g.id)}
                title={g.desc}
                style={{
                  padding: '10px 20px',
                  borderRadius: '16px',
                  border: isCurrent ? '2px solid #4F46E5' : '2px solid #E2E8F0',
                  background: isCurrent ? '#4F46E5' : '#F8FAFC',
                  color: isCurrent ? '#FFFFFF' : '#334155',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  boxShadow: isCurrent ? '0 6px 16px rgba(79, 70, 229, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{g.label}</span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  opacity: isCurrent ? 0.9 : 0.7
                }}>
                  {g.id === 'Grade 3' ? '6 Subjects (with Science)' : '5 Subjects (No Science)'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. HERO GREETING BANNER */}
      <div className="hero-banner" id="student-hero-banner">
        <div className="hero-content">
          <span className="hero-tag">
            🌟 Currently Viewing: <strong>{selectedGrade}</strong> • {selectedGrade === 'Grade 3' ? 'Section Masinadyahon' : 'San Vicente Elementary School'}
          </span>
          <h1 className="hero-title">
            WELCOME, {user?.full_name?.toUpperCase() || 'LEARNER'}! 👋
          </h1>
          <p className="hero-subtitle">
            {selectedGrade === 'Grade 1' && "Discover Grade 1 MATATAG! Explore Reading and Literacy, Language, Mathematics, Makabansa, and GMRC!"}
            {selectedGrade === 'Grade 2' && "Explore Grade 2 MATATAG! Enjoy English, Filipino, Mathematics, Makabansa, and GMRC!"}
            {selectedGrade === 'Grade 3' && "Ready for Grade 3? Master English, Filipino, Mathematics, Science, Makabansa, and GMRC!"}
          </p>

          <div className="hero-stats-row">
            <div className="stat-pill" id="hero-stat-term">
              <span>📅</span>
              <span><strong>Term {selectedTerm?.term_number || 1}</strong> • Week {selectedWeekNum}</span>
            </div>
            <div className="stat-pill" id="hero-stat-grade-subs">
              <span>📚</span>
              <span><strong>{selectedGrade === 'Grade 3' ? '6 Subjects' : '5 Subjects'}</strong> in {selectedGrade}</span>
            </div>
            <div className="stat-pill" id="hero-stat-stars">
              <span>⭐</span>
              <span><strong>{user?.stats?.total_stars || 0}</strong> Stars</span>
            </div>
            <div className="stat-pill" id="hero-stat-streak">
              <span>🔥</span>
              <span><strong>{user?.stats?.current_streak || 1} Day</strong> Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MY LEARNING JOURNEY (3 TERMS × 11 WEEKS) */}
      <div style={{ marginBottom: '32px' }} id="learning-journey-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {selectedGrade} Full-Year Road Map (33 Weeks)
            </span>
            <h2 style={{ fontSize: '1.75rem', color: '#0F172A' }}>My Learning Journey</h2>
          </div>
        </div>

        {/* 3 Term Tabs */}
        <div className="term-tabs-container" id="term-tabs-row">
          {terms.map(t => (
            <button
              key={t.id}
              id={`tab-term-${t.term_number}`}
              onClick={() => {
                setSelectedTermId(t.id);
                sounds.playTone(350, 'triangle', 0.1, 0.1);
              }}
              className={`term-tab ${selectedTermId === t.id ? 'active' : ''}`}
            >
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B', fontWeight: '700' }}>
                  11 Instructional Weeks
                </span>
                <span style={{ fontSize: '1.15rem', color: '#1E293B', fontWeight: '700' }}>
                  {t.title}
                </span>
              </div>
              <span style={{ fontSize: '1.4rem' }}>
                {t.is_locked ? '🔒' : '🌟'}
              </span>
            </button>
          ))}
        </div>

        {/* 11 Weeks Horizontal/Grid Selector for Selected Term */}
        <div className="weeks-grid" id="weeks-selector-grid">
          {weeks.map(w => {
            const isSelected = selectedWeekNum === w.week_number;
            const isUnlocked = Boolean(w.is_unlocked);

            return (
              <div
                key={w.id}
                id={`card-week-${w.week_number}`}
                onClick={() => handleSelectWeek(w)}
                className={`week-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`}
                style={{
                  borderColor: isSelected ? '#4F46E5' : isUnlocked ? '#E2E8F0' : '#CBD5E1',
                  background: isSelected ? '#EEF2FF' : isUnlocked ? '#FFFFFF' : '#F8FAFC',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#64748B' }}>
                      WEEK {w.week_number}
                    </span>
                    <span className={`week-status-badge ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}>
                      {isUnlocked ? '✅ Available' : '🔒 Locked'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', color: '#1E293B', marginBottom: '4px' }}>
                    {w.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    {selectedGrade === 'Grade 3' ? '6 Subject Modules' : '5 Subject Modules'}
                  </p>
                </div>

                <div style={{ marginTop: '14px', textAlign: 'right' }}>
                  {isUnlocked ? (
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: isSelected ? '#4F46E5' : '#10B981',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{isSelected ? 'Currently Viewing' : 'Study Week'}</span>
                      <ChevronRight size={14} />
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                      Teacher control
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SUBJECTS INSIDE SELECTED WEEK */}
      <div id="weekly-subjects-container">
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '30px 28px',
          boxShadow: 'var(--shadow-card)',
          border: '2px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10B981', textTransform: 'uppercase' }}>
                {selectedGrade} Official DepEd MATATAG Curriculum • Week {selectedWeekNum}
              </span>
              <h2 style={{ fontSize: '1.7rem', color: '#0F172A', marginTop: '4px' }}>
                Weekly Subjects & Learning Areas
              </h2>
              <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>
                {selectedGrade === 'Grade 1' && "⭐ 5 Learning Areas: Reading & Literacy, Language, Mathematics, Makabansa, GMRC (No Science)"}
                {selectedGrade === 'Grade 2' && "⭐ 5 Learning Areas: English, Filipino, Mathematics, Makabansa, GMRC (No Science)"}
                {selectedGrade === 'Grade 3' && "⭐ 6 Learning Areas: English, Filipino, Mathematics, Science, Makabansa, GMRC"}
              </span>
            </div>

            <div style={{ background: '#F1F5F9', padding: '8px 16px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '700', color: '#475569' }}>
              Term {selectedTerm?.term_number || 1} • Week {selectedWeekNum} of 11 • {weekData?.competencies?.length || 0} Subjects
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '2px dashed #FCA5A5',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              color: '#991B1B'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔒</div>
              <h3 style={{ marginBottom: '6px' }}>This week is locked by your teacher</h3>
              <p>{error}</p>
            </div>
          )}

          {weekData && weekData.competencies && (
            <div className="subjects-grid" id="subjects-grid-cards">
              {weekData.competencies.map(comp => {
                const prog = comp.progress || { completed_activities: 0, total_activities: 8, percentage: 0, status: 'not_started' };
                const isMastered = prog.status === 'mastered';

                return (
                  <div
                    key={comp.subject_id}
                    id={`card-subject-${comp.subject_id}`}
                    className="subject-card"
                    style={{
                      borderTop: `6px solid ${comp.subject_color}`,
                      background: comp.subject_bg
                    }}
                  >
                    <div>
                      <div className="subject-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="subject-icon-box" style={{ background: '#FFFFFF', border: `2px solid ${comp.subject_color}` }}>
                            {comp.subject_icon}
                          </div>
                          <div>
                            <h3 className="subject-title">{comp.subject_name}</h3>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>
                              {comp.strand_domain || `${selectedGrade} Area`}
                            </span>
                          </div>
                        </div>

                        {isMastered && (
                          <span style={{ fontSize: '1.3rem' }} title="Competency Mastered!">
                            ⭐
                          </span>
                        )}
                      </div>

                      <div className="competency-box" style={{ background: '#FFFFFF', borderLeftColor: comp.subject_color }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: comp.subject_color, display: 'block', marginBottom: '4px' }}>
                          🎯 OFFICIAL DEPED BOW COMPETENCY:
                        </span>
                        <p style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: '600' }}>
                          {comp.competency_text}
                        </p>
                      </div>

                      {/* Progress Track */}
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>
                          <span>Activities: {prog.completed_activities} / 8</span>
                          <span>{prog.percentage}%</span>
                        </div>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${prog.percentage}%`,
                              background: prog.percentage >= 75 ? '#10B981' : comp.subject_color
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <button
                        id={`btn-open-subject-${comp.subject_id}`}
                        onClick={() => {
                          sounds.playTone(500, 'triangle', 0.15, 0.15);
                          setActiveSubjectId(comp.subject_id);
                        }}
                        className="btn-3d btn-primary"
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: comp.subject_color,
                          boxShadow: `0 4px 0 rgba(0,0,0,0.2)`
                        }}
                      >
                        <Play size={16} />
                        <span>Study Lesson & 8 Activities</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
