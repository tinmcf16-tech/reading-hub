const { db, initSchema } = require('./db');
const { generateModuleContent } = require('./content_generator');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

function seedDatabase() {
    initSchema();

    // Check if already seeded
    const termCount = db.prepare('SELECT COUNT(*) as count FROM terms').get();
    if (termCount.count > 0) {
        console.log("Database already has terms. Clearing for clean seed...");
        db.exec(`
            DELETE FROM user_badges;
            DELETE FROM user_stats;
            DELETE FROM student_submissions;
            DELETE FROM student_progress;
            DELETE FROM remediation_assignments;
            DELETE FROM activities;
            DELETE FROM lessons;
            DELETE FROM competencies;
            DELETE FROM weeks;
            DELETE FROM terms;
            DELETE FROM subjects;
            DELETE FROM users;
        `);
    }

    console.log("Seeding users...");
    const teacherHash = bcrypt.hashSync('teacher123', 10);
    const studentHash = bcrypt.hashSync('student123', 10);

    const insertUser = db.prepare(`
        INSERT INTO users (username, password_hash, full_name, role, grade_level, avatar_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const teacherRes = insertUser.run('teacher', teacherHash, 'Teacher Tin', 'teacher', 'Grade 3', 'avatar_teacher');
    const teacherId = teacherRes.lastInsertRowid;

    const students = [
        { username: 'juan.delacruz', name: 'Juan Dela Cruz', avatar: 'avatar_boy1' },
        { username: 'maria.santos', name: 'Maria Santos', avatar: 'avatar_girl1' },
        { username: 'gabriel.reyes', name: 'Gabriel Reyes', avatar: 'avatar_boy2' },
        { username: 'althea.mendoza', name: 'Althea Mendoza', avatar: 'avatar_girl2' },
        { username: 'mateo.garcia', name: 'Mateo Garcia', avatar: 'avatar_boy3' }
    ];

    const studentIds = [];
    students.forEach(s => {
        const res = insertUser.run(s.username, studentHash, s.name, 'student', 'Grade 3', s.avatar);
        studentIds.push(res.lastInsertRowid);
        
        // Initialize user stats
        db.prepare(`
            INSERT INTO user_stats (user_id, total_stars, current_streak, best_streak, last_active_date)
            VALUES (?, ?, ?, ?, DATE('now'))
        `).run(res.lastInsertRowid, 15, 3, 5);

        // Initial welcome badge
        db.prepare(`
            INSERT INTO user_badges (user_id, badge_id, title, description, icon)
            VALUES (?, ?, ?, ?, ?)
        `).run(res.lastInsertRowid, 'first_step', 'Learning Explorer', 'Started the Grade 3 Learning Journey!', '🌟');
    });

    console.log("Loading complete curriculum from complete_curriculum.json...");
    const curriculumPath = path.join(__dirname, 'complete_curriculum.json');
    const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));

    console.log("Seeding subjects...");
    const insertSubject = db.prepare(`
        INSERT INTO subjects (id, name, icon, color, bg_color, grade_level)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    curriculum.subjects.forEach(s => {
        insertSubject.run(s.id, s.name, s.icon, s.color, s.bg, s.grade_level);
    });

    console.log("Seeding terms, weeks, competencies, lessons, and activities...");
    const insertTerm = db.prepare(`
        INSERT INTO terms (id, term_number, title, theme, is_active, is_locked)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertWeek = db.prepare(`
        INSERT INTO weeks (term_id, week_number, title, is_unlocked)
        VALUES (?, ?, ?, ?)
    `);

    const insertComp = db.prepare(`
        INSERT INTO competencies (term_id, week_id, subject_id, competency_text, strand_domain)
        VALUES (?, ?, ?, ?, ?)
    `);

    const insertLesson = db.prepare(`
        INSERT INTO lessons (competency_id, day_number, title, explanation_learn, explore_story, explore_examples, illustrations)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertActivity = db.prepare(`
        INSERT INTO activities (competency_id, day_number, section_type, difficulty, activity_type, title, instructions, points, question_data, correct_answers)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let totalCompetencies = 0;
    let totalActivities = 0;

    curriculum.terms.forEach(t => {
        // Term 1 is active by default; Term 2 & 3 locked
        const isActive = t.term_number === 1 ? 1 : 0;
        const isLocked = t.term_number === 1 ? 0 : 1;
        insertTerm.run(t.term_number, t.term_number, t.title, t.theme, isActive, isLocked);

        t.weeks.forEach(w => {
            // For Term 1: Week 1 & 2 are unlocked by default, Week 3 to 11 are locked
            // Terms 2 and 3 weeks are all locked until teacher unlocks
            const isUnlocked = (t.term_number === 1 && (w.week_number === 1 || w.week_number === 2)) ? 1 : 0;
            const weekRes = insertWeek.run(t.term_number, w.week_number, w.title, isUnlocked);
            const weekId = weekRes.lastInsertRowid;

            w.subjects.forEach(s => {
                const compRes = insertComp.run(t.term_number, weekId, s.subject_id, s.competency, s.strand);
                const compId = compRes.lastInsertRowid;
                totalCompetencies++;

                // Generate rich content for this module
                const { lesson, activities } = generateModuleContent(
                    t.term_number,
                    w.week_number,
                    s.subject_id,
                    s.subject_name,
                    s.competency,
                    s.strand
                );

                insertLesson.run(
                    compId,
                    lesson.day_number,
                    lesson.title,
                    lesson.explanation_learn,
                    lesson.explore_story,
                    lesson.explore_examples,
                    lesson.illustrations
                );

                activities.forEach(act => {
                    insertActivity.run(
                        compId,
                        act.day_number,
                        act.section_type,
                        act.difficulty,
                        act.activity_type,
                        act.title,
                        act.instructions,
                        act.points,
                        JSON.stringify(act.question_data),
                        JSON.stringify(act.correct_answers)
                    );
                    totalActivities++;
                });
            });
        });
    });

    console.log(`Curriculum seeded successfully: 3 Terms, 33 Weeks, 6 Subjects, ${totalCompetencies} Competencies, ${totalActivities} Activities.`);

    // Seed some initial progress for student 1 (Juan Dela Cruz) in Week 1
    console.log("Seeding sample progress and submissions for demonstration...");
    const firstWeek = db.prepare('SELECT id FROM weeks WHERE term_id = 1 AND week_number = 1').get();
    const firstWeekId = firstWeek.id;
    const sampleStudentId = studentIds[0];

    const week1Activities = db.prepare(`
        SELECT a.id, a.points, a.correct_answers, c.subject_id, c.term_id, c.week_id, c.id as comp_id
        FROM activities a
        JOIN competencies c ON a.competency_id = c.id
        WHERE c.term_id = 1 AND c.week_id = ?
    `).all(firstWeekId);

    const insertSubmission = db.prepare(`
        INSERT INTO student_submissions (user_id, activity_id, answer_data, score, max_score, percentage, attempts, teacher_feedback)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Submit first 10 activities for Juan
    week1Activities.slice(0, 12).forEach(act => {
        insertSubmission.run(
            sampleStudentId,
            act.id,
            act.correct_answers,
            act.points,
            act.points,
            100.0,
            1,
            'Napakahusay, Juan! Patuloy na magbasa at matuto nang may sigla!'
        );
    });

    // Update student progress record for Week 1 subjects
    const subjectsList = ['english', 'filipino', 'gmrc', 'makabansa', 'math', 'science'];
    subjectsList.forEach((subId, idx) => {
        const completed = idx < 3 ? 5 : 2;
        const total = 5;
        const pct = (completed / total) * 100;
        const status = completed === 5 ? 'mastered' : 'in_progress';

        db.prepare(`
            INSERT INTO student_progress (user_id, term_id, week_id, subject_id, completed_activities, total_activities, score_sum, max_score_sum, percentage, status)
            VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(sampleStudentId, firstWeekId, subId, completed, total, completed * 10, total * 10, pct, status);
    });

    // Add a remediation alert for Student 3 (Gabriel Reyes) for demonstration
    const strugglingStudentId = studentIds[2];
    const mathComp = db.prepare("SELECT id FROM competencies WHERE term_id = 1 AND subject_id = 'math' LIMIT 1").get();
    if (mathComp) {
        db.prepare(`
            INSERT INTO remediation_assignments (user_id, competency_id, assigned_by, status, notes)
            VALUES (?, ?, ?, 'assigned', 'Needs additional step-by-step guidance on place value and regrouping.')
        `).run(strugglingStudentId, mathComp.id, teacherId);

        db.prepare(`
            INSERT INTO student_progress (user_id, term_id, week_id, subject_id, completed_activities, total_activities, score_sum, max_score_sum, percentage, status)
            VALUES (?, 1, ?, 'math', 2, 5, 12, 50, 24.0, 'needs_remediation')
        `).run(strugglingStudentId, firstWeekId);
    }

    console.log("Database seeded completely and ready for full operation!");
}

if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };
