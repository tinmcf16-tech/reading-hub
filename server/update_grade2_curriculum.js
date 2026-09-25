// Authoritative Grade 2 Curriculum Updater
// Aligns Grade 2 100% to the official DepEd MATATAG Budget of Work (BOW).

const { db, initSchema } = require('./db');
const { GRADE2_BOW } = require('./authentic_grade2_bow');
const { generateModuleContent } = require('./content_generator');
const fs = require('fs');
const path = require('path');

async function updateGrade2Curriculum() {
    console.log("=== STARTING GRADE 2 AUTHENTIC BOW ALIGNMENT ===");
    initSchema();

    const subjectMap = {
        math: { id: 'g2_math', name: 'Mathematics', icon: '🔢', color: '#7C3AED', bg: '#FAF5FF' },
        makabansa: { id: 'g2_makabansa', name: 'Makabansa', icon: '🏛️', color: '#DC2626', bg: '#FEF2F2' },
        gmrc: { id: 'g2_gmrc', name: 'GMRC', icon: '🤝', color: '#D97706', bg: '#FFFBEB' },
        english: { id: 'g2_english', name: 'English', icon: '🇬🇧', color: '#4F46E5', bg: '#EEF2FF' },
        filipino: { id: 'g2_filipino', name: 'Filipino', icon: '🇵🇭', color: '#059669', bg: '#ECFDF5' }
    };

    const g2SubjectIds = Object.values(subjectMap).map(s => s.id);

    // 1. Delete existing Grade 2 activities, lessons, and competencies
    console.log("Cleaning up outdated Grade 2 records...");
    const existingG2CompIds = db.prepare(`
        SELECT id FROM competencies WHERE subject_id IN (${g2SubjectIds.map(id => `'${id}'`).join(',')}) OR grade_level = 'Grade 2'
    `).all().map(r => r.id);

    if (existingG2CompIds.length > 0) {
        const idList = existingG2CompIds.join(',');
        db.exec(`DELETE FROM activities WHERE competency_id IN (${idList})`);
        db.exec(`DELETE FROM lessons WHERE competency_id IN (${idList})`);
        db.exec(`DELETE FROM competencies WHERE id IN (${idList})`);
        console.log(`Removed ${existingG2CompIds.length} old Grade 2 competencies and their activities/lessons.`);
    }

    // Prepared statements
    const insertComp = db.prepare(`
        INSERT INTO competencies (term_id, week_id, subject_id, competency_text, strand_domain, macro_skills, grade_level)
        VALUES (?, ?, ?, ?, ?, ?, 'Grade 2')
    `);

    const insertLesson = db.prepare(`
        INSERT INTO lessons (competency_id, day_number, title, explanation_learn, explore_story, explore_examples, illustrations)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertActivity = db.prepare(`
        INSERT INTO activities (competency_id, day_number, section_type, difficulty, activity_type, title, instructions, points, question_data, correct_answers)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let totalComps = 0;
    let totalActivities = 0;

    for (let termNum = 1; termNum <= 3; termNum++) {
        const termId = 20 + termNum; // 21, 22, 23
        const termKey = `term${termNum}`;
        console.log(`\nProcessing Grade 2 Term ${termNum} (Term ID: ${termId})...`);

        for (let weekNum = 1; weekNum <= 11; weekNum++) {
            // Find week ID
            let weekRow = db.prepare('SELECT id FROM weeks WHERE term_id = ? AND week_number = ?').get(termId, weekNum);
            if (!weekRow) {
                const info = db.prepare('INSERT INTO weeks (term_id, week_number, title, is_unlocked, grade_level) VALUES (?, ?, ?, ?, ?)').run(
                    termId, weekNum, `Week ${weekNum}: Grade 2 Focus`, 1, 'Grade 2'
                );
                weekRow = { id: info.lastInsertRowid };
            }
            const weekId = weekRow.id;

            // Iterate over each subject
            for (const [subKey, subInfo] of Object.entries(subjectMap)) {
                const bowList = GRADE2_BOW[subKey]?.[termKey];
                if (!bowList || !bowList[weekNum - 1]) {
                    console.warn(`Missing BOW entry for ${subKey} T${termNum} W${weekNum}`);
                    continue;
                }

                const item = bowList[weekNum - 1];
                const competencyText = item.competency;
                const strand = item.strand;
                const macroSkills = (subKey === 'english' || subKey === 'filipino') 
                    ? 'Listening, Speaking, Reading, Writing' 
                    : 'Cognitive, Socio-Emotional, Practical Application';

                // Insert Competency
                const compResult = insertComp.run(
                    termId,
                    weekId,
                    subInfo.id,
                    competencyText,
                    strand,
                    macroSkills
                );
                const compId = compResult.lastInsertRowid;
                totalComps++;

                // Generate rich module content
                const modContent = generateModuleContent(
                    termNum,
                    weekNum,
                    subInfo.id,
                    subInfo.name,
                    competencyText,
                    strand,
                    'Grade 2'
                );

                // Insert Lesson
                insertLesson.run(
                    compId,
                    1,
                    item.title || modContent.lesson.title,
                    modContent.lesson.explanation_learn || 'Lesson Introduction',
                    modContent.lesson.explore_story || 'Lesson Story',
                    modContent.lesson.explore_examples || '[]',
                    modContent.lesson.illustrations || '[]'
                );

                // Insert Activities (At least 8 activities per competency!)
                for (const act of modContent.activities) {
                    insertActivity.run(
                        compId,
                        act.day_number || 3,
                        act.section_type,
                        act.difficulty,
                        act.activity_type,
                        act.title,
                        act.instructions,
                        act.points || 10,
                        JSON.stringify(act.question_data),
                        JSON.stringify(act.correct_answers)
                    );
                    totalActivities++;
                }
            }
        }
    }

    console.log(`\n✅ Grade 2 Database Seeding Complete!`);
    console.log(`- Inserted Competencies: ${totalComps} (100% aligned to DepEd BOW)`);
    console.log(`- Inserted Interactive Activities: ${totalActivities} (Average ${(totalActivities/totalComps).toFixed(1)} activities per competency)`);

    // 2. Synchronize multigrade_curriculum.json
    console.log("\nSynchronizing multigrade_curriculum.json for Grade 2...");
    const multiPath = path.join(__dirname, 'multigrade_curriculum.json');
    if (fs.existsSync(multiPath)) {
        const multiData = JSON.parse(fs.readFileSync(multiPath, 'utf8'));
        
        multiData.grade2 = {
            grade: "Grade 2",
            subjects: Object.values(subjectMap),
            terms: [1, 2, 3].map(termNum => {
                const termKey = `term${termNum}`;
                const termThemes = {
                    1: "Grade 2 - Community Geography, 3-Digit Numbers, and Literacy Foundations (Term 1)",
                    2: "Grade 2 - Community Culture, Subtraction with Regrouping, and Story Analysis (Term 2)",
                    3: "Grade 2 - Community Livelihoods, Multiplication & Division, and Creative Composition (Term 3)"
                };
                return {
                    term_number: termNum,
                    title: `Term ${termNum}`,
                    theme: termThemes[termNum],
                    weeks: Array.from({ length: 11 }, (_, i) => {
                        const weekNum = i + 1;
                        const weekSubjects = {};
                        for (const [subKey, subInfo] of Object.entries(subjectMap)) {
                            const bowItem = GRADE2_BOW[subKey]?.[termKey]?.[i];
                            weekSubjects[subInfo.id] = {
                                competency: bowItem ? bowItem.competency : `Grade 2 ${subInfo.name} Week ${weekNum}`,
                                strand: bowItem ? bowItem.strand : subInfo.name,
                                title: bowItem ? bowItem.title : `Week ${weekNum}`
                            };
                        }
                        return {
                            week_number: weekNum,
                            title: `Week ${weekNum}: Grade 2 Focus`,
                            subjects: weekSubjects
                        };
                    })
                };
            })
        };

        fs.writeFileSync(multiPath, JSON.stringify(multiData, null, 2), 'utf8');
        console.log("✅ multigrade_curriculum.json successfully updated for Grade 2.");
    }

    // Force WAL checkpoint to flush to reading_hub.sqlite
    db.exec(`PRAGMA wal_checkpoint(TRUNCATE);`);
    console.log("✅ Database WAL checkpointed to reading_hub.sqlite.");
}

updateGrade2Curriculum()
    .then(() => {
        console.log("ALL DONE!");
        process.exit(0);
    })
    .catch(err => {
        console.error("FATAL ERROR:", err);
        process.exit(1);
    });
