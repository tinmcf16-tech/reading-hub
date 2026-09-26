// API Client for Grade 3 Full-Year Online Learning Hub

const BASE_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('hub_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async login(username, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('hub_token', res.token);
    localStorage.setItem('hub_user', JSON.stringify(res.user));
    return res;
  },

  logout() {
    localStorage.removeItem('hub_token');
    localStorage.removeItem('hub_user');
  },

  async getCurrentUser() {
    return request('/auth/me');
  },

  async getPublicStudents() {
    return request('/public/students');
  },

  // Curriculum & Access
  async getTerms(grade) {
    const q = grade ? `?grade=${encodeURIComponent(grade)}` : '';
    return request(`/terms${q}`);
  },

  async getWeeks(termId) {
    return request(`/terms/${termId}/weeks`);
  },

  async getWeekModules(termId, weekNum) {
    return request(`/curriculum/term/${termId}/week/${weekNum}`);
  },

  async getSubjectModule(termId, weekNum, subjectId) {
    return request(`/curriculum/term/${termId}/week/${weekNum}/subject/${subjectId}`);
  },

  // Learning Activity Submission
  async submitActivity(activityId, answer) {
    return request(`/activities/${activityId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    });
  },

  // Student Dashboard Summary
  async getStudentDashboardSummary() {
    return request('/student/dashboard-summary');
  },

  // Teacher Access Control & Management
  async toggleWeek(weekId) {
    return request(`/teacher/weeks/${weekId}/toggle`, { method: 'POST' });
  },

  async toggleTerm(termId) {
    return request(`/teacher/terms/${termId}/toggle`, { method: 'POST' });
  },

  async getTeacherOverview(grade) {
    const q = grade ? `?grade=${encodeURIComponent(grade)}` : '';
    return request(`/teacher/overview${q}`);
  },

  async getStudents(grade) {
    const q = grade ? `?grade=${encodeURIComponent(grade)}` : '';
    return request(`/teacher/students${q}`);
  },

  async addStudent(studentData) {
    return request('/teacher/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  async getStudentDetails(studentId) {
    return request(`/teacher/students/${studentId}/details`);
  },

  async getRemediation() {
    return request('/teacher/remediation');
  },

  async assignRemediation(data) {
    return request('/teacher/remediation/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async resolveRemediation(id) {
    return request(`/teacher/remediation/${id}/resolve`, { method: 'POST' });
  },

  async deleteStudent(studentId) {
    return request(`/teacher/students/${studentId}`, { method: 'DELETE' });
  },

  async updateStudentPassword(studentId, password) {
    return request(`/teacher/students/${studentId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  },

  getToken() {
    return localStorage.getItem('hub_token') || '';
  },

  async getTermReport(termId) {
    return request(`/teacher/reports/term/${termId}`);
  },

  async syncCloudRoster() {
    return request('/teacher/cloud-sync', { method: 'POST' });
  },

  async getSchoolYearReport(grade) {
    const q = grade ? `?grade=${encodeURIComponent(grade)}` : '';
    return request(`/teacher/reports/school-year${q}`);
  },
};
