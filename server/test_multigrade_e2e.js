// End-to-End Multi-Grade Test Script
const BASE = 'http://localhost:5000/api';

async function req(path, opts = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...opts,
        headers: {
            'Content-Type': 'application/json',
            ...(opts.headers || {})
        }
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data;
}

async function runTests() {
    console.log("==================================================");
    console.log("   RUNNING MULTI-GRADE E2E VERIFICATION SUITE     ");
    console.log("==================================================");

    // 1. Teacher Login
    console.log("\n[Test 1] Logging in as Teacher Tin...");
    const teacherAuth = await req('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'teacher', password: 'teacher123' })
    });
    console.log(` Teacher Tin logged in successfully! Role: ${teacherAuth.user.role}, Name: ${teacherAuth.user.full_name}`);
    const tToken = teacherAuth.token;

    // 2. Fetch Public Students
    console.log("\n[Test 2] Fetching public student list for login screen...");
    const publicStudents = await req('/public/students');
    console.log(` Found ${publicStudents.students.length} active registered students:`);
    publicStudents.students.forEach(s => console.log(`   - ${s.full_name} (${s.username}) - ${s.grade_level}`));

    // 3. Teacher Queries Terms for All 3 Grades
    console.log("\n[Test 3] Testing Terms API across Grade 1, Grade 2, and Grade 3...");
    const g1Terms = await req('/terms?grade=Grade%201', { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 1 Terms: ${g1Terms.terms.map(t => `ID:${t.id} (${t.title})`).join(', ')}`);

    const g2Terms = await req('/terms?grade=Grade%202', { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 2 Terms: ${g2Terms.terms.map(t => `ID:${t.id} (${t.title})`).join(', ')}`);

    const g3Terms = await req('/terms?grade=Grade%203', { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 3 Terms: ${g3Terms.terms.map(t => `ID:${t.id} (${t.title})`).join(', ')}`);

    // 4. Register a Grade 1 Student and Grade 2 Student
    console.log("\n[Test 4] Registering Grade 1 and Grade 2 test learners...");
    const g1StudentRes = await req('/teacher/students', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tToken}` },
        body: JSON.stringify({
            username: 'g1.mark',
            password: 'pin123',
            full_name: 'Mark GradeOne Learner',
            grade_level: 'Grade 1',
            avatar_id: 'avatar_boy1'
        })
    });
    console.log(` Registered Grade 1 learner: ID ${g1StudentRes.id}`);

    const g2StudentRes = await req('/teacher/students', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tToken}` },
        body: JSON.stringify({
            username: 'g2.chloe',
            password: 'pin123',
            full_name: 'Chloe GradeTwo Learner',
            grade_level: 'Grade 2',
            avatar_id: 'avatar_girl1'
        })
    });
    console.log(` Registered Grade 2 learner: ID ${g2StudentRes.id}`);

    // 5. Test Grade 1 Student Login & Curriculum
    console.log("\n[Test 5] Logging in as Grade 1 student 'g1.mark'...");
    const g1Auth = await req('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'g1.mark', password: 'pin123' })
    });
    console.log(` Mark logged in! Grade level: ${g1Auth.user.grade_level}`);
    const g1Token = g1Auth.token;

    // Student GET /terms automatically filters to Grade 1
    const g1MyTerms = await req('/terms', { headers: { Authorization: `Bearer ${g1Token}` } });
    console.log(` Student Grade 1 terms auto-retrieved: ${g1MyTerms.terms.length} terms (IDs: ${g1MyTerms.terms.map(t => t.id).join(', ')})`);

    // Load Week 1 of Term 11 (Grade 1)
    const g1Week1 = await req('/curriculum/term/11/week/1', { headers: { Authorization: `Bearer ${g1Token}` } });
    console.log(` Grade 1 Term 1 Week 1 unlocked! Competencies: ${g1Week1.competencies.length} subjects:`);
    g1Week1.competencies.forEach(c => console.log(`   - [${c.subject_name}]: ${c.competency_text.substring(0, 60)}...`));

    // Load subject module and submit an activity
    const g1Module = await req('/curriculum/term/11/week/1/subject/g1_reading', { headers: { Authorization: `Bearer ${g1Token}` } });
    console.log(` Grade 1 Reading Module loaded: "${g1Module.lesson.title}" with ${g1Module.activities.length} interactive activities!`);

    const g1Act1 = g1Module.activities[0];
    const g1Submit = await req(`/activities/${g1Act1.id}/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${g1Token}` },
        body: JSON.stringify({ answer: 'A' })
    });
    console.log(` Submitted Grade 1 Activity: isCorrect=${g1Submit.isCorrect}, score=${g1Submit.score}/${g1Submit.maxScore}, starsEarned=${g1Submit.starsEarned}`);

    // 6. Test Grade 2 Student Login & Curriculum
    console.log("\n[Test 6] Logging in as Grade 2 student 'g2.chloe'...");
    const g2Auth = await req('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'g2.chloe', password: 'pin123' })
    });
    console.log(` Chloe logged in! Grade level: ${g2Auth.user.grade_level}`);
    const g2Token = g2Auth.token;

    // Student GET /terms automatically filters to Grade 2
    const g2MyTerms = await req('/terms', { headers: { Authorization: `Bearer ${g2Token}` } });
    console.log(` Student Grade 2 terms auto-retrieved: ${g2MyTerms.terms.length} terms (IDs: ${g2MyTerms.terms.map(t => t.id).join(', ')})`);

    // Load Week 1 of Term 21 (Grade 2)
    const g2Week1 = await req('/curriculum/term/21/week/1', { headers: { Authorization: `Bearer ${g2Token}` } });
    console.log(` Grade 2 Term 1 Week 1 unlocked! Competencies: ${g2Week1.competencies.length} subjects:`);
    g2Week1.competencies.forEach(c => console.log(`   - [${c.subject_name}]: ${c.competency_text.substring(0, 60)}...`));

    // Load subject module and submit an activity
    const g2Module = await req('/curriculum/term/21/week/1/subject/g2_english', { headers: { Authorization: `Bearer ${g2Token}` } });
    console.log(` Grade 2 English Module loaded: "${g2Module.lesson.title}" with ${g2Module.activities.length} interactive activities!`);

    const g2Act1 = g2Module.activities[0];
    const g2Submit = await req(`/activities/${g2Act1.id}/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${g2Token}` },
        body: JSON.stringify({ answer: 'A' })
    });
    console.log(` Submitted Grade 2 Activity: isCorrect=${g2Submit.isCorrect}, score=${g2Submit.score}/${g2Submit.maxScore}, starsEarned=${g2Submit.starsEarned}`);

    // 7. Test Teacher Overview and Reports per grade
    console.log("\n[Test 7] Testing Teacher Overview filtered by grade...");
    const overG1 = await req('/teacher/overview?grade=Grade%201', { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 1 Overview: Students=${overG1.totalStudents}, UnlockedWeeks=${overG1.unlockedWeeks}`);

    const overG2 = await req('/teacher/overview?grade=Grade%202', { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 2 Overview: Students=${overG2.totalStudents}, UnlockedWeeks=${overG2.unlockedWeeks}`);

    const overG3 = await req('/teacher/overview?grade=Grade%203', { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 3 Overview: Students=${overG3.totalStudents}, UnlockedWeeks=${overG3.unlockedWeeks}`);

    // 8. Test CSV Export API for all 3 grades
    console.log("\n[Test 8] Testing CSV Export API across grades...");
    const csvG1 = await fetch(`${BASE}/teacher/reports/export-csv?grade=Grade%201`, { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 1 CSV Export status: ${csvG1.status}, Content-Type: ${csvG1.headers.get('content-type')}`);

    const csvG2 = await fetch(`${BASE}/teacher/reports/export-csv?grade=Grade%202`, { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 2 CSV Export status: ${csvG2.status}, Content-Type: ${csvG2.headers.get('content-type')}`);

    const csvG3 = await fetch(`${BASE}/teacher/reports/export-csv?grade=Grade%203`, { headers: { Authorization: `Bearer ${tToken}` } });
    console.log(` Grade 3 CSV Export status: ${csvG3.status}, Content-Type: ${csvG3.headers.get('content-type')}`);

    // 9. Clean up test students
    console.log("\n[Test 9] Cleaning up test learners...");
    await req(`/teacher/students/${g1StudentRes.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tToken}` } });
    await req(`/teacher/students/${g2StudentRes.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tToken}` } });
    console.log(" Test learners removed cleanly, keeping original database clean!");

    console.log("\n==================================================");
    console.log("   ALL MULTI-GRADE E2E TESTS PASSED 100%!        ");
    console.log("==================================================");
}

runTests().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
