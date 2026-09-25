// Multi-Grade PDF Curriculum Extractor for Grade 1 & Grade 2
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const G1_DIR = 'C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G1';
const G2_DIR = 'C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G2';

async function extractPdfText(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn('File not found:', filePath);
        return '';
    }
    const buf = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buf });
    const result = await parser.getText();
    return result.text || '';
}

function parseCompetenciesFromText(text, subjectName, gradeLevel) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const competencies = [];
    let currentTerm = 1;
    let currentStrand = 'General Competencies';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (/first term/i.test(line)) currentTerm = 1;
        else if (/second term/i.test(line)) currentTerm = 2;
        else if (/third term/i.test(line)) currentTerm = 3;

        // Detect strand headers
        if (line.startsWith('*') || (line.includes('(') && line.includes(')') && line.length < 80 && !line.includes('✔'))) {
            currentStrand = line.replace(/^\*+/, '').trim();
            continue;
        }

        // Detect competency bullet points
        if (line.startsWith('●') || line.startsWith('○') || line.startsWith('-') || /^[A-Z0-9]\.\s/.test(line)) {
            let compText = line.replace(/^[●○\-\*]\s*/, '').replace(/[✔\sX\?]+$/, '').trim();
            // Clean up trailing ticks or table artifacts
            compText = compText.replace(/\s+[✔X\s]+$/, '').trim();
            if (compText.length > 10) {
                competencies.push({
                    term: currentTerm,
                    strand: currentStrand,
                    text: compText
                });
            }
        }
    }

    return competencies;
}

async function buildMultiGradeCurriculum() {
    console.log("=== Extracting Grade 1 Competencies ===");
    const g1Files = [
        { id: 'g1_reading', name: 'Reading & Literacy', file: '[G1] Reading and Literacy.pdf', icon: '📖', color: '#4F46E5', bg: '#EEF2FF' },
        { id: 'g1_language', name: 'Language', file: '[G1] Language.pdf', icon: '🗣️', color: '#059669', bg: '#ECFDF5' },
        { id: 'g1_gmrc', name: 'GMRC', file: '[G1] GMRC.pdf', icon: '🤝', color: '#D97706', bg: '#FFFBEB' },
        { id: 'g1_makabansa', name: 'Makabansa', file: '[G1] MAKABANSA.pdf', icon: '🏛️', color: '#DC2626', bg: '#FEF2F2' },
        { id: 'g1_math', name: 'Mathematics', file: '[G1] Mathematics.pdf', icon: '🔢', color: '#7C3AED', bg: '#FAF5FF' }
    ];

    const g1Subjects = [];
    for (const sub of g1Files) {
        const filePath = path.join(G1_DIR, sub.file);
        const text = await extractPdfText(filePath);
        const comps = parseCompetenciesFromText(text, sub.name, 'Grade 1');
        console.log(`Grade 1 [${sub.name}]: extracted ${comps.length} competencies.`);
        g1Subjects.push({ ...sub, competencies: comps });
    }

    console.log("\n=== Extracting Grade 2 Competencies ===");
    const g2Files = [
        { id: 'g2_english', name: 'English', file: '[G2] English.pdf', icon: '🇬🇧', color: '#4F46E5', bg: '#EEF2FF' },
        { id: 'g2_filipino', name: 'Filipino', file: '[G2] Filipino.pdf', icon: '🇵🇭', color: '#059669', bg: '#ECFDF5' },
        { id: 'g2_gmrc', name: 'GMRC', file: '[G2] GMRC.pdf', icon: '🤝', color: '#D97706', bg: '#FFFBEB' },
        { id: 'g2_makabansa', name: 'Makabansa', file: '[G2] MAKABANSA.pdf', icon: '🏛️', color: '#DC2626', bg: '#FEF2F2' },
        { id: 'g2_math', name: 'Mathematics', file: '[G2] Mathematics.pdf', icon: '🔢', color: '#7C3AED', bg: '#FAF5FF' }
    ];

    const g2Subjects = [];
    for (const sub of g2Files) {
        const filePath = path.join(G2_DIR, sub.file);
        const text = await extractPdfText(filePath);
        const comps = parseCompetenciesFromText(text, sub.name, 'Grade 2');
        console.log(`Grade 2 [${sub.name}]: extracted ${comps.length} competencies.`);
        g2Subjects.push({ ...sub, competencies: comps });
    }

    // Distribute into 3 Terms × 11 Weeks = 33 weeks per grade
    function distributeWeeks(subjects, gradeLevel) {
        const terms = [
            { term_number: 1, title: 'First Term (Term 1)', theme: `${gradeLevel} - Foundation & Exploration` },
            { term_number: 2, title: 'Second Term (Term 2)', theme: `${gradeLevel} - Skill Development & Community` },
            { term_number: 3, title: 'Third Term (Term 3)', theme: `${gradeLevel} - Application & Synthesis` }
        ];

        return terms.map(t => {
            const weeks = [];
            for (let w = 1; w <= 11; w++) {
                const weekSubjects = subjects.map(s => {
                    const termComps = s.competencies.filter(c => c.term === t.term_number);
                    // Pick competency for this week or cycle
                    const idx = (w - 1) % (termComps.length || 1);
                    const comp = termComps[idx] || {
                        text: `Demonstrate developmentally-appropriate mastery in ${s.name} for ${gradeLevel}, Term ${t.term_number}, Week ${w}.`,
                        strand: `${s.name} Core Learning`
                    };

                    return {
                        subject_id: s.id,
                        subject_name: s.name,
                        icon: s.icon,
                        color: s.color,
                        bg: s.bg,
                        competency: comp.text,
                        strand: comp.strand || `${s.name} Competency`
                    };
                });

                weeks.push({
                    week_number: w,
                    title: `Week ${w}: ${gradeLevel} Focus`,
                    subjects: weekSubjects
                });
            }

            return {
                term_number: t.term_number,
                title: t.title,
                theme: t.theme,
                weeks
            };
        });
    }

    const g1Curriculum = {
        grade: 'Grade 1',
        subjects: g1Files.map(s => ({ id: s.id, name: s.name, icon: s.icon, color: s.color, bg: s.bg, grade_level: 'Grade 1' })),
        terms: distributeWeeks(g1Subjects, 'Grade 1')
    };

    const g2Curriculum = {
        grade: 'Grade 2',
        subjects: g2Files.map(s => ({ id: s.id, name: s.name, icon: s.icon, color: s.color, bg: s.bg, grade_level: 'Grade 2' })),
        terms: distributeWeeks(g2Subjects, 'Grade 2')
    };

    // Load existing Grade 3 curriculum
    const g3Path = path.join(__dirname, 'complete_curriculum.json');
    const g3Raw = JSON.parse(fs.readFileSync(g3Path, 'utf8'));
    const g3Curriculum = {
        grade: 'Grade 3',
        subjects: g3Raw.subjects.map(s => ({ ...s, grade_level: 'Grade 3' })),
        terms: g3Raw.terms
    };

    const multiCurriculum = {
        grades: ['Grade 1', 'Grade 2', 'Grade 3'],
        grade1: g1Curriculum,
        grade2: g2Curriculum,
        grade3: g3Curriculum
    };

    fs.writeFileSync(path.join(__dirname, 'multigrade_curriculum.json'), JSON.stringify(multiCurriculum, null, 2), 'utf8');
    console.log("\n Successfully generated multigrade_curriculum.json for Grade 1, Grade 2, and Grade 3!");
}

buildMultiGradeCurriculum().catch(console.error);
