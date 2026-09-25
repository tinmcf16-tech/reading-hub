const { db, initSchema } = require('./db');
const { generateModuleContent } = require('./content_generator');
const fs = require('fs');
const path = require('path');

async function seedMultiGrade() {
    console.log("=== Initializing Schema & Ensuring Multi-Grade Columns ===");
    initSchema();

    // Check & add columns if missing
    function ensureColumn(table, column, definition) {
        const info = db.prepare(`PRAGMA table_info(${table})`).all();
        const hasCol = info.some(c => c.name === column);
        if (!hasCol) {
            console.log(`Adding column ${column} to table ${table}...`);
            db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        }
    }

    ensureColumn('terms', 'grade_level', "TEXT DEFAULT 'Grade 3'");
    ensureColumn('weeks', 'grade_level', "TEXT DEFAULT 'Grade 3'");
    ensureColumn('competencies', 'grade_level', "TEXT DEFAULT 'Grade 3'");

    // Update existing terms/weeks/competencies to Grade 3
    db.prepare("UPDATE terms SET grade_level = 'Grade 3' WHERE grade_level IS NULL").run();
    db.prepare("UPDATE weeks SET grade_level = 'Grade 3' WHERE grade_level IS NULL").run();
    db.prepare("UPDATE competencies SET grade_level = 'Grade 3' WHERE grade_level IS NULL").run();

    console.log("Loading multigrade_curriculum.json...");
    const multiPath = path.join(__dirname, 'multigrade_curriculum.json');
    const multiData = JSON.parse(fs.readFileSync(multiPath, 'utf8'));

    const gradesToSeed = [
        { grade: 'Grade 1', key: 'grade1', termOffset: 10 },
        { grade: 'Grade 2', key: 'grade2', termOffset: 20 }
    ];

    const insertSubject = db.prepare(`
        INSERT OR REPLACE INTO subjects (id, name, icon, color, bg_color, grade_level)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertTerm = db.prepare(`
        INSERT OR REPLACE INTO terms (id, term_number, title, theme, is_active, is_locked, grade_level)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertWeek = db.prepare(`
        INSERT INTO weeks (term_id, week_number, title, is_unlocked, grade_level)
        VALUES (?, ?, ?, ?, ?)
    `);

    const insertComp = db.prepare(`
        INSERT INTO competencies (term_id, week_id, subject_id, competency_text, strand_domain, grade_level)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertLesson = db.prepare(`
        INSERT INTO lessons (competency_id, day_number, title, explanation_learn, explore_story, explore_examples, illustrations)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertActivity = db.prepare(`
        INSERT INTO activities (competency_id, day_number, section_type, difficulty, activity_type, title, instructions, points, question_data, correct_answers)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const g of gradesToSeed) {
        console.log(`\n========================================`);
        console.log(`Seeding curriculum for ${g.grade}...`);
        console.log(`========================================`);

        const gradeCurriculum = multiData[g.key];
        if (!gradeCurriculum) {
            console.warn(`No curriculum data found for ${g.grade}`);
            continue;
        }

        // 1. Seed Subjects
        console.log(`Seeding subjects for ${g.grade}...`);
        for (const s of gradeCurriculum.subjects) {
            insertSubject.run(s.id, s.name, s.icon, s.color, s.bg, g.grade);
        }

        // 2. Seed Terms, Weeks, Competencies, Lessons, Activities
        for (const t of gradeCurriculum.terms) {
            const termId = g.termOffset + t.term_number; // e.g. 11, 12, 13 for G1; 21, 22, 23 for G2
            console.log(`Seeding ${g.grade} Term ${t.term_number} (ID: ${termId}): "${t.title}"...`);

            insertTerm.run(
                termId,
                t.term_number,
                t.title,
                t.theme,
                t.term_number === 1 ? 1 : 0,
                0,
                g.grade
            );

            for (const w of t.weeks) {
                // Check if week already exists
                let existingWeek = db.prepare('SELECT id FROM weeks WHERE term_id = ? AND week_number = ?').get(termId, w.week_number);
                let weekId;
                if (existingWeek) {
                    weekId = existingWeek.id;
                } else {
                    // Unlock Week 1 of Term 1 by default
                    const isUnlocked = (t.term_number === 1 && w.week_number === 1) ? 1 : 0;
                    const weekRes = insertWeek.run(termId, w.week_number, w.title, isUnlocked, g.grade);
                    weekId = weekRes.lastInsertRowid;
                }

                for (const sub of w.subjects) {
                    // Check if competency already exists
                    let existingComp = db.prepare('SELECT id FROM competencies WHERE week_id = ? AND subject_id = ?').get(weekId, sub.subject_id);
                    if (existingComp) {
                        continue; // Already seeded
                    }

                    const compRes = insertComp.run(
                        termId,
                        weekId,
                        sub.subject_id,
                        sub.competency,
                        sub.strand,
                        g.grade
                    );
                    const compId = compRes.lastInsertRowid;

                    // Generate lesson and 8-part activities
                    const moduleData = generateModuleContent(
                        t.term_number,
                        w.week_number,
                        sub.subject_id,
                        sub.subject_name,
                        sub.competency,
                        sub.strand,
                        g.grade
                    );

                    // Insert Lesson
                    insertLesson.run(
                        compId,
                        moduleData.lesson.day_number,
                        moduleData.lesson.title,
                        moduleData.lesson.explanation_learn,
                        moduleData.lesson.explore_story,
                        moduleData.lesson.explore_examples,
                        moduleData.lesson.illustrations
                    );

                    // Insert Activities
                    for (const act of moduleData.activities) {
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
                    }
                }
            }
        }
    }

    console.log("\nMulti-grade curriculum seeded successfully!");
    
    // Summary
    const totalTerms = db.prepare('SELECT COUNT(*) as count FROM terms').get().count;
    const totalWeeks = db.prepare('SELECT COUNT(*) as count FROM weeks').get().count;
    const totalComps = db.prepare('SELECT COUNT(*) as count FROM competencies').get().count;
    const totalLessons = db.prepare('SELECT COUNT(*) as count FROM lessons').get().count;
    const totalActs = db.prepare('SELECT COUNT(*) as count FROM activities').get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    console.log(`Current Database Stats:`);
    console.log(`- Terms: ${totalTerms}`);
    console.log(`- Weeks: ${totalWeeks}`);
    console.log(`- Competencies: ${totalComps}`);
    console.log(`- Lessons: ${totalLessons}`);
    console.log(`- Activities: ${totalActs}`);
    console.log(`- Users Preserved: ${totalUsers}`);
}

seedMultiGrade().catch(err => {
    console.error("Error during multi-grade seed:", err);
    process.exit(1);
});
