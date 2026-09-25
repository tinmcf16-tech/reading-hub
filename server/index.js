const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'reading-hub-secret-key-2026';

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if (!token && req.query && req.query.token) {
        token = req.query.token;
    }
    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

function requireTeacher(req, res, next) {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ error: 'Teacher privileges required' });
    }
    next();
}

// --- Auth Routes ---
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const cleanUser = String(username).trim();
    const cleanPass = String(password).trim();

    const user = db.prepare('SELECT * FROM users WHERE LOWER(TRIM(username)) = LOWER(?)').get(cleanUser);
    if (!user || !bcrypt.compareSync(cleanPass, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, full_name: user.full_name, grade_level: user.grade_level },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Get user stats
    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(user.id) || {
        total_stars: 0,
        current_streak: 1,
        best_streak: 1
    };

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            grade_level: user.grade_level,
            avatar_id: user.avatar_id,
            stats
        }
    });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = db.prepare('SELECT id, username, full_name, role, grade_level, avatar_id FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(user.id) || {
        total_stars: 0,
        current_streak: 1,
        best_streak: 1
    };

    const badges = db.prepare('SELECT * FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC').all(user.id);

    res.json({ user: { ...user, stats, badges } });
});

// Helper to determine effective grade filter
function getEffectiveGrade(req) {
    if (req.query && req.query.grade) return req.query.grade;
    if (req.user && req.user.role === 'student') {
        const u = db.prepare('SELECT grade_level FROM users WHERE id = ?').get(req.user.id);
        return u?.grade_level || 'Grade 3';
    }
    return null;
}

// Public list of active students for opening login portal
app.get('/api/public/students', (req, res) => {
    const grade = req.query.grade;
    let query = `
        SELECT id, username, full_name, avatar_id, grade_level
        FROM users
        WHERE role = 'student'
    `;
    let params = [];
    if (grade) {
        query += ' AND grade_level = ?';
        params.push(grade);
    }
    query += ' ORDER BY full_name ASC';
    const students = db.prepare(query).all(...params);
    res.json({ students });
});

// --- Curriculum & Access Control Routes ---
// Get terms (filtered by grade if student or requested)
app.get('/api/terms', authenticateToken, (req, res) => {
    const grade = getEffectiveGrade(req);
    let query = 'SELECT * FROM terms';
    let params = [];
    if (grade) {
        query += ' WHERE grade_level = ?';
        params.push(grade);
    }
    query += ' ORDER BY term_number ASC';
    const terms = db.prepare(query).all(...params);
    res.json({ terms });
});

// Get all 11 weeks for a specific term
app.get('/api/terms/:termId/weeks', authenticateToken, (req, res) => {
    const termId = parseInt(req.params.termId);
    const weeks = db.prepare('SELECT * FROM weeks WHERE term_id = ? ORDER BY week_number ASC').all(termId);
    res.json({ weeks });
});

// Get all subjects (filtered by grade if student or requested)
app.get('/api/subjects', authenticateToken, (req, res) => {
    const grade = getEffectiveGrade(req);
    let query = 'SELECT * FROM subjects';
    let params = [];
    if (grade) {
        query += ' WHERE grade_level = ?';
        params.push(grade);
    }
    query += ' ORDER BY id ASC';
    const subjects = db.prepare(query).all(...params);
    res.json({ subjects });
});

// Get entire learning week (Enforces backend lock check)
app.get('/api/curriculum/term/:termId/week/:weekNum', authenticateToken, (req, res) => {
    const termId = parseInt(req.params.termId);
    const weekNum = parseInt(req.params.weekNum);

    const week = db.prepare('SELECT * FROM weeks WHERE term_id = ? AND week_number = ?').get(termId, weekNum);
    if (!week) return res.status(404).json({ error: 'Week not found' });

    // Enforce lock check for students
    if (req.user.role === 'student' && !week.is_unlocked) {
        return res.status(403).json({
            error: `Term ${termId} - Week ${weekNum} is currently locked by your teacher. Please complete previous weeks or wait for your teacher to unlock this week!`
        });
    }

    const competencies = db.prepare(`
        SELECT c.*, s.name as subject_name, s.icon as subject_icon, s.color as subject_color, s.bg_color as subject_bg
        FROM competencies c
        JOIN subjects s ON c.subject_id = s.id
        WHERE c.term_id = ? AND c.week_id = ?
        ORDER BY s.id ASC
    `).all(termId, week.id);

    // Fetch student's progress for this week if student
    let progressMap = {};
    if (req.user.role === 'student') {
        const progressList = db.prepare(`
            SELECT * FROM student_progress WHERE user_id = ? AND week_id = ?
        `).all(req.user.id, week.id);
        progressList.forEach(p => progressMap[p.subject_id] = p);
    }

    res.json({
        week,
        competencies: competencies.map(c => ({
            ...c,
            progress: progressMap[c.subject_id] || {
                completed_activities: 0,
                total_activities: 5,
                percentage: 0,
                status: 'not_started'
            }
        }))
    });
});

// Get specific subject module within a week (8 components: Competency, Learn, Explore, Practice, Play, Challenge, Know, Result)
app.get('/api/curriculum/term/:termId/week/:weekNum/subject/:subjectId', authenticateToken, (req, res) => {
    const termId = parseInt(req.params.termId);
    const weekNum = parseInt(req.params.weekNum);
    const subjectId = req.params.subjectId;

    const week = db.prepare('SELECT * FROM weeks WHERE term_id = ? AND week_number = ?').get(termId, weekNum);
    if (!week) return res.status(404).json({ error: 'Week not found' });

    // Enforce backend week lock
    if (req.user.role === 'student' && !week.is_unlocked) {
        return res.status(403).json({
            error: `This week is locked by your teacher.`
        });
    }

    const competency = db.prepare(`
        SELECT c.*, s.name as subject_name, s.icon as subject_icon, s.color as subject_color, s.bg_color as subject_bg
        FROM competencies c
        JOIN subjects s ON c.subject_id = s.id
        WHERE c.term_id = ? AND c.week_id = ? AND c.subject_id = ?
    `).get(termId, week.id, subjectId);

    if (!competency) return res.status(404).json({ error: 'Competency module not found' });

    const lesson = db.prepare('SELECT * FROM lessons WHERE competency_id = ? LIMIT 1').get(competency.id);
    const activities = db.prepare('SELECT * FROM activities WHERE competency_id = ? ORDER BY day_number ASC, id ASC').all(competency.id);

    // Parse JSON fields
    if (lesson) {
        try {
            lesson.explore_examples = JSON.parse(lesson.explore_examples || '[]');
            lesson.illustrations = JSON.parse(lesson.illustrations || '[]');
        } catch (e) {}
    }

    const activitiesParsed = activities.map(act => {
        let qData = act.question_data;
        let cAns = act.correct_answers;
        try { qData = JSON.parse(act.question_data); } catch (e) {}
        try { cAns = JSON.parse(act.correct_answers); } catch (e) {}

        // If student, do not reveal correct answers before submission!
        if (req.user.role === 'student') {
            return {
                ...act,
                question_data: qData,
                correct_answers: undefined
            };
        }
        return { ...act, question_data: qData, correct_answers: cAns };
    });

    // Check student's recent submissions & progress for this subject
    let myResult = null;
    if (req.user.role === 'student') {
        const progress = db.prepare(`
            SELECT * FROM student_progress WHERE user_id = ? AND week_id = ? AND subject_id = ?
        `).get(req.user.id, week.id, subjectId);

        const submissions = db.prepare(`
            SELECT s.*, a.title as activity_title, a.section_type, a.points
            FROM student_submissions s
            JOIN activities a ON s.activity_id = a.id
            WHERE s.user_id = ? AND a.competency_id = ?
            ORDER BY s.completed_at DESC
        `).all(req.user.id, competency.id);

        myResult = {
            progress: progress || { completed_activities: 0, total_activities: activities.length, percentage: 0, status: 'not_started' },
            submissions: submissions.map(s => {
                let ans = s.answer_data;
                try { ans = JSON.parse(s.answer_data); } catch (e) {}
                return { ...s, answer_data: ans };
            })
        };
    }

    res.json({
        week,
        competency,
        lesson,
        activities: activitiesParsed,
        myResult
    });
});

// --- Activity Submission & Grading ---
app.post('/api/activities/:activityId/submit', authenticateToken, (req, res) => {
    const activityId = parseInt(req.params.activityId);
    const { answer } = req.body;
    const userId = req.user.id;

    const activity = db.prepare(`
        SELECT a.*, c.term_id, c.week_id, c.subject_id, w.is_unlocked
        FROM activities a
        JOIN competencies c ON a.competency_id = c.id
        JOIN weeks w ON c.week_id = w.id
        WHERE a.id = ?
    `).get(activityId);

    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    // Check week access
    if (req.user.role === 'student' && !activity.is_unlocked) {
        return res.status(403).json({ error: 'Cannot submit to a locked week.' });
    }

    let correctAnswers = {};
    try { correctAnswers = JSON.parse(activity.correct_answers); } catch (e) {}

    // Evaluate answer
    let isCorrect = false;
    let score = 0;
    let feedback = '';

    if (activity.activity_type === 'multiple_choice' || activity.activity_type === 'true_false') {
        if (typeof answer === 'string' && typeof correctAnswers.answer === 'string') {
            isCorrect = answer.trim().toUpperCase() === correctAnswers.answer.trim().toUpperCase();
        } else {
            isCorrect = String(answer).toLowerCase() === String(correctAnswers.answer).toLowerCase();
        }
        score = isCorrect ? activity.points : Math.round(activity.points * 0.3);
    } else if (activity.activity_type === 'mini_game') {
        // Star match or pairs
        score = activity.points;
        isCorrect = true;
    } else if (activity.activity_type === 'assessment') {
        // Multi-question assessment
        let totalQ = Object.keys(correctAnswers).length;
        let rightQ = 0;
        for (const [k, v] of Object.entries(correctAnswers)) {
            if (answer && answer[k] && String(answer[k]).trim().toUpperCase() === String(v).trim().toUpperCase()) {
                rightQ++;
            }
        }
        score = totalQ > 0 ? Math.round((rightQ / totalQ) * activity.points) : activity.points;
        isCorrect = score >= Math.round(activity.points * 0.7);
    }

    const percentage = Math.round((score / activity.points) * 100);

    if (percentage === 100) {
        feedback = 'ðŸŒŸ Napakahusay! Perfect score! Nakuha mo ang lahat ng tamang sagot!';
    } else if (percentage >= 75) {
        feedback = 'ðŸ‘ Magaling! Naipamalas mo ang magandang pag-unawa sa aralin!';
    } else {
        feedback = 'ðŸ’¡ Magandang simula! Magpatuloy sa pagsasanay, kaya mo yan!';
    }

    // Insert or update submission
    const existingSub = db.prepare('SELECT * FROM student_submissions WHERE user_id = ? AND activity_id = ?').get(userId, activityId);
    let attempts = 1;
    if (existingSub) {
        attempts = existingSub.attempts + 1;
        db.prepare(`
            UPDATE student_submissions
            SET answer_data = ?, score = ?, max_score = ?, percentage = ?, attempts = ?, teacher_feedback = ?, completed_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(JSON.stringify(answer), score, activity.points, percentage, attempts, feedback, existingSub.id);
    } else {
        db.prepare(`
            INSERT INTO student_submissions (user_id, activity_id, answer_data, score, max_score, percentage, attempts, teacher_feedback)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(userId, activityId, JSON.stringify(answer), score, activity.points, percentage, 1, feedback);
    }

    // Update student progress for this subject & week
    const allActivities = db.prepare('SELECT id, points FROM activities WHERE competency_id = ?').all(activity.competency_id);
    const submissions = db.prepare(`
        SELECT s.score, s.max_score, s.percentage
        FROM student_submissions s
        JOIN activities a ON s.activity_id = a.id
        WHERE s.user_id = ? AND a.competency_id = ?
    `).all(userId, activity.competency_id);

    const completedCount = submissions.length;
    const totalCount = allActivities.length;
    let scoreSum = 0;
    let maxScoreSum = 0;
    submissions.forEach(s => {
        scoreSum += s.score;
        maxScoreSum += s.max_score;
    });
    const avgPct = maxScoreSum > 0 ? Math.round((scoreSum / maxScoreSum) * 100) : 0;
    let status = 'in_progress';
    if (completedCount >= totalCount) {
        status = avgPct >= 75 ? 'mastered' : 'needs_remediation';
    }

    // Upsert student progress
    const existingProg = db.prepare(`
        SELECT id FROM student_progress WHERE user_id = ? AND week_id = ? AND subject_id = ?
    `).get(userId, activity.week_id, activity.subject_id);

    if (existingProg) {
        db.prepare(`
            UPDATE student_progress
            SET completed_activities = ?, total_activities = ?, score_sum = ?, max_score_sum = ?, percentage = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(completedCount, totalCount, scoreSum, maxScoreSum, avgPct, status, existingProg.id);
    } else {
        db.prepare(`
            INSERT INTO student_progress (user_id, term_id, week_id, subject_id, completed_activities, total_activities, score_sum, max_score_sum, percentage, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(userId, activity.term_id, activity.week_id, activity.subject_id, completedCount, totalCount, scoreSum, maxScoreSum, avgPct, status);
    }

    // Award stars and update user stats
    const starsEarned = Math.max(1, Math.round(score / 5));
    db.prepare(`
        UPDATE user_stats
        SET total_stars = total_stars + ?, last_active_date = DATE('now')
        WHERE user_id = ?
    `).run(starsEarned, userId);

    // Check for milestone badges
    let newBadge = null;
    const totalCompleted = db.prepare('SELECT COUNT(*) as count FROM student_submissions WHERE user_id = ?').get(userId).count;
    if (totalCompleted === 5) {
        const hasBadge = db.prepare('SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ?').get(userId, 'streak_5');
        if (!hasBadge) {
            db.prepare('INSERT INTO user_badges (user_id, badge_id, title, description, icon) VALUES (?, ?, ?, ?, ?)').run(userId, 'streak_5', 'High Five Scholar', 'Completed 5 learning activities!', '✋');
            newBadge = { title: "High Five Scholar", icon: "✋" };
        }
    } else if (totalCompleted === 10) {
        const hasBadge = db.prepare('SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ?').get(userId, 'master_10');
        if (!hasBadge) {
            db.prepare('INSERT INTO user_badges (user_id, badge_id, title, description, icon) VALUES (?, ?, ?, ?, ?)').run(userId, 'master_10', 'Super Reader', 'Completed 10 interactive activities!', '🚀');
            newBadge = { title: "Super Reader", icon: "🚀" };
        }
    }

    res.json({
        isCorrect,
        score,
        maxScore: activity.points,
        percentage,
        feedback,
        starsEarned,
        newBadge,
        status
    });
});

// --- Student Overall Dashboard Details ---
app.get('/api/student/dashboard-summary', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const userRow = db.prepare('SELECT grade_level FROM users WHERE id = ?').get(userId);
    const grade = userRow?.grade_level || 'Grade 3';

    // Terms overview filtered by student's grade
    const terms = db.prepare('SELECT * FROM terms WHERE grade_level = ? ORDER BY term_number ASC').all(grade);
    const termIds = terms.map(t => t.id);
    let weeks = [];
    if (termIds.length > 0) {
        weeks = db.prepare(`SELECT * FROM weeks WHERE term_id IN (${termIds.map(() => '?').join(',')}) ORDER BY term_id ASC, week_number ASC`).all(...termIds);
    }

    // Student's progress list
    const progressList = db.prepare('SELECT * FROM student_progress WHERE user_id = ?').all(userId);

    // Student stats and badges
    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(userId) || { total_stars: 0, current_streak: 1 };
    const badges = db.prepare('SELECT * FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC').all(userId);

    // Recent submissions
    const recentSubmissions = db.prepare(`
        SELECT s.*, a.title as activity_title, c.subject_id, w.week_number, c.term_id
        FROM student_submissions s
        JOIN activities a ON s.activity_id = a.id
        JOIN competencies c ON a.competency_id = c.id
        JOIN weeks w ON c.week_id = w.id
        WHERE s.user_id = ?
        ORDER BY s.completed_at DESC
        LIMIT 5
    `).all(userId);

    res.json({
        terms,
        weeks,
        progressList,
        stats,
        badges,
        recentSubmissions
    });
});

// --- Teacher Management & Control Routes ---
// Toggle week lock / unlock (ENFORCED AT DATABASE LEVEL)
app.post('/api/teacher/weeks/:weekId/toggle', authenticateToken, requireTeacher, (req, res) => {
    const weekId = parseInt(req.params.weekId);
    const week = db.prepare('SELECT * FROM weeks WHERE id = ?').get(weekId);
    if (!week) return res.status(404).json({ error: 'Week not found' });

    const newStatus = week.is_unlocked ? 0 : 1;
    db.prepare('UPDATE weeks SET is_unlocked = ? WHERE id = ?').run(newStatus, weekId);

    res.json({
        success: true,
        weekId,
        is_unlocked: newStatus,
        message: newStatus ? `Term ${week.term_id} - Week ${week.week_number} has been UNLOCKED for all students.` : `Term ${week.term_id} - Week ${week.week_number} has been LOCKED.`
    });
});

// Toggle term lock / unlock
app.post('/api/teacher/terms/:termId/toggle', authenticateToken, requireTeacher, (req, res) => {
    const termId = parseInt(req.params.termId);
    const term = db.prepare('SELECT * FROM terms WHERE id = ?').get(termId);
    if (!term) return res.status(404).json({ error: 'Term not found' });

    const newLock = term.is_locked ? 0 : 1;
    db.prepare('UPDATE terms SET is_locked = ? WHERE id = ?').run(newLock, termId);

    res.json({ success: true, termId, is_locked: newLock });
});

// Class Overview (Supports ?grade=Grade+1, Grade+2, Grade+3)
app.get('/api/teacher/overview', authenticateToken, requireTeacher, (req, res) => {
    const grade = req.query.grade; // optional 'Grade 1', 'Grade 2', 'Grade 3'
    let studentWhere = "WHERE role = 'student'";
    let weekWhere = "WHERE is_unlocked = 1";
    let subWhere = "";
    let params = [];

    if (grade) {
        studentWhere += " AND grade_level = ?";
        weekWhere += " AND grade_level = ?";
        subWhere = " WHERE u.grade_level = ?";
        params.push(grade);
    }

    const totalStudents = db.prepare(`SELECT COUNT(*) as count FROM users ${studentWhere}`).get(...(grade ? [grade] : [])).count;
    const unlockedWeeks = db.prepare(`SELECT COUNT(*) as count FROM weeks ${weekWhere}`).get(...(grade ? [grade] : [])).count;
    const totalSubmissions = db.prepare(`
        SELECT COUNT(s.id) as count
        FROM student_submissions s
        JOIN users u ON s.user_id = u.id
        ${subWhere}
    `).get(...(grade ? [grade] : [])).count;

    // Student performance summary
    let studentQuery = `
        SELECT u.id, u.full_name, u.username, u.avatar_id, u.grade_level, s.total_stars, s.current_streak,
            (SELECT COUNT(*) FROM student_submissions WHERE user_id = u.id) as completed_activities,
            (SELECT ROUND(AVG(percentage), 1) FROM student_submissions WHERE user_id = u.id) as avg_score
        FROM users u
        LEFT JOIN user_stats s ON u.id = s.user_id
        ${studentWhere}
        ORDER BY u.full_name ASC
    `;
    const students = db.prepare(studentQuery).all(...(grade ? [grade] : []));

    // Subject averages
    let subStatQuery = `
        SELECT s.id, s.name, s.icon, s.color, s.grade_level,
            ROUND(AVG(sp.percentage), 1) as avg_mastery,
            SUM(sp.completed_activities) as total_completed
        FROM subjects s
        LEFT JOIN student_progress sp ON s.id = sp.subject_id
    `;
    if (grade) {
        subStatQuery += ` WHERE s.grade_level = ?`;
    }
    subStatQuery += ` GROUP BY s.id ORDER BY s.id ASC`;
    const subjectStats = db.prepare(subStatQuery).all(...(grade ? [grade] : []));

    // Remediation count
    let remQuery = `
        SELECT COUNT(r.id) as count
        FROM remediation_assignments r
        JOIN users u ON r.user_id = u.id
        WHERE r.status = 'assigned'
    `;
    if (grade) {
        remQuery += ` AND u.grade_level = ?`;
    }
    const remediationCount = db.prepare(remQuery).get(...(grade ? [grade] : [])).count;

    res.json({
        totalStudents,
        unlockedWeeks,
        totalSubmissions,
        remediationCount,
        students,
        subjectStats
    });
});

// Student Management (CRUD)
app.get('/api/teacher/students', authenticateToken, requireTeacher, (req, res) => {
    const grade = req.query.grade;
    let query = `
        SELECT u.id, u.username, u.full_name, u.grade_level, u.avatar_id, u.created_at,
               s.total_stars, s.current_streak, s.best_streak,
               (SELECT COUNT(*) FROM student_submissions WHERE user_id = u.id) as completed_activities,
               (SELECT ROUND(AVG(percentage), 1) FROM student_submissions WHERE user_id = u.id) as avg_score
        FROM users u
        LEFT JOIN user_stats s ON u.id = s.user_id
        WHERE u.role = 'student'
    `;
    let params = [];
    if (grade) {
        query += " AND u.grade_level = ?";
        params.push(grade);
    }
    query += " ORDER BY u.full_name ASC";
    const students = db.prepare(query).all(...params);
    res.json({ students });
});

app.post('/api/teacher/students', authenticateToken, requireTeacher, (req, res) => {
    const { username, password, full_name, avatar_id, grade_level } = req.body;
    if (!username || !password || !full_name) {
        return res.status(400).json({ error: 'Username, password, and full name required' });
    }

    const assignedGrade = grade_level || 'Grade 3';
    const hash = bcrypt.hashSync(password, 10);
    try {
        const result = db.prepare(`
            INSERT INTO users (username, password_hash, full_name, role, grade_level, avatar_id)
            VALUES (?, ?, ?, 'student', ?, ?)
        `).run(username.trim().toLowerCase(), hash, full_name.trim(), assignedGrade, avatar_id || 'avatar_boy1');

        db.prepare(`
            INSERT INTO user_stats (user_id, total_stars, current_streak, best_streak)
            VALUES (?, 0, 1, 1)
        `).run(result.lastInsertRowid);

        res.json({ success: true, id: result.lastInsertRowid, message: 'Student registered successfully' });
    } catch (e) {
        res.status(400).json({ error: 'Username already exists or invalid data' });
    }
});

// Delete Student (Cascade delete all progress, submissions, badges, stats)
app.delete('/api/teacher/students/:id', authenticateToken, requireTeacher, (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = db.prepare("SELECT id, username, full_name FROM users WHERE id = ? AND role = 'student'").get(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    try {
        db.prepare('DELETE FROM student_submissions WHERE user_id = ?').run(studentId);
        db.prepare('DELETE FROM student_progress WHERE user_id = ?').run(studentId);
        db.prepare('DELETE FROM remediation_assignments WHERE user_id = ?').run(studentId);
        db.prepare('DELETE FROM user_stats WHERE user_id = ?').run(studentId);
        db.prepare('DELETE FROM user_badges WHERE user_id = ?').run(studentId);
        db.prepare('DELETE FROM users WHERE id = ?').run(studentId);

        res.json({ success: true, message: `Student "${student.full_name}" deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete student: ' + err.message });
    }
});

// Update Student Password / PIN
app.put('/api/teacher/students/:id/password', authenticateToken, requireTeacher, (req, res) => {
    const studentId = parseInt(req.params.id);
    const { password } = req.body;
    if (!password || String(password).trim().length < 3) {
        return res.status(400).json({ error: 'Password/PIN must be at least 3 characters' });
    }

    const student = db.prepare("SELECT id, username, full_name FROM users WHERE id = ? AND role = 'student'").get(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const newHash = bcrypt.hashSync(String(password).trim(), 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, studentId);

    res.json({ success: true, message: `Password for "${student.full_name}" has been updated.` });
});

// Individual Student Drill-down (Complete 33-week profile)
app.get('/api/teacher/students/:id/details', authenticateToken, requireTeacher, (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = db.prepare("SELECT id, username, full_name, grade_level, avatar_id, created_at FROM users WHERE id = ? AND role = 'student'").get(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(studentId);
    const badges = db.prepare('SELECT * FROM user_badges WHERE user_id = ?').all(studentId);
    const progress = db.prepare(`
        SELECT sp.*, w.week_number, w.title as week_title, s.name as subject_name, s.color as subject_color
        FROM student_progress sp
        JOIN weeks w ON sp.week_id = w.id
        JOIN subjects s ON sp.subject_id = s.id
        WHERE sp.user_id = ?
        ORDER BY sp.term_id ASC, w.week_number ASC
    `).all(studentId);

    const submissions = db.prepare(`
        SELECT sub.*, act.title as activity_title, act.section_type, act.difficulty, c.subject_id, w.week_number, c.term_id
        FROM student_submissions sub
        JOIN activities act ON sub.activity_id = act.id
        JOIN competencies c ON act.competency_id = c.id
        JOIN weeks w ON c.week_id = w.id
        WHERE sub.user_id = ?
        ORDER BY sub.completed_at DESC
    `).all(studentId);

    const remediation = db.prepare(`
        SELECT r.*, c.competency_text, s.name as subject_name
        FROM remediation_assignments r
        JOIN competencies c ON r.competency_id = c.id
        JOIN subjects s ON c.subject_id = s.id
        WHERE r.user_id = ?
    `).all(studentId);

    res.json({
        student,
        stats,
        badges,
        progress,
        submissions,
        remediation
    });
});

// Remediation List & Assign
app.get('/api/teacher/remediation', authenticateToken, requireTeacher, (req, res) => {
    // 1. Existing assignments
    const assignments = db.prepare(`
        SELECT r.*, u.full_name as student_name, c.competency_text, s.name as subject_name, s.color as subject_color, w.week_number, c.term_id
        FROM remediation_assignments r
        JOIN users u ON r.user_id = u.id
        JOIN competencies c ON r.competency_id = c.id
        JOIN subjects s ON c.subject_id = s.id
        JOIN weeks w ON c.week_id = w.id
        ORDER BY r.created_at DESC
    `).all();

    // 2. Automatically detected students struggling (< 75% score or status = 'needs_remediation')
    const strugglingStudents = db.prepare(`
        SELECT sp.*, u.full_name as student_name, s.name as subject_name, s.color as subject_color, c.competency_text, w.week_number
        FROM student_progress sp
        JOIN users u ON sp.user_id = u.id
        JOIN subjects s ON sp.subject_id = s.id
        JOIN weeks w ON sp.week_id = w.id
        JOIN competencies c ON c.week_id = sp.week_id AND c.subject_id = sp.subject_id
        WHERE sp.percentage < 75 AND sp.completed_activities > 0
        ORDER BY sp.percentage ASC
    `).all();

    res.json({ assignments, strugglingStudents });
});

app.post('/api/teacher/remediation/assign', authenticateToken, requireTeacher, (req, res) => {
    const { user_id, competency_id, notes } = req.body;
    if (!user_id || !competency_id) {
        return res.status(400).json({ error: 'User ID and Competency ID required' });
    }

    db.prepare(`
        INSERT INTO remediation_assignments (user_id, competency_id, assigned_by, status, notes)
        VALUES (?, ?, ?, 'assigned', ?)
    `).run(user_id, competency_id, req.user.id, notes || 'Assigned tailored practice exercises.');

    res.json({ success: true, message: 'Remediation assigned successfully' });
});

app.post('/api/teacher/remediation/:id/resolve', authenticateToken, requireTeacher, (req, res) => {
    const remId = parseInt(req.params.id);
    db.prepare('UPDATE remediation_assignments SET status = "completed" WHERE id = ?').run(remId);
    res.json({ success: true, message: 'Remediation marked as completed' });
});

// Term & Full School-Year Reports
app.get('/api/teacher/reports/term/:termId', authenticateToken, requireTeacher, (req, res) => {
    const termId = parseInt(req.params.termId);
    const term = db.prepare('SELECT * FROM terms WHERE id = ?').get(termId);
    if (!term) return res.status(404).json({ error: 'Term not found' });

    const grade = term.grade_level || 'Grade 3';
    const students = db.prepare("SELECT id, full_name, username, grade_level FROM users WHERE role = 'student' AND grade_level = ? ORDER BY full_name ASC").all(grade);
    const subjects = db.prepare('SELECT * FROM subjects WHERE grade_level = ? ORDER BY id ASC').all(grade);

    const reportData = students.map(st => {
        const studentProgress = db.prepare(`
            SELECT subject_id, ROUND(AVG(percentage), 1) as avg_pct, SUM(completed_activities) as completed
            FROM student_progress
            WHERE user_id = ? AND term_id = ?
            GROUP BY subject_id
        `).all(st.id, termId);

        const subjectScores = {};
        subjects.forEach(s => subjectScores[s.id] = 0);
        let totalScore = 0;
        let count = 0;

        studentProgress.forEach(p => {
            subjectScores[p.subject_id] = p.avg_pct;
            totalScore += p.avg_pct;
            count++;
        });

        const overallTermAvg = count > 0 ? Math.round(totalScore / count) : 0;
        const masteredCompetencies = db.prepare(`
            SELECT COUNT(*) as count FROM student_progress
            WHERE user_id = ? AND term_id = ? AND percentage >= 75
        `).get(st.id, termId).count;

        const needingRemediation = db.prepare(`
            SELECT COUNT(*) as count FROM student_progress
            WHERE user_id = ? AND term_id = ? AND percentage < 75 AND completed_activities > 0
        `).get(st.id, termId).count;

        return {
            student: st,
            subjectScores,
            overallTermAvg,
            masteredCompetencies,
            needingRemediation
        };
    });

    res.json({
        term,
        subjects,
        reportData
    });
});

// Complete School-Year Report (Supports ?grade=Grade+1, Grade+2, Grade+3)
app.get('/api/teacher/reports/school-year', authenticateToken, requireTeacher, (req, res) => {
    const grade = req.query.grade || 'Grade 3';
    const students = db.prepare("SELECT id, full_name, username, grade_level FROM users WHERE role = 'student' AND grade_level = ? ORDER BY full_name ASC").all(grade);
    const subjects = db.prepare('SELECT * FROM subjects WHERE grade_level = ? ORDER BY id ASC').all(grade);

    let t1Id = 1, t2Id = 2, t3Id = 3;
    if (grade === 'Grade 1') { t1Id = 11; t2Id = 12; t3Id = 13; }
    else if (grade === 'Grade 2') { t1Id = 21; t2Id = 22; t3Id = 23; }

    const fullYearData = students.map(st => {
        // Scores per term
        const t1 = db.prepare('SELECT ROUND(AVG(percentage), 1) as avg FROM student_progress WHERE user_id = ? AND term_id = ?').get(st.id, t1Id)?.avg || 0;
        const t2 = db.prepare('SELECT ROUND(AVG(percentage), 1) as avg FROM student_progress WHERE user_id = ? AND term_id = ?').get(st.id, t2Id)?.avg || 0;
        const t3 = db.prepare('SELECT ROUND(AVG(percentage), 1) as avg FROM student_progress WHERE user_id = ? AND term_id = ?').get(st.id, t3Id)?.avg || 0;

        // Subject averages across the whole school year
        const subjectYearAverages = {};
        subjects.forEach(s => {
            const avg = db.prepare('SELECT ROUND(AVG(percentage), 1) as avg FROM student_progress WHERE user_id = ? AND subject_id = ?').get(st.id, s.id)?.avg || 0;
            subjectYearAverages[s.id] = avg;
        });

        const generalAverage = Math.round((t1 + t2 + t3) / 3) || Math.round(t1);

        const totalMastered = db.prepare('SELECT COUNT(*) as count FROM student_progress WHERE user_id = ? AND percentage >= 75').get(st.id).count;
        const totalRemediation = db.prepare('SELECT COUNT(*) as count FROM student_progress WHERE user_id = ? AND percentage < 75 AND completed_activities > 0').get(st.id).count;
        const stars = db.prepare('SELECT total_stars FROM user_stats WHERE user_id = ?').get(st.id)?.total_stars || 0;

        return {
            student: st,
            t1_average: t1,
            t2_average: t2,
            t3_average: t3,
            general_average: generalAverage,
            subjectYearAverages,
            totalMastered,
            totalRemediation,
            stars
        };
    });

    res.json({
        school_year: '2026-2027',
        grade_level: grade,
        class_section: grade === 'Grade 3' ? 'Section Masinadyahon' : 'Multi-Grade Section',
        school: 'San Vicente Elementary School',
        subjects,
        fullYearData
    });
});

// CSV Export for school records (Supports ?grade=Grade+1, Grade+2, Grade+3)
app.get('/api/teacher/reports/export-csv', authenticateToken, requireTeacher, (req, res) => {
    const grade = req.query.grade || 'Grade 3';
    const students = db.prepare("SELECT id, full_name, username, grade_level FROM users WHERE role = 'student' AND grade_level = ? ORDER BY full_name ASC").all(grade);
    const subjects = db.prepare('SELECT * FROM subjects WHERE grade_level = ? ORDER BY id ASC').all(grade);

    let t1Id = 1, t2Id = 2, t3Id = 3;
    if (grade === 'Grade 1') { t1Id = 11; t2Id = 12; t3Id = 13; }
    else if (grade === 'Grade 2') { t1Id = 21; t2Id = 22; t3Id = 23; }

    const subHeaders = subjects.map(s => s.name).join(',');
    let csv = `Student ID,Learner Name,Grade Level,Term 1 Average,Term 2 Average,Term 3 Average,Final General Average,${subHeaders},Competencies Mastered,Needs Remediation\n`;

    students.forEach(st => {
        const t1 = db.prepare('SELECT ROUND(AVG(percentage), 1) as avg FROM student_progress WHERE user_id = ? AND term_id = ?').get(st.id, t1Id)?.avg || 0;
        const t2 = db.prepare('SELECT ROUND(AVG(percentage), 1) as avg FROM student_progress WHERE user_id = ? AND term_id = ?').get(st.id, t2Id)?.avg || 0;
        const t3 = db.prepare('SELECT ROUND(AVG(percentage), 1) as avg FROM student_progress WHERE user_id = ? AND term_id = ?').get(st.id, t3Id)?.avg || 0;
        const finalAvg = Math.round((t1 + t2 + t3) / 3) || Math.round(t1);

        const subScores = subjects.map(s => {
            return db.prepare('SELECT ROUND(AVG(percentage), 1) as avg FROM student_progress WHERE user_id = ? AND subject_id = ?').get(st.id, s.id)?.avg || 0;
        });

        const mastered = db.prepare('SELECT COUNT(*) as count FROM student_progress WHERE user_id = ? AND percentage >= 75').get(st.id).count;
        const rem = db.prepare('SELECT COUNT(*) as count FROM student_progress WHERE user_id = ? AND percentage < 75 AND completed_activities > 0').get(st.id).count;

        csv += `"${st.username}","${st.full_name}","${st.grade_level}",${t1},${t2},${t3},${finalAvg},${subScores.join(',')},${mastered},${rem}\n`;
    });

    const fileSafeGrade = grade.replace(/\s+/g, '');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileSafeGrade}_SY2026-2027_Consolidated_Report.csv"`);
    res.send(csv);
});

// Static files for production React client
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            return res.sendFile(path.join(clientDist, 'index.html'));
        }
        next();
    });
}

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Reading HUB Backend Server is running on http://localhost:${PORT}`);
    console.log(`Network access (Same Wi-Fi): http://192.168.1.6:${PORT}`);
});

