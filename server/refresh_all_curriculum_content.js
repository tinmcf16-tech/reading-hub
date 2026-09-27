// Refresh All Curriculum Content: Lessons & Activities
// - Deep, pedagogical discussions with step-by-step principles and worked examples in Let's Learn
// - 5 substantive questions in Day 3 Let's Practice (content problems, NOT meta-questions)
// - 5 interactive matching pairs in Day 4 Let's Play
// - 1 critical thinking problem in Day 4 Challenge Me
// - 10-item summative assessment in Day 5 Show What You Know
// - Strictly preserves users, user_stats, and credentials

const { db } = require('./db');
const { generateModuleContent } = require('./content_generator');
const { saveToCloud } = require('./cloudSync');

async function refreshAllCurriculum() {
    console.log("=== STARTING FULL CURRICULUM UPGRADE (528 COMPETENCIES) ===");

    // Fetch all competencies with terms, weeks, and subjects
    const competencies = db.prepare(`
        SELECT 
            c.id as comp_id,
            c.competency_text,
            c.strand_domain,
            c.grade_level,
            s.id as subject_id,
            s.name as subject_name,
            w.week_number,
            t.term_number
        FROM competencies c
        JOIN terms t ON c.term_id = t.id
        JOIN weeks w ON c.week_id = w.id
        JOIN subjects s ON c.subject_id = s.id
        ORDER BY c.grade_level ASC, t.term_number ASC, w.week_number ASC, s.id ASC
    `).all();

    console.log(`Found ${competencies.length} competencies to update.`);

    // Prepared statements
    const updateLesson = db.prepare(`
        UPDATE lessons
        SET title = ?, explanation_learn = ?, explore_story = ?, explore_examples = ?, illustrations = ?
        WHERE competency_id = ?
    `);

    const insertLesson = db.prepare(`
        INSERT INTO lessons (competency_id, day_number, title, explanation_learn, explore_story, explore_examples, illustrations)
        VALUES (?, 1, ?, ?, ?, ?, ?)
    `);

    const deleteActivities = db.prepare(`DELETE FROM activities WHERE competency_id = ?`);

    const insertActivity = db.prepare(`
        INSERT INTO activities (competency_id, day_number, section_type, difficulty, activity_type, title, instructions, points, question_data, correct_answers)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let updatedLessons = 0;
    let createdActivities = 0;

    for (let i = 0; i < competencies.length; i++) {
        const comp = competencies[i];

        const { lesson, activities } = generateModuleContent(
            comp.term_number,
            comp.week_number,
            comp.subject_id,
            comp.subject_name,
            comp.competency_text,
            comp.strand_domain,
            comp.grade_level
        );

        // Update or insert lesson
        const existingLesson = db.prepare('SELECT id FROM lessons WHERE competency_id = ?').get(comp.comp_id);
        if (existingLesson) {
            updateLesson.run(
                lesson.title,
                lesson.explanation_learn,
                lesson.explore_story,
                lesson.explore_examples,
                lesson.illustrations,
                comp.comp_id
            );
        } else {
            insertLesson.run(
                comp.comp_id,
                lesson.title,
                lesson.explanation_learn,
                lesson.explore_story,
                lesson.explore_examples,
                lesson.illustrations
            );
        }
        updatedLessons++;

        // Refresh activities
        deleteActivities.run(comp.comp_id);

        for (const act of activities) {
            insertActivity.run(
                comp.comp_id,
                act.day_number,
                act.section_type,
                act.difficulty,
                act.activity_type,
                act.title,
                act.instructions,
                act.points,
                typeof act.question_data === 'string' ? act.question_data : JSON.stringify(act.question_data),
                typeof act.correct_answers === 'string' ? act.correct_answers : JSON.stringify(act.correct_answers)
            );
            createdActivities++;
        }

        if ((i + 1) % 50 === 0 || i === competencies.length - 1) {
            console.log(`Progress: ${i + 1}/${competencies.length} competencies updated (${createdActivities} activities generated).`);
        }
    }

    console.log(`\nUpgrade completed!`);
    console.log(`- Updated Lessons: ${updatedLessons}`);
    console.log(`- Generated Activities: ${createdActivities}`);

    // Checkpoint WAL
    db.exec(`PRAGMA wal_checkpoint(TRUNCATE);`);
    console.log("WAL checkpoint completed.");

    // Trigger cloud backup
    try {
        console.log("Saving updated curriculum to cloud backup...");
        await saveToCloud("Curriculum upgraded: rich discussions, 10-item assessments, interactive matching game");
        console.log("Cloud backup successful!");
    } catch (err) {
        console.warn("Cloud backup warning:", err.message);
    }
}

refreshAllCurriculum().catch(err => {
    console.error("Fatal error refreshing curriculum:", err);
    process.exit(1);
});
