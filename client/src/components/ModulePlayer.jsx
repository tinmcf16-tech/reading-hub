import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Volume2, Sparkles, CheckCircle2, XCircle, 
  Trophy, Star, HelpCircle, Play, ChevronRight, Award, Flame
} from 'lucide-react';

const TABS = [
  { id: 'competency', label: '🎯 Competency', day: 'Day 1' },
  { id: 'learn', label: '💡 Let\'s Learn', day: 'Day 1' },
  { id: 'explore', label: '🔎 Let\'s Explore', day: 'Day 2' },
  { id: 'practice', label: '✏️ Let\'s Practice', day: 'Day 3' },
  { id: 'play', label: '🎮 Let\'s Play', day: 'Day 4' },
  { id: 'challenge', label: '⭐ Challenge Me', day: 'Day 4' },
  { id: 'show_know', label: '📝 Show What You Know', day: 'Day 5' },
  { id: 'result', label: '🏆 My Result', day: 'Summary' }
];

export default function ModulePlayer({ termId, weekNum, subjectId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('competency');

  // Answers state: { [activityId]: chosenOption }
  const [userAnswers, setUserAnswers] = useState({});
  const [submissionResults, setSubmissionResults] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    loadModuleData();
  }, [termId, weekNum, subjectId]);

  const loadModuleData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getSubjectModule(termId, weekNum, subjectId);
      setData(res);

      // Pre-fill existing submissions if available
      if (res.myResult && res.myResult.submissions) {
        const resultsMap = {};
        const answersMap = {};
        res.myResult.submissions.forEach(sub => {
          resultsMap[sub.activity_id] = sub;
          answersMap[sub.activity_id] = sub.answer_data;
        });
        setSubmissionResults(resultsMap);
        setUserAnswers(answersMap);
      }
    } catch (err) {
      setError(err.message || 'Could not load learning module.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (activityId, optionKey) => {
    setUserAnswers(prev => ({ ...prev, [activityId]: optionKey }));
  };

  const handleAssessmentAnswer = (activityId, qId, optionKey) => {
    setUserAnswers(prev => ({
      ...prev,
      [activityId]: {
        ...(prev[activityId] || {}),
        [qId]: optionKey
      }
    }));
  };

  const handleSubmitAnswer = async (activity) => {
    const answer = userAnswers[activity.id];
    if (!answer) {
      alert('Please choose an answer first!');
      return;
    }

    setSubmitting(prev => ({ ...prev, [activity.id]: true }));
    try {
      const result = await api.submitActivity(activity.id, answer);
      setSubmissionResults(prev => ({ ...prev, [activity.id]: result }));

      if (result.isCorrect || result.percentage >= 75) {
        sounds.playCorrect();
        if (result.percentage === 100) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 }
          });
        }
      } else {
        sounds.playTryAgain();
      }

      // Refresh overall module result
      const updated = await api.getSubjectModule(termId, weekNum, subjectId);
      setData(prev => ({ ...prev, myResult: updated.myResult }));

    } catch (err) {
      alert(err.message || 'Failed to submit answer.');
    } finally {
      setSubmitting(prev => ({ ...prev, [activity.id]: false }));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '48px', animation: 'float 2s ease-in-out infinite' }}>🌟</div>
        <h3 style={{ marginTop: '16px', color: '#4F46E5' }}>Opening your learning module...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-container">
        <div className="card-3d" style={{ padding: '36px', textAlign: 'center', background: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ color: '#991B1B', marginBottom: '8px' }}>Module Locked</h2>
          <p style={{ color: '#B91C1C', marginBottom: '24px', fontSize: '1.05rem' }}>{error}</p>
          <button id="btn-back-from-error" onClick={onBack} className="btn-3d btn-primary">
            <ArrowLeft size={18} />
            <span>Return to Learning Hub</span>
          </button>
        </div>
      </div>
    );
  }

  const { week, competency, lesson, activities, myResult } = data;
  const practiceActivities = activities.filter(a => a.section_type === 'practice');
  const playActivities = activities.filter(a => a.section_type === 'play');
  const challengeActivities = activities.filter(a => a.section_type === 'challenge');
  const showKnowActivities = activities.filter(a => a.section_type === 'show_know');

  return (
    <div className="module-container" id="module-player-view">
      {/* Top Bar with Back and Subject Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button id="btn-module-back" onClick={onBack} className="btn-3d btn-outline" style={{ padding: '10px 18px' }}>
          <ArrowLeft size={18} />
          <span>Back to Week {weekNum}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '1.3rem',
            background: competency.subject_bg,
            border: `2px solid ${competency.subject_color}`,
            borderRadius: '12px',
            padding: '4px 10px'
          }}>
            {competency.subject_icon}
          </span>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#1E293B' }}>{competency.subject_name}</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '700' }}>Term {termId} • Week {weekNum}</span>
          </div>
        </div>
      </div>

      {/* 8-Part Stepper Navigation */}
      <div className="step-nav" id="step-navigation-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`step-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`step-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===================================================================
          1. 🎯 WEEKLY COMPETENCY
          =================================================================== */}
      {activeTab === 'competency' && (
        <div className="card-3d" style={{ padding: '36px', borderTop: `6px solid ${competency.subject_color}` }} id="view-weekly-competency">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '32px' }}>🎯</span>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: competency.subject_color, letterSpacing: '0.05em' }}>
                Department of Education (DepEd) Budget of Work
              </span>
              <h2 style={{ fontSize: '1.6rem', color: '#0F172A' }}>Authoritative Weekly Competency</h2>
            </div>
          </div>

          <div style={{
            background: competency.subject_bg,
            border: `2px solid ${competency.subject_color}`,
            borderRadius: '18px',
            padding: '24px 22px',
            fontSize: '1.25rem',
            fontWeight: '700',
            lineHeight: 1.5,
            color: '#1E293B',
            marginBottom: '24px'
          }}>
            "{competency.competency_text}"
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>STRAND / DOMAIN</span>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>{competency.strand_domain || 'Core Learning Area'}</span>
            </div>
            <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>MACRO-SKILLS</span>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>Listening, Speaking, Reading, Writing</span>
            </div>
            <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>RECOMMENDED PACING</span>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>5-Day Structured Experience</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              id="btn-next-to-learn"
              onClick={() => setActiveTab('learn')}
              className="btn-3d btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <span>Start Aralin: Let's Learn</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          2. 💡 LET'S LEARN
          =================================================================== */}
      {activeTab === 'learn' && (
        <div className="card-3d" style={{ padding: '36px' }} id="view-lets-learn">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>💡</span>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase' }}>Day 1 • Introduction</span>
                <h2 style={{ fontSize: '1.6rem', color: '#0F172A' }}>{lesson?.title || "Let's Learn"}</h2>
              </div>
            </div>

            <button
              id="btn-audio-read-aloud"
              onClick={() => sounds.speak(lesson?.explanation_learn || '')}
              className="btn-3d btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.9rem', color: '#4F46E5', borderColor: '#C7D2FE' }}
              title="Listen to Read Aloud"
            >
              <Volume2 size={18} />
              <span>Read Aloud</span>
            </button>
          </div>

          <div style={{
            background: '#F0F9FF',
            border: '2px solid #BAE6FD',
            borderRadius: '20px',
            padding: '28px',
            fontSize: '1.2rem',
            lineHeight: 1.7,
            color: '#0369A1',
            marginBottom: '28px',
            whiteSpace: 'pre-line'
          }}>
            {lesson?.explanation_learn}
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              id="btn-next-to-explore"
              onClick={() => setActiveTab('explore')}
              className="btn-3d btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <span>Continue: Let's Explore</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          3. 🔎 LET'S EXPLORE
          =================================================================== */}
      {activeTab === 'explore' && (
        <div className="card-3d" style={{ padding: '36px' }} id="view-lets-explore">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <span style={{ fontSize: '32px' }}>🔎</span>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>Day 2 • Deep Dive</span>
              <h2 style={{ fontSize: '1.6rem', color: '#0F172A' }}>Let's Explore: Stories & Real-Life Examples</h2>
            </div>
          </div>

          {/* Illustrated Short Story */}
          <div className="story-box">
            <h4 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📖 Kuwento at Sitwasyon sa San Vicente</span>
            </h4>
            <p>{lesson?.explore_story}</p>
          </div>

          {/* Key Examples Grid */}
          <h4 style={{ fontSize: '1.15rem', color: '#1E293B', marginBottom: '14px', marginTop: '24px' }}>
            ✨ Mahahalagang Halimbawa at Gabay:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {lesson?.explore_examples?.map((ex, idx) => (
              <div key={idx} style={{
                background: '#F8FAFC',
                border: '2px solid #E2E8F0',
                borderRadius: '16px',
                padding: '18px'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#4F46E5', display: 'block', marginBottom: '4px' }}>
                  {ex.term}
                </span>
                <p style={{ color: '#334155', fontSize: '0.95rem' }}>{ex.detail}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              id="btn-next-to-practice"
              onClick={() => setActiveTab('practice')}
              className="btn-3d btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <span>Practice Skills: Let's Practice</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          4. ✏️ LET'S PRACTICE
          =================================================================== */}
      {activeTab === 'practice' && (
        <div id="view-lets-practice">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '32px' }}>✏️</span>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#2563EB', textTransform: 'uppercase' }}>Day 3 • Skill Drills</span>
              <h2 style={{ fontSize: '1.6rem', color: '#0F172A' }}>Let's Practice: Interactive Exercises</h2>
            </div>
          </div>

          {practiceActivities.map((act, index) => {
            const chosen = userAnswers[act.id];
            const result = submissionResults[act.id];
            const isSubmitting = submitting[act.id];

            return (
              <div key={act.id} className="activity-box" id={`activity-practice-${index}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    background: act.difficulty === 'basic' ? '#ECFDF5' : '#EEF2FF',
                    color: act.difficulty === 'basic' ? '#065F46' : '#3730A3',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase'
                  }}>
                    {act.difficulty === 'basic' ? '🟢 Basic Recall' : '🟡 Application Practice'}
                  </span>
                  <span style={{ fontWeight: '700', color: '#F59E0B' }}>⭐ {act.points} pts</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#1E293B', marginBottom: '8px' }}>{act.title}</h3>
                <p style={{ color: '#64748B', marginBottom: '18px' }}>{act.instructions}</p>

                {/* Multiple Choice Render */}
                {act.activity_type === 'multiple_choice' && (
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '14px', color: '#0F172A' }}>
                      {act.question_data?.question}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {act.question_data?.options?.map((opt, oIdx) => {
                        const optKey = opt.charAt(0);
                        const isSelected = chosen === optKey;
                        let btnClass = 'option-btn';
                        if (isSelected) btnClass += ' selected';
                        if (result) {
                          if (result.isCorrect && isSelected) btnClass += ' correct';
                          if (!result.isCorrect && isSelected) btnClass += ' wrong';
                        }

                        return (
                          <button
                            key={oIdx}
                            id={`opt-act-${act.id}-${optKey}`}
                            onClick={() => handleSelectOption(act.id, optKey)}
                            disabled={isSubmitting}
                            className={btnClass}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 size={18} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* True or False Render */}
                {act.activity_type === 'true_false' && (
                  <div>
                    <div style={{
                      background: '#F8FAFC',
                      padding: '20px',
                      borderRadius: '16px',
                      fontSize: '1.15rem',
                      fontWeight: '700',
                      color: '#1E293B',
                      marginBottom: '16px',
                      border: '1px solid #E2E8F0'
                    }}>
                      "{act.question_data?.statement}"
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {['true', 'false'].map(val => {
                        const label = val === 'true' ? '✅ TAMA (True)' : '❌ MALI (False)';
                        const isSelected = chosen === val;
                        let btnClass = 'option-btn';
                        if (isSelected) btnClass += ' selected';
                        if (result) {
                          if (result.isCorrect && isSelected) btnClass += ' correct';
                          if (!result.isCorrect && isSelected) btnClass += ' wrong';
                        }

                        return (
                          <button
                            key={val}
                            id={`opt-tf-${act.id}-${val}`}
                            onClick={() => handleSelectOption(act.id, val)}
                            disabled={isSubmitting}
                            className={btnClass}
                            style={{ justifyContent: 'center' }}
                          >
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit button & feedback */}
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  {result ? (
                    <div style={{
                      background: result.isCorrect ? '#ECFDF5' : '#FEF2F2',
                      border: `1px solid ${result.isCorrect ? '#A7F3D0' : '#FECACA'}`,
                      borderRadius: '12px',
                      padding: '10px 16px',
                      fontWeight: '700',
                      color: result.isCorrect ? '#065F46' : '#991B1B'
                    }}>
                      {result.feedback} ({result.score}/{act.points} pts)
                    </div>
                  ) : <div />}

                  <button
                    id={`btn-submit-act-${act.id}`}
                    onClick={() => handleSubmitAnswer(act)}
                    disabled={isSubmitting || !chosen}
                    className="btn-3d btn-primary"
                    style={{ padding: '10px 22px' }}
                  >
                    <span>{result ? 'Submit Again' : 'Check My Answer'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <button
              id="btn-next-to-play"
              onClick={() => setActiveTab('play')}
              className="btn-3d btn-yellow"
              style={{ padding: '12px 28px' }}
            >
              <span>Play Mini-Game: Let's Play</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          5. 🎮 LET'S PLAY
          =================================================================== */}
      {activeTab === 'play' && (
        <div id="view-lets-play">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '32px' }}>🎮</span>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#7C3AED', textTransform: 'uppercase' }}>Day 4 • Educational Game</span>
              <h2 style={{ fontSize: '1.6rem', color: '#0F172A' }}>Let's Play: Star Quest Mini-Game</h2>
            </div>
          </div>

          {playActivities.map(act => {
            const result = submissionResults[act.id];
            return (
              <div key={act.id} className="card-3d" style={{ padding: '36px', background: 'linear-gradient(135deg, #FAF5FF 0%, #EFF6FF 100%)', borderColor: '#DDD6FE' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '54px', marginBottom: '8px' }}>🚀</div>
                  <h3 style={{ fontSize: '1.5rem', color: '#581C87', marginBottom: '6px' }}>{act.title}</h3>
                  <p style={{ color: '#6B21A8', fontSize: '1.05rem' }}>{act.instructions}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  {act.question_data?.pairs?.map((pair, pIdx) => (
                    <div key={pIdx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
                      border: '2px solid #E2E8F0'
                    }}>
                      <span style={{ fontWeight: '700', color: '#1E293B', fontSize: '1.05rem' }}>{pair.left}</span>
                      <span style={{ color: '#4F46E5', fontWeight: '800' }}>➔</span>
                      <span style={{ background: '#EEF2FF', padding: '6px 14px', borderRadius: '12px', color: '#3730A3', fontWeight: '700' }}>
                        {pair.right}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    id={`btn-play-game-${act.id}`}
                    onClick={() => {
                      handleSelectOption(act.id, { played: true });
                      handleSubmitAnswer({ ...act, points: 15 });
                    }}
                    className="btn-3d btn-primary"
                    style={{ padding: '14px 36px', fontSize: '1.15rem' }}
                  >
                    <span>⭐ Launch Star Match Quest (+15 Stars)</span>
                  </button>
                </div>

                {result && (
                  <div style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    background: '#ECFDF5',
                    color: '#065F46',
                    padding: '14px',
                    borderRadius: '14px',
                    fontWeight: '700'
                  }}>
                    {result.feedback}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <button
              id="btn-next-to-challenge"
              onClick={() => setActiveTab('challenge')}
              className="btn-3d btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <span>Take the Challenge: Challenge Me</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          6. ⭐ CHALLENGE ME
          =================================================================== */}
      {activeTab === 'challenge' && (
        <div id="view-challenge-me">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '32px' }}>⭐</span>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase' }}>Day 4 • Higher-Order Thinking</span>
              <h2 style={{ fontSize: '1.6rem', color: '#0F172A' }}>Challenge Me: Advanced Application</h2>
            </div>
          </div>

          {challengeActivities.map(act => {
            const chosen = userAnswers[act.id];
            const result = submissionResults[act.id];
            const isSubmitting = submitting[act.id];

            return (
              <div key={act.id} className="activity-box" style={{ borderLeft: '6px solid #F59E0B' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  background: '#FEF3C7',
                  color: '#92400E',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase'
                }}>
                  🔵 Higher-Order Problem Solving
                </span>

                <h3 style={{ fontSize: '1.25rem', color: '#1E293B', marginTop: '12px', marginBottom: '8px' }}>{act.title}</h3>
                <p style={{ color: '#64748B', marginBottom: '18px' }}>{act.instructions}</p>

                <div style={{
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  padding: '20px',
                  borderRadius: '16px',
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  color: '#78350F',
                  marginBottom: '16px'
                }}>
                  {act.question_data?.question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {act.question_data?.options?.map((opt, oIdx) => {
                    const optKey = opt.charAt(0);
                    const isSelected = chosen === optKey;
                    let btnClass = 'option-btn';
                    if (isSelected) btnClass += ' selected';
                    if (result) {
                      if (result.isCorrect && isSelected) btnClass += ' correct';
                      if (!result.isCorrect && isSelected) btnClass += ' wrong';
                    }

                    return (
                      <button
                        key={oIdx}
                        id={`opt-challenge-${act.id}-${optKey}`}
                        onClick={() => handleSelectOption(act.id, optKey)}
                        disabled={isSubmitting}
                        className={btnClass}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 size={18} />}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  {result ? (
                    <div style={{
                      background: result.isCorrect ? '#ECFDF5' : '#FEF2F2',
                      border: `1px solid ${result.isCorrect ? '#A7F3D0' : '#FECACA'}`,
                      borderRadius: '12px',
                      padding: '10px 16px',
                      fontWeight: '700',
                      color: result.isCorrect ? '#065F46' : '#991B1B'
                    }}>
                      {result.feedback} ({result.score}/{act.points} pts)
                    </div>
                  ) : <div />}

                  <button
                    id={`btn-submit-challenge-${act.id}`}
                    onClick={() => handleSubmitAnswer(act)}
                    disabled={isSubmitting || !chosen}
                    className="btn-3d btn-primary"
                    style={{ padding: '10px 22px' }}
                  >
                    <span>Submit Challenge</span>
                  </button>
                </div>
              </div>
            );
          })}

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <button
              id="btn-next-to-show-know"
              onClick={() => setActiveTab('show_know')}
              className="btn-3d btn-green"
              style={{ padding: '12px 28px' }}
            >
              <span>Take Assessment: Show What You Know</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          7. 📝 SHOW WHAT YOU KNOW
          =================================================================== */}
      {activeTab === 'show_know' && (
        <div id="view-show-what-you-know">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '32px' }}>📝</span>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>Day 5 • Assessment & Output</span>
              <h2 style={{ fontSize: '1.6rem', color: '#0F172A' }}>Show What You Know: Weekly Assessment</h2>
            </div>
          </div>

          {showKnowActivities.map(act => {
            const currentAns = userAnswers[act.id] || {};
            const result = submissionResults[act.id];
            const isSubmitting = submitting[act.id];

            return (
              <div key={act.id} className="card-3d" style={{ padding: '36px', borderTop: '6px solid #10B981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#059669', background: '#ECFDF5', padding: '4px 12px', borderRadius: '9999px' }}>
                    🏆 Final Weekly Assessment
                  </span>
                  <span style={{ fontWeight: '800', color: '#F59E0B', fontSize: '1.1rem' }}>⭐ {act.points} Points</span>
                </div>

                <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '24px' }}>
                  {act.instructions}
                </p>

                {act.question_data?.questions?.map((q, qIndex) => (
                  <div key={q.id} style={{ marginBottom: '24px', background: '#F8FAFC', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0' }}>
                    <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '14px', color: '#1E293B' }}>
                      {q.text}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {q.options?.map((opt, oIdx) => {
                        const optKey = opt.charAt(0);
                        const isSelected = currentAns[q.id] === optKey;

                        return (
                          <button
                            key={oIdx}
                            id={`opt-assessment-${act.id}-${q.id}-${optKey}`}
                            onClick={() => handleAssessmentAnswer(act.id, q.id, optKey)}
                            disabled={isSubmitting}
                            className={`option-btn ${isSelected ? 'selected' : ''}`}
                            style={{ background: isSelected ? '#EEF2FF' : '#FFFFFF' }}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 size={18} color="#4F46E5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                  {result ? (
                    <div style={{
                      background: result.percentage >= 75 ? '#ECFDF5' : '#FEF2F2',
                      border: `1px solid ${result.percentage >= 75 ? '#A7F3D0' : '#FECACA'}`,
                      borderRadius: '12px',
                      padding: '12px 18px',
                      fontWeight: '700',
                      color: result.percentage >= 75 ? '#065F46' : '#991B1B'
                    }}>
                      Score: {result.score} / {act.points} ({result.percentage}%) — {result.feedback}
                    </div>
                  ) : <div />}

                  <button
                    id={`btn-submit-assessment-${act.id}`}
                    onClick={() => handleSubmitAnswer(act)}
                    disabled={isSubmitting}
                    className="btn-3d btn-green"
                    style={{ padding: '14px 32px', fontSize: '1.1rem' }}
                  >
                    <span>{result ? 'Retake Assessment' : 'Submit Final Assessment'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <button
              id="btn-next-to-result"
              onClick={() => setActiveTab('result')}
              className="btn-3d btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <span>View Score & Completion: My Result</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          8. 🏆 MY RESULT
          =================================================================== */}
      {activeTab === 'result' && (
        <div className="card-3d" style={{ padding: '40px', textAlign: 'center' }} id="view-my-result">
          <div style={{
            fontSize: '64px',
            marginBottom: '12px',
            display: 'inline-block',
            animation: 'float 3s ease-in-out infinite'
          }}>
            🏆
          </div>

          <h2 style={{ fontSize: '2rem', color: '#1E1B4B', marginBottom: '8px' }}>
            {myResult?.progress?.status === 'mastered' ? 'Competency Mastered! 🎉' : 'Learning Progress Summary'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '28px' }}>
            {competency.subject_name} • Term {termId}, Week {weekNum}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '20px', border: '2px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>COMPLETION</span>
              <h3 style={{ fontSize: '1.8rem', color: '#4F46E5', marginTop: '4px' }}>
                {myResult?.progress?.completed_activities || 0} / {activities.length}
              </h3>
            </div>

            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '20px', border: '2px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>AVERAGE SCORE</span>
              <h3 style={{ fontSize: '1.8rem', color: '#10B981', marginTop: '4px' }}>
                {myResult?.progress?.percentage || 0}%
              </h3>
            </div>

            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '20px', border: '2px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>STATUS</span>
              <h3 style={{ fontSize: '1.4rem', color: '#D97706', marginTop: '6px', textTransform: 'capitalize' }}>
                {myResult?.progress?.status?.replace('_', ' ') || 'In Progress'}
              </h3>
            </div>
          </div>

          {/* Teacher Feedback Note */}
          <div style={{
            background: '#F0FDF4',
            border: '2px solid #BBF7D0',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <h4 style={{ fontSize: '1.1rem', color: '#166534', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👩‍🏫 Mensahe ni Teacher:</span>
            </h4>
            <p style={{ color: '#15803D', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {myResult?.progress?.percentage >= 75
                ? "Napakahusay ng iyong ipinamalas na galing at kasipagan! Ipagpatuloy ang pag-aaral at tulungan ang iyong mga kamag-aral!"
                : "Magandang pagsisikap! May kaunting kasanayan pa na kailangan nating balikan. Huwag mag-alala, gagabayan ka ni Teacher!"}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              id="btn-return-hub"
              onClick={onBack}
              className="btn-3d btn-primary"
              style={{ padding: '14px 32px' }}
            >
              <span>Back to Week {weekNum} Subjects</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
