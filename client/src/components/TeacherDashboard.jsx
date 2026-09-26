import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { sounds } from '../utils/audio';
import { 
  Users, Lock, Unlock, BookOpen, AlertTriangle, FileSpreadsheet, 
  BarChart3, Plus, Search, CheckCircle2, ChevronRight, Download, RefreshCw, Eye, KeyRound, Trash2, Layers
} from 'lucide-react';
import ModulePlayer from './ModulePlayer';

export default function TeacherDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('access'); // 'overview' | 'access' | 'curriculum' | 'students' | 'remediation' | 'reports'
  const [selectedGrade, setSelectedGrade] = useState('Grade 1'); // 'Grade 1' | 'Grade 2' | 'Grade 3'
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [terms, setTerms] = useState([]);
  const [weeksMap, setWeeksMap] = useState({}); // { [termId]: weeksList }
  const [students, setStudents] = useState([]);
  const [remediationData, setRemediationData] = useState(null);

  // Curriculum browser state
  const [curriculumTermId, setCurriculumTermId] = useState(11);
  const [curriculumWeekNum, setCurriculumWeekNum] = useState(1);
  const [curriculumWeekData, setCurriculumWeekData] = useState(null);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [previewSubjectId, setPreviewSubjectId] = useState(null);
  
  // Student modal & details
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({ username: '', password: '', full_name: '', avatar_id: 'avatar_boy1', grade_level: 'Grade 1' });
  const [passwordModal, setPasswordModal] = useState(null); // { studentId, studentName, newPassword: '' }

  // Remediation assign modal
  const [assignModal, setAssignModal] = useState(null); // { user_id, competency_id, student_name, subject_name }
  const [remediationNotes, setRemediationNotes] = useState('');

  // Reports state
  const [selectedReportTerm, setSelectedReportTerm] = useState(11);
  const [termReportData, setTermReportData] = useState(null);
  const [schoolYearReport, setSchoolYearReport] = useState(null);

  useEffect(() => {
    loadAllData(selectedGrade);
  }, []);

  const loadCurriculumWeek = async (termId, weekNum) => {
    setLoadingCurriculum(true);
    try {
      const res = await api.getWeekModules(termId, weekNum);
      setCurriculumWeekData(res);
    } catch (err) {
      console.error(err);
      setCurriculumWeekData(null);
    } finally {
      setLoadingCurriculum(false);
    }
  };

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    let firstTermId = 11;
    if (grade === 'Grade 2') firstTermId = 21;
    else if (grade === 'Grade 3') firstTermId = 1;
    setSelectedReportTerm(firstTermId);
    setCurriculumTermId(firstTermId);
    setCurriculumWeekNum(1);
    setNewStudentForm(prev => ({ ...prev, grade_level: grade }));
    loadAllData(grade);
    loadCurriculumWeek(firstTermId, 1);
  };

  const loadAllData = async (targetGrade) => {
    const gr = targetGrade || selectedGrade;
    setLoading(true);
    try {
      const [overRes, termsRes, stRes, remRes] = await Promise.all([
        api.getTeacherOverview(gr),
        api.getTerms(gr),
        api.getStudents(gr),
        api.getRemediation()
      ]);

      setOverview(overRes);
      setTerms(termsRes.terms || []);
      setStudents(stRes.students || []);
      setRemediationData(remRes);

      // Load weeks for all terms of this grade
      const wMap = {};
      for (const t of termsRes.terms || []) {
        const wRes = await api.getWeeks(t.id);
        wMap[t.id] = wRes.weeks || [];
      }
      setWeeksMap(wMap);

      if (termsRes.terms && termsRes.terms.length > 0) {
        const firstTId = termsRes.terms[0].id;
        setCurriculumTermId(firstTId);
        loadCurriculumWeek(firstTId, 1);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWeek = async (week) => {
    try {
      const res = await api.toggleWeek(week.id);
      sounds.playTone(res.is_unlocked ? 587.33 : 330, 'triangle', 0.15, 0.2);

      // Update local state
      setWeeksMap(prev => ({
        ...prev,
        [week.term_id]: prev[week.term_id].map(w => w.id === week.id ? { ...w, is_unlocked: res.is_unlocked } : w)
      }));

      // Update overview unlocked count for selected grade
      const updatedOverview = await api.getTeacherOverview(selectedGrade);
      setOverview(updatedOverview);

    } catch (err) {
      alert(err.message || 'Failed to toggle week lock state');
    }
  };

  const handleToggleTerm = async (termId) => {
    try {
      const res = await api.toggleTerm(termId);
      setTerms(prev => prev.map(t => t.id === termId ? { ...t, is_locked: res.is_locked } : t));
    } catch (err) {
      alert(err.message || 'Failed to toggle term');
    }
  };

  const handleViewStudent = async (stId) => {
    try {
      const details = await api.getStudentDetails(stId);
      setSelectedStudentDetails(details);
    } catch (err) {
      alert(err.message || 'Failed to load student details');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentForm.username || !newStudentForm.password || !newStudentForm.full_name) {
      alert('Please fill out all fields');
      return;
    }

    try {
      await api.addStudent(newStudentForm);
      sounds.playCorrect();
      setShowAddStudentModal(false);
      setNewStudentForm({ username: '', password: '', full_name: '', avatar_id: 'avatar_boy1' });
      const stRes = await api.getStudents();
      setStudents(stRes.students || []);
    } catch (err) {
      alert(err.message || 'Failed to add student');
    }
  };

  const handleAssignRemediation = async () => {
    if (!assignModal) return;
    try {
      await api.assignRemediation({
        user_id: assignModal.user_id,
        competency_id: assignModal.competency_id,
        notes: remediationNotes
      });
      sounds.playCorrect();
      setAssignModal(null);
      setRemediationNotes('');
      const remRes = await api.getRemediation();
      setRemediationData(remRes);
    } catch (err) {
      alert(err.message || 'Failed to assign remediation');
    }
  };

  const handleResolveRemediation = async (id) => {
    try {
      await api.resolveRemediation(id);
      sounds.playCorrect();
      const remRes = await api.getRemediation();
      setRemediationData(remRes);
    } catch (err) {
      alert(err.message || 'Failed to resolve remediation');
    }
  };

  const loadTermReport = async (tId) => {
    try {
      const res = await api.getTermReport(tId);
      setTermReportData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFullYearReport = async () => {
    try {
      const res = await api.getSchoolYearReport(selectedGrade);
      setSchoolYearReport(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStudentPassword = async (e) => {
    e.preventDefault();
    if (!passwordModal || !passwordModal.newPassword) return;
    try {
      const res = await api.updateStudentPassword(passwordModal.studentId, passwordModal.newPassword);
      sounds.playCorrect();
      alert(`Success: ${res.message}`);
      setPasswordModal(null);
    } catch (err) {
      alert(err.message || 'Failed to update student password');
    }
  };

  const handleDeleteStudent = async (st) => {
    const confirm = window.confirm(`Are you sure you want to delete ${st.full_name} (${st.username})? All their activity records, progress, and badges will be permanently removed.`);
    if (!confirm) return;

    try {
      const res = await api.deleteStudent(st.id);
      sounds.playCorrect();
      alert(res.message);
      setSelectedStudentDetails(null);
      const stRes = await api.getStudents(selectedGrade);
      setStudents(stRes.students || []);
      const updatedOverview = await api.getTeacherOverview(selectedGrade);
      setOverview(updatedOverview);
    } catch (err) {
      alert(err.message || 'Failed to delete student');
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = api.getToken();
      const res = await fetch(`/api/teacher/reports/export-csv?grade=${encodeURIComponent(selectedGrade)}&token=${encodeURIComponent(token)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedGrade.replace(' ', '')}_SY2026-2027_Consolidated_Report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      sounds.playCorrect();
    } catch (err) {
      alert(`Failed to export CSV: ${err.message}`);
    }
  };

  if (previewSubjectId && curriculumTermId) {
    return (
      <ModulePlayer
        termId={curriculumTermId}
        weekNum={curriculumWeekNum}
        subjectId={previewSubjectId}
        onBack={() => setPreviewSubjectId(null)}
      />
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }} id="teacher-command-center">
      
      {/* 1. TOP TEACHER BANNER */}
      <div className="teacher-header" id="teacher-header-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Multi-Grade Teacher Command Center
            </span>
            <h1 style={{ fontSize: '2rem', marginTop: '4px' }}>
              Welcome, Teacher Tin! 👩‍🏫
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '1rem' }}>
              Grades 1, 2 & 3 • San Vicente Elementary School (SY 2026–2027)
            </p>
          </div>

          <button
            id="btn-refresh-teacher-data"
            onClick={() => loadAllData(selectedGrade)}
            className="btn-3d btn-outline"
            style={{ padding: '10px 18px', background: '#1E293B', color: '#FFFFFF', borderColor: '#334155' }}
          >
            <RefreshCw size={16} />
            <span>Sync Live Data</span>
          </button>
        </div>
      </div>

      {/* Grade Level Switcher Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#FFFFFF',
        padding: '12px 20px',
        borderRadius: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #E2E8F0',
        flexWrap: 'wrap'
      }} id="teacher-grade-selector-bar">
        <span style={{ fontWeight: '800', color: '#334155', fontSize: '0.95rem' }}>
          🎯 Select Grade Level:
        </span>
        {['Grade 1', 'Grade 2', 'Grade 3'].map(g => (
          <button
            key={g}
            id={`btn-select-grade-${g.replace(' ', '')}`}
            onClick={() => handleGradeChange(g)}
            style={{
              padding: '8px 18px',
              borderRadius: '14px',
              border: '2px solid',
              borderColor: selectedGrade === g ? '#4F46E5' : '#E2E8F0',
              background: selectedGrade === g ? '#4F46E5' : '#F8FAFC',
              color: selectedGrade === g ? '#FFFFFF' : '#475569',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: selectedGrade === g ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🎒 {g}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
          Active View: <strong style={{ color: '#4F46E5' }}>{selectedGrade} Curriculum & Roster</strong>
        </span>
      </div>

      {/* 2. TOP KPI CARDS */}
      {overview && (
        <div className="kpi-grid" id="teacher-kpi-row">
          <div className="kpi-card" id="kpi-students">
            <div className="kpi-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
              <Users size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>TOTAL LEARNERS</span>
              <h3 style={{ fontSize: '1.7rem', color: '#0F172A' }}>{overview.totalStudents}</h3>
            </div>
          </div>

          <div className="kpi-card" id="kpi-weeks">
            <div className="kpi-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
              <Unlock size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>UNLOCKED WEEKS</span>
              <h3 style={{ fontSize: '1.7rem', color: '#059669' }}>{overview.unlockedWeeks} / 33</h3>
            </div>
          </div>

          <div className="kpi-card" id="kpi-activities">
            <div className="kpi-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <BookOpen size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>SUBMISSIONS</span>
              <h3 style={{ fontSize: '1.7rem', color: '#D97706' }}>{overview.totalSubmissions}</h3>
            </div>
          </div>

          <div className="kpi-card" id="kpi-remediation">
            <div className="kpi-icon" style={{ background: '#FEF2F2', color: '#DC2626' }}>
              <AlertTriangle size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>NEEDS REMEDIATION</span>
              <h3 style={{ fontSize: '1.7rem', color: '#DC2626' }}>{overview.remediationCount} Alerts</h3>
            </div>
          </div>
        </div>
      )}

      {/* 3. NAVIGATION TABS */}
      <div className="teacher-tabs" id="teacher-tabs-nav">
        {[
          { id: 'access', label: '🔐 Week Access Control', icon: <Lock size={18} /> },
          { id: 'curriculum', label: '📚 Official DepEd BOW', icon: <BookOpen size={18} /> },
          { id: 'students', label: '👩‍🎓 Student Management', icon: <Users size={18} /> },
          { id: 'overview', label: '📊 Class Performance', icon: <BarChart3 size={18} /> },
          { id: 'remediation', label: '🚨 Remediation Center', icon: <AlertTriangle size={18} /> },
          { id: 'reports', label: '📋 Reports & Export', icon: <FileSpreadsheet size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            id={`teacher-nav-tab-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'reports') {
                loadTermReport(selectedReportTerm);
                loadFullYearReport();
              }
            }}
            className={`teacher-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===================================================================
          TAB 1: 🔐 WEEK ACCESS CONTROL (Enforced at Backend Level!)
          =================================================================== */}
      {activeTab === 'access' && (
        <div className="card-3d" style={{ padding: '32px' }} id="view-teacher-access-control">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '6px' }}>
              3-Term Week Access Controller
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Toggle the padlock button to instantly unlock or lock learning weeks for all students. 
              <strong> Restrictions are enforced at the database and API level</strong> — students cannot bypass locked weeks.
            </p>
          </div>

          {terms.map(t => {
            const weeks = weeksMap[t.id] || [];

            return (
              <div key={t.id} style={{ marginBottom: '36px', background: '#F8FAFC', borderRadius: '20px', padding: '24px', border: '2px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: '#1E293B' }}>
                      {t.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{t.theme}</p>
                  </div>

                  <button
                    id={`btn-toggle-term-${t.id}`}
                    onClick={() => handleToggleTerm(t.id)}
                    className="btn-3d btn-outline"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderColor: t.is_locked ? '#CBD5E1' : '#A7F3D0',
                      color: t.is_locked ? '#64748B' : '#065F46',
                      background: t.is_locked ? '#F1F5F9' : '#ECFDF5'
                    }}
                  >
                    {t.is_locked ? <Lock size={16} /> : <Unlock size={16} />}
                    <span>{t.is_locked ? 'Term Locked' : 'Term Active'}</span>
                  </button>
                </div>

                {/* 11 Weeks Grid for this Term */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '12px' }}>
                  {weeks.map(w => {
                    const isUnlocked = Boolean(w.is_unlocked);

                    return (
                      <div
                        key={w.id}
                        id={`teacher-week-toggle-card-${w.id}`}
                        style={{
                          background: isUnlocked ? '#FFFFFF' : '#F1F5F9',
                          border: `2px solid ${isUnlocked ? '#10B981' : '#CBD5E1'}`,
                          borderRadius: '16px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: isUnlocked ? '0 4px 10px rgba(16, 185, 129, 0.1)' : 'none'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: isUnlocked ? '#059669' : '#64748B' }}>
                              WEEK {w.week_number}
                            </span>
                            <span style={{ fontSize: '1.1rem' }}>
                              {isUnlocked ? '🔓' : '🔒'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B', display: 'block' }}>
                            {w.title}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', display: 'block', marginTop: '4px' }}>
                            {selectedGrade === 'Grade 3' ? '📚 6 Subjects (includes Science)' : '📚 5 Subjects (No Science)'}
                          </span>
                        </div>

                        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            id={`btn-toggle-week-${w.id}`}
                            onClick={() => handleToggleWeek(w)}
                            className={`btn-3d ${isUnlocked ? 'btn-outline' : 'btn-primary'}`}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '0.85rem',
                              borderColor: isUnlocked ? '#FCA5A5' : undefined,
                              color: isUnlocked ? '#DC2626' : undefined
                            }}
                          >
                            {isUnlocked ? <Lock size={14} /> : <Unlock size={14} />}
                            <span>{isUnlocked ? 'Lock Week' : 'Unlock Week'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setCurriculumTermId(t.id);
                              setCurriculumWeekNum(w.week_number);
                              loadCurriculumWeek(t.id, w.week_number);
                              setActiveTab('curriculum');
                            }}
                            className="btn-3d btn-outline"
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              fontSize: '0.78rem',
                              background: '#FFFFFF',
                              color: '#4F46E5',
                              borderColor: '#C7D2FE'
                            }}
                          >
                            <BookOpen size={13} />
                            <span>View BOW Subjects</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================================
          TAB: 📚 OFFICIAL DEPED BOW CURRICULUM BROWSER
          =================================================================== */}
      {activeTab === 'curriculum' && (
        <div className="card-3d" style={{ padding: '32px' }} id="view-teacher-curriculum-bow">
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  DepEd Budget of Work (BOW) Inspection
                </span>
                <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginTop: '4px' }}>
                  {selectedGrade} Curriculum & Competencies
                </h2>
              </div>

              <div style={{
                background: selectedGrade === 'Grade 3' ? '#EEF2FF' : '#FEF3C7',
                border: `1.5px solid ${selectedGrade === 'Grade 3' ? '#C7D2FE' : '#FDE68A'}`,
                padding: '8px 16px',
                borderRadius: '16px',
                color: selectedGrade === 'Grade 3' ? '#3730A3' : '#92400E',
                fontSize: '0.88rem',
                fontWeight: '700'
              }}>
                {selectedGrade === 'Grade 1' && "📌 Grade 1: 5 Subjects (Reading & Literacy, Language, Math, Makabansa, GMRC - No Science)"}
                {selectedGrade === 'Grade 2' && "📌 Grade 2: 5 Subjects (English, Filipino, Math, Makabansa, GMRC - No Science)"}
                {selectedGrade === 'Grade 3' && "📌 Grade 3: 6 Subjects (English, Filipino, Math, Science, Makabansa, GMRC)"}
              </div>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '8px' }}>
              Inspect weekly competencies exactly aligned to the DepEd Budget of Work (BOW) uploaded for {selectedGrade}. You can preview the full interactive lesson, activities, and quiz modules as seen by learners.
            </p>
          </div>

          {/* Term Selector */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {terms.map(t => (
              <button
                key={t.id}
                id={`btn-curriculum-term-${t.id}`}
                onClick={() => {
                  setCurriculumTermId(t.id);
                  loadCurriculumWeek(t.id, curriculumWeekNum);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '14px',
                  border: '2px solid',
                  borderColor: curriculumTermId === t.id ? '#4F46E5' : '#E2E8F0',
                  background: curriculumTermId === t.id ? '#4F46E5' : '#FFFFFF',
                  color: curriculumTermId === t.id ? '#FFFFFF' : '#334155',
                  fontWeight: '700',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: curriculumTermId === t.id ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                }}
              >
                <span>{t.title}</span>
              </button>
            ))}
          </div>

          {/* Week Selector Chips */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '24px'
          }}>
            {Array.from({ length: 11 }, (_, i) => i + 1).map(wNum => (
              <button
                key={wNum}
                id={`btn-curriculum-week-${wNum}`}
                onClick={() => {
                  setCurriculumWeekNum(wNum);
                  loadCurriculumWeek(curriculumTermId, wNum);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid',
                  borderColor: curriculumWeekNum === wNum ? '#10B981' : '#CBD5E1',
                  background: curriculumWeekNum === wNum ? '#10B981' : '#F8FAFC',
                  color: curriculumWeekNum === wNum ? '#FFFFFF' : '#475569',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Week {wNum}
              </button>
            ))}
          </div>

          {/* Week Modules / Competencies List */}
          {loadingCurriculum ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: '8px' }} />
              <p>Loading {selectedGrade} official competencies...</p>
            </div>
          ) : curriculumWeekData && curriculumWeekData.competencies ? (
            <div>
              <div style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '20px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>
                    {curriculumWeekData.week?.title || `Week ${curriculumWeekNum}`}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Access Status: <strong>{curriculumWeekData.week?.is_unlocked ? '🔓 Unlocked for Students' : '🔒 Locked'}</strong> • {curriculumWeekData.competencies.length} Subjects in this Week
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {curriculumWeekData.competencies.map(comp => (
                  <div
                    key={comp.subject_id}
                    id={`curriculum-card-${comp.subject_id}`}
                    style={{
                      background: '#FFFFFF',
                      border: '2px solid #E2E8F0',
                      borderTop: `5px solid ${comp.subject_color || '#4F46E5'}`,
                      borderRadius: '18px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '26px' }}>{comp.subject_icon}</span>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', color: '#0F172A', margin: 0 }}>
                            {comp.subject_name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: comp.subject_color || '#64748B' }}>
                            {comp.strand_domain || `${selectedGrade} Learning Area`}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px',
                        borderLeft: `4px solid ${comp.subject_color || '#4F46E5'}`,
                        marginBottom: '16px'
                      }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: comp.subject_color || '#4F46E5', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                          Official DepEd BOW Competency:
                        </span>
                        <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5, fontWeight: '500' }}>
                          {comp.competency_text}
                        </p>
                      </div>
                    </div>

                    <button
                      id={`btn-preview-${comp.subject_id}`}
                      onClick={() => setPreviewSubjectId(comp.subject_id)}
                      className="btn-3d btn-primary"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={16} />
                      <span>Preview Interactive Module</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
              <p>No competency data found for this week.</p>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB 2: 👩‍🎓 STUDENT MANAGEMENT & COMPLETE 33-WEEK DRILL-DOWN
          =================================================================== */}
      {activeTab === 'students' && (
        <div id="view-teacher-students">
          <div className="card-3d" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '4px' }}>
                  Learners Roster — {selectedGrade} ({students.length} Registered)
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                  Manage student profiles, track individual competency progress, or view full 33-week transcripts for {selectedGrade}.
                </p>
              </div>

              <button
                id="btn-add-student-modal"
                onClick={() => setShowAddStudentModal(true)}
                className="btn-3d btn-primary"
                style={{ padding: '10px 20px' }}
              >
                <Plus size={18} />
                <span>Add New Learner</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <table className="table-custom" id="table-students-list">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Username</th>
                <th>Activities Done</th>
                <th>Average Score</th>
                <th>Stars</th>
                <th>Streak</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(st => (
                <tr key={st.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{st.avatar_id && st.avatar_id.includes('girl') ? '👧' : '👦'}</span>
                      <div>
                        <strong style={{ color: '#1E293B', display: 'block' }}>{st.full_name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{st.grade_level || selectedGrade} • San Vicente ES</span>
                      </div>
                    </div>
                  </td>
                  <td><code>{st.username}</code></td>
                  <td><strong>{st.completed_activities || 0}</strong></td>
                  <td>
                    <span style={{
                      fontWeight: '800',
                      color: (st.avg_score || 0) >= 75 ? '#10B981' : '#F59E0B'
                    }}>
                      {st.avg_score || 0}%
                    </span>
                  </td>
                  <td>⭐ {st.total_stars || 0}</td>
                  <td>🔥 {st.current_streak || 1}d</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        id={`btn-view-student-${st.id}`}
                        onClick={() => handleViewStudent(st.id)}
                        className="btn-3d btn-outline"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        title="View Full Record"
                      >
                        <Eye size={14} />
                        <span>Record</span>
                      </button>
                      <button
                        id={`btn-pwd-student-${st.id}`}
                        onClick={() => setPasswordModal({ studentId: st.id, studentName: st.full_name, newPassword: '' })}
                        className="btn-3d btn-outline"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#4F46E5', borderColor: '#C7D2FE' }}
                        title="Set / Change PIN"
                      >
                        <KeyRound size={14} />
                        <span>PIN</span>
                      </button>
                      <button
                        id={`btn-del-student-${st.id}`}
                        onClick={() => handleDeleteStudent(st)}
                        className="btn-3d btn-outline"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#DC2626', borderColor: '#FECACA' }}
                        title="Delete Student"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Individual Student Drilldown Modal */}
          {selectedStudentDetails && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div className="card-3d" style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '32px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', color: '#1E293B' }}>
                      Learner Profile: {selectedStudentDetails.student.full_name}
                    </h2>
                    <span style={{ color: '#64748B', fontSize: '0.9rem' }}>
                      Username: <code>{selectedStudentDetails.student.username}</code> • Grade 3
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setPasswordModal({
                        studentId: selectedStudentDetails.student.id,
                        studentName: selectedStudentDetails.student.full_name,
                        newPassword: ''
                      })}
                      className="btn-3d btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#4F46E5' }}
                    >
                      <KeyRound size={14} />
                      <span>Set PIN</span>
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(selectedStudentDetails.student)}
                      className="btn-3d btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#DC2626' }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setSelectedStudentDetails(null)}
                      className="btn-3d btn-outline"
                      style={{ padding: '6px 14px' }}
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '700' }}>TOTAL STARS</span>
                    <h3 style={{ color: '#F59E0B' }}>⭐ {selectedStudentDetails.stats?.total_stars || 0}</h3>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '700' }}>CURRENT STREAK</span>
                    <h3 style={{ color: '#E11D48' }}>🔥 {selectedStudentDetails.stats?.current_streak || 1} Days</h3>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '700' }}>SUBMISSIONS</span>
                    <h3 style={{ color: '#4F46E5' }}>{selectedStudentDetails.submissions?.length || 0}</h3>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#1E293B' }}>
                  Competency Progress (All 3 Terms):
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', marginBottom: '24px' }}>
                  {selectedStudentDetails.progress?.length > 0 ? (
                    selectedStudentDetails.progress.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '10px 16px', borderRadius: '12px' }}>
                        <div>
                          <strong>{p.subject_name}</strong> • Term {p.term_id}, Week {p.week_number}
                        </div>
                        <div>
                          <span style={{ fontWeight: '700', color: p.percentage >= 75 ? '#10B981' : '#F59E0B', marginRight: '10px' }}>
                            {p.percentage}% ({p.completed_activities}/{p.total_activities})
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', background: p.status === 'mastered' ? '#ECFDF5' : '#FEF2F2', color: p.status === 'mastered' ? '#065F46' : '#991B1B' }}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#94A3B8', fontStyle: 'italic', padding: '12px' }}>No recorded activity yet.</p>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#1E293B' }}>
                  Recent Submissions:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedStudentDetails.submissions?.map(sub => (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F1F5F9', padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }}>
                      <span>{sub.activity_title}</span>
                      <strong>{sub.score} / {sub.max_score} pts ({sub.percentage}%)</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add Student Modal */}
          {showAddStudentModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div className="card-3d" style={{ maxWidth: '440px', width: '100%', background: '#FFFFFF', borderRadius: '24px', padding: '32px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '16px', color: '#0F172A' }}>Register New Learner</h3>
                <form onSubmit={handleAddStudent}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Grade Level</label>
                    <select
                      value={newStudentForm.grade_level || selectedGrade}
                      onChange={e => setNewStudentForm({ ...newStudentForm, grade_level: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontWeight: '700' }}
                    >
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Learner's Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jose Rizal"
                      value={newStudentForm.full_name}
                      onChange={e => setNewStudentForm({ ...newStudentForm, full_name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Username / Student ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. jose.rizal"
                      value={newStudentForm.username}
                      onChange={e => setNewStudentForm({ ...newStudentForm, username: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Password / PIN</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter password"
                      value={newStudentForm.password}
                      onChange={e => setNewStudentForm({ ...newStudentForm, password: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Learner Avatar</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setNewStudentForm({ ...newStudentForm, avatar_id: 'avatar_boy1' })}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          border: `2px solid ${newStudentForm.avatar_id === 'avatar_boy1' ? '#4F46E5' : '#CBD5E1'}`,
                          background: newStudentForm.avatar_id === 'avatar_boy1' ? '#EEF2FF' : '#FFFFFF',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          fontWeight: '700'
                        }}
                      >
                        👦 Boy Learner
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewStudentForm({ ...newStudentForm, avatar_id: 'avatar_girl1' })}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          border: `2px solid ${newStudentForm.avatar_id === 'avatar_girl1' ? '#EC4899' : '#CBD5E1'}`,
                          background: newStudentForm.avatar_id === 'avatar_girl1' ? '#FDF2F8' : '#FFFFFF',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          fontWeight: '700'
                        }}
                      >
                        👧 Girl Learner
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={() => setShowAddStudentModal(false)} className="btn-3d btn-outline" style={{ padding: '8px 16px' }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-3d btn-primary" style={{ padding: '8px 20px' }}>
                      Save Learner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Change Password / PIN Modal */}
          {passwordModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div className="card-3d" style={{ maxWidth: '420px', width: '100%', background: '#FFFFFF', borderRadius: '24px', padding: '32px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '8px', color: '#0F172A' }}>
                  🔑 Set Student PIN / Password
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Set a new secret PIN or password for <strong>{passwordModal.studentName}</strong>:
                </p>

                <form onSubmit={handleUpdateStudentPassword}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                      New PIN / Password
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. 1234 or student123"
                      value={passwordModal.newPassword}
                      onChange={e => setPasswordModal(prev => ({ ...prev, newPassword: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '2px solid #CBD5E1',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setPasswordModal(null)}
                      className="btn-3d btn-outline"
                      style={{ flex: 1, padding: '10px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-3d btn-primary"
                      style={{ flex: 1, padding: '10px' }}
                    >
                      Save PIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB 3: 📊 CLASS PERFORMANCE OVERVIEW
          =================================================================== */}
      {activeTab === 'overview' && overview && (
        <div id="view-teacher-overview">
          <div className="card-3d" style={{ padding: '32px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '8px' }}>
              Subject Performance Across All Six Areas
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '24px' }}>
              Average learner mastery and activity completions for each Grade 3 subject area:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
              {overview.subjectStats?.map(sub => (
                <div key={sub.id} style={{ background: '#F8FAFC', padding: '20px', borderRadius: '18px', border: '2px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '24px' }}>{sub.icon}</span>
                      <strong style={{ fontSize: '1.1rem', color: '#1E293B' }}>{sub.name}</strong>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: sub.color }}>
                      {sub.avg_mastery || 0}%
                    </span>
                  </div>

                  <div className="progress-track" style={{ height: '12px' }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${sub.avg_mastery || 0}%`, background: sub.color }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: '#64748B' }}>
                    <span>Target: 75% Mastery</span>
                    <span>{sub.total_completed || 0} activities submitted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 4: 🚨 REMEDIATION CENTER
          =================================================================== */}
      {activeTab === 'remediation' && (
        <div id="view-teacher-remediation">
          <div className="card-3d" style={{ padding: '32px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '6px' }}>
              Automated Remediation & Support Hub
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Learners with scores <strong>below 75%</strong> are automatically detected. Assign targeted exercises or review notes with one click.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            {/* Auto-detected struggling students */}
            <div className="card-3d" style={{ padding: '24px', borderColor: '#FECACA' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#991B1B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="#DC2626" />
                <span>Detected Competencies Needing Practice</span>
              </h3>

              {remediationData?.strugglingStudents?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {remediationData.strugglingStudents.map(item => (
                    <div key={item.id} style={{ background: '#FEF2F2', padding: '16px', borderRadius: '16px', border: '1px solid #FECACA' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ color: '#1E293B' }}>{item.student_name}</strong>
                        <span style={{ background: '#DC2626', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                          {item.percentage}%
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}>
                        <strong>{item.subject_name}</strong> • Week {item.week_number}: "{item.competency_text?.substring(0, 90)}..."
                      </p>
                      <button
                        onClick={() => {
                          setAssignModal({
                            user_id: item.user_id,
                            competency_id: item.competency_id || item.id,
                            student_name: item.student_name,
                            subject_name: item.subject_name
                          });
                        }}
                        className="btn-3d btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        Assign Remediation Exercises
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#15803D', fontStyle: 'italic' }}>
                  🎉 Fantastic! No students currently fall below the 75% mastery benchmark.
                </p>
              )}
            </div>

            {/* Existing Assigned Remediation */}
            <div className="card-3d" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '14px' }}>
                Active Remediation Assignments
              </h3>

              {remediationData?.assignments?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {remediationData.assignments.map(rem => (
                    <div key={rem.id} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ color: '#1E293B' }}>{rem.student_name}</strong>
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', background: rem.status === 'completed' ? '#ECFDF5' : '#FEF3C7', color: rem.status === 'completed' ? '#065F46' : '#92400E' }}>
                          {rem.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '6px' }}>
                        {rem.subject_name} • Term {rem.term_id}, Week {rem.week_number}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic', marginBottom: '10px' }}>
                        Note: "{rem.notes}"
                      </p>
                      {rem.status !== 'completed' && (
                        <button
                          onClick={() => handleResolveRemediation(rem.id)}
                          className="btn-3d btn-outline"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', color: '#059669', borderColor: '#A7F3D0' }}
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark as Mastered</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94A3B8', fontStyle: 'italic' }}>No active assignments.</p>
              )}
            </div>

          </div>

          {/* Remediation Assign Modal */}
          {assignModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div className="card-3d" style={{ maxWidth: '440px', width: '100%', background: '#FFFFFF', borderRadius: '24px', padding: '32px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '8px', color: '#0F172A' }}>Assign Remediation</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '16px' }}>
                  Student: <strong>{assignModal.student_name}</strong> • Subject: <strong>{assignModal.subject_name}</strong>
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Teacher's Guidance Notes</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Focus on counting using number lines and practice repeated addition..."
                    value={remediationNotes}
                    onChange={e => setRemediationNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button onClick={() => setAssignModal(null)} className="btn-3d btn-outline" style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                  <button onClick={handleAssignRemediation} className="btn-3d btn-primary" style={{ padding: '8px 20px' }}>
                    Assign Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB 5: 📋 REPORTS & COMPLETE SCHOOL-YEAR EXPORT
          =================================================================== */}
      {activeTab === 'reports' && (
        <div id="view-teacher-reports">
          <div className="card-3d" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '4px' }}>
                  Academic Reports & School Year Consolidation
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                  DepEd SF9-compatible term reports and full 33-week consolidated gradebook.
                </p>
              </div>

              {/* CSV Export Button */}
              <button
                id="btn-export-csv"
                onClick={handleExportCSV}
                className="btn-3d btn-green"
                style={{ padding: '12px 24px', cursor: 'pointer' }}
              >
                <Download size={18} />
                <span>Export CSV Report</span>
              </button>
            </div>
          </div>

          {/* Sub-tabs: Term 1, Term 2, Term 3, and Full Year */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[1, 2, 3].map(tNum => {
              const actualTermId = selectedGrade === 'Grade 1' ? 10 + tNum : selectedGrade === 'Grade 2' ? 20 + tNum : tNum;
              return (
                <button
                  key={tNum}
                  id={`btn-report-term-${tNum}`}
                  onClick={() => {
                    setSelectedReportTerm(actualTermId);
                    loadTermReport(actualTermId);
                  }}
                  className={`btn-3d ${selectedReportTerm === actualTermId ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                >
                  <span>Term {tNum} Report</span>
                </button>
              );
            })}
            <button
              id="btn-report-full-year"
              onClick={() => {
                setSelectedReportTerm(0);
                loadFullYearReport();
              }}
              className={`btn-3d ${selectedReportTerm === 0 ? 'btn-yellow' : 'btn-outline'}`}
              style={{ padding: '8px 18px', fontSize: '0.9rem' }}
            >
              <span>⭐ Full School-Year Report ({selectedGrade})</span>
            </button>
          </div>

          {/* Term Report Table */}
          {selectedReportTerm > 0 && termReportData && (
            <div className="card-3d" style={{ padding: '24px', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: '#1E293B' }}>
                {termReportData.term?.title} Consolidated Performance ({selectedGrade})
              </h3>
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Learner Name</th>
                    {termReportData.subjects?.map(s => (
                      <th key={s.id}>{s.name}</th>
                    ))}
                    <th>Term Average</th>
                    <th>Mastered</th>
                  </tr>
                </thead>
                <tbody>
                  {termReportData.reportData?.map(row => (
                    <tr key={row.student.id}>
                      <td><strong>{row.student.full_name}</strong></td>
                      {termReportData.subjects?.map(s => (
                        <td key={s.id}>{row.subjectScores?.[s.id] || 0}%</td>
                      ))}
                      <td>
                        <strong style={{ color: row.overallTermAvg >= 75 ? '#10B981' : '#F59E0B' }}>
                          {row.overallTermAvg}%
                        </strong>
                      </td>
                      <td>{row.masteredCompetencies} competencies</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Full School-Year Consolidated Report (33 Weeks) */}
          {selectedReportTerm === 0 && schoolYearReport && (
            <div className="card-3d" style={{ padding: '24px', overflowX: 'auto', borderTop: '6px solid #F59E0B' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#1E1B4B' }}>
                  SAN VICENTE ELEMENTARY SCHOOL
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                  {selectedGrade === 'Grade 3' ? 'Section Masinadyahon • ' : ''}{selectedGrade} • School Year 2026–2027 (33 Instructional Weeks)
                </p>
              </div>

              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Learner</th>
                    <th>Term 1 (11 Wks)</th>
                    <th>Term 2 (11 Wks)</th>
                    <th>Term 3 (11 Wks)</th>
                    <th>Final Average</th>
                    <th>Mastered</th>
                    <th>Stars</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolYearReport.fullYearData?.map(row => (
                    <tr key={row.student.id}>
                      <td><strong>{row.student.full_name}</strong></td>
                      <td>{row.t1_average || 0}%</td>
                      <td>{row.t2_average || 0}%</td>
                      <td>{row.t3_average || 0}%</td>
                      <td>
                        <strong style={{ fontSize: '1.05rem', color: row.general_average >= 75 ? '#10B981' : '#F59E0B' }}>
                          {row.general_average}%
                        </strong>
                      </td>
                      <td>⭐ {row.totalMastered} competencies</td>
                      <td>{row.stars} Stars</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
