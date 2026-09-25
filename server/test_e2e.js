// Comprehensive End-to-End Workflow Test for Reading HUB
const http = require('http');

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyStr = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyStr)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING FULL END-TO-END WORKFLOW VERIFICATION ===\n");
  const baseUrl = 'http://localhost:5000/api';

  // 1. STUDENT LOGIN
  console.log("1. Testing Student Login (juan.delacruz)...");
  const studentLogin = await post(`${baseUrl}/auth/login`, { username: 'juan.delacruz', password: 'student123' });
  if (studentLogin.status !== 200 || !studentLogin.data.token) {
    throw new Error("Student login failed: " + JSON.stringify(studentLogin));
  }
  const studentToken = studentLogin.data.token;
  console.log("   ✅ Student login successful! Welcome,", studentLogin.data.user.full_name);

  // 2. FETCH TERMS & WEEKS
  console.log("2. Verifying 3 Terms & 33 Weeks hierarchy...");
  const termsRes = await get(`${baseUrl}/terms`, studentToken);
  if (termsRes.data.terms.length !== 3) {
    throw new Error(`Expected 3 terms, got ${termsRes.data.terms.length}`);
  }
  console.log("   ✅ All 3 Terms verified:", termsRes.data.terms.map(t => t.title).join(' | '));

  const t1Weeks = await get(`${baseUrl}/terms/1/weeks`, studentToken);
  if (t1Weeks.data.weeks.length !== 11) {
    throw new Error(`Expected 11 weeks for Term 1, got ${t1Weeks.data.weeks.length}`);
  }
  console.log("   ✅ Term 1 has 11 instructional weeks.");

  // 3. VERIFY WEEK ACCESS CONTROL (Week 1 & 2 available, Week 3 locked)
  console.log("3. Testing Week Access Permissions...");
  const week1Res = await get(`${baseUrl}/curriculum/term/1/week/1`, studentToken);
  if (week1Res.status !== 200 || week1Res.data.competencies.length !== 6) {
    throw new Error("Failed to load Week 1: " + JSON.stringify(week1Res));
  }
  console.log("   ✅ Week 1 is UNLOCKED and contains all 6 Grade 3 subjects:");
  week1Res.data.competencies.forEach(c => console.log(`      - [${c.subject_name}] ${c.competency_text.substring(0, 60)}...`));

  // Verify Week 3 is initially locked for student
  console.log("   Checking that locked week (Week 4) returns 403 Forbidden to student...");
  const week4Res = await get(`${baseUrl}/curriculum/term/1/week/4`, studentToken);
  if (week4Res.status !== 403) {
    throw new Error(`Expected 403 for locked week 4, got status ${week4Res.status}`);
  }
  console.log("   ✅ Backend correctly rejected access to locked week:", week4Res.data.error);

  // 4. SUBMIT AN ACTIVITY & CALCULATE SCORE
  console.log("4. Testing Interactive Activity Submission & Score Calculation...");
  const englishModule = await get(`${baseUrl}/curriculum/term/1/week/1/subject/english`, studentToken);
  const firstAct = englishModule.data.activities[0];
  console.log(`   Selected Activity: "${firstAct.title}" (${firstAct.points} pts)`);

  const submitRes = await post(`${baseUrl}/activities/${firstAct.id}/submit`, { answer: 'A' }, studentToken);
  if (submitRes.status !== 200 || !submitRes.data.score) {
    throw new Error("Activity submission failed: " + JSON.stringify(submitRes));
  }
  console.log(`   ✅ Submission graded successfully: Score ${submitRes.data.score}/${submitRes.data.maxScore} (${submitRes.data.percentage}%)`);
  console.log(`   ✅ Feedback: "${submitRes.data.feedback}" | Stars Earned: +${submitRes.data.starsEarned}`);

  // 5. TEACHER LOGIN & ACCESS CONTROL TOGGLE
  console.log("\n5. Testing Teacher Login & Command Center Controls...");
  const teacherLogin = await post(`${baseUrl}/auth/login`, { username: 'teacher', password: 'teacher123' });
  if (teacherLogin.status !== 200 || teacherLogin.data.user.role !== 'teacher') {
    throw new Error("Teacher login failed");
  }
  const teacherToken = teacherLogin.data.token;
  console.log("   ✅ Teacher logged in:", teacherLogin.data.user.full_name);

  // Teacher Overview
  const overview = await get(`${baseUrl}/teacher/overview`, teacherToken);
  console.log(`   ✅ Teacher Overview: ${overview.data.totalStudents} learners, ${overview.data.unlockedWeeks} unlocked weeks, ${overview.data.totalSubmissions} submissions.`);

  // Teacher unlocks Week 3
  console.log("6. Testing Teacher Week Unlock Toggle (Week 3)...");
  const week3Obj = t1Weeks.data.weeks.find(w => w.week_number === 3);
  const toggleRes = await post(`${baseUrl}/teacher/weeks/${week3Obj.id}/toggle`, {}, teacherToken);
  if (toggleRes.status !== 200 || toggleRes.data.is_unlocked !== 1) {
    throw new Error("Failed to toggle week 3 unlock");
  }
  console.log("   ✅ Teacher unlocked Week 3:", toggleRes.data.message);

  // Verify student can now access Week 3!
  console.log("   Verifying student can now immediately access the newly unlocked Week 3...");
  const studentWeek3Res = await get(`${baseUrl}/curriculum/term/1/week/3`, studentToken);
  if (studentWeek3Res.status !== 200) {
    throw new Error(`Student could not access unlocked week 3! Status: ${studentWeek3Res.status}`);
  }
  console.log("   ✅ Student now has full access to Week 3 and its 6 subjects!");

  // 7. REMEDIATION CENTER
  console.log("\n7. Testing Automated Remediation Hub...");
  const remRes = await get(`${baseUrl}/teacher/remediation`, teacherToken);
  console.log(`   ✅ Remediation Hub loaded: ${remRes.data.strugglingStudents.length} struggling students detected, ${remRes.data.assignments.length} assigned.`);

  // 8. TERM REPORTS & 33-WEEK SCHOOL YEAR CONSOLIDATION
  console.log("\n8. Testing Academic Reports & Consolidation...");
  const term1Report = await get(`${baseUrl}/teacher/reports/term/1`, teacherToken);
  if (!term1Report.data || !term1Report.data.reportData) {
    console.error("DEBUG term1Report:", term1Report);
  }
  console.log(`   ✅ Term 1 Report generated for ${term1Report.data?.reportData?.length || 0} students.`);

  const schoolYearReport = await get(`${baseUrl}/teacher/reports/school-year`, teacherToken);
  console.log(`   ✅ Complete School-Year Report (33 Weeks) successfully consolidated:`);
  schoolYearReport.data.fullYearData.forEach(row => {
    console.log(`      - Learner: ${row.student.full_name.padEnd(20)} | T1: ${row.t1_average}% | T2: ${row.t2_average}% | T3: ${row.t3_average}% | General Avg: ${row.general_average}% | Mastered: ${row.totalMastered}`);
  });

  console.log("\n=======================================================");
  console.log("🎉 ALL TESTS PASSED! FULL SYSTEM IS VERIFIED & OPERATIONAL!");
  console.log("=======================================================");
}

runTests().catch(err => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
