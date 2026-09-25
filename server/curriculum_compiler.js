const fs = require('fs');
const path = require('path');

function readJsonSafe(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}

const t1_t2 = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t1_t2_tables.json');
const unpacked = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t3_unpacked_raw.json');
const mathTxt = fs.readFileSync('C:/Users/Admin/Desktop/Reading HUB/parsed_bow/[G3] Mathematics.txt', 'utf8');
const sciTxt = fs.readFileSync('C:/Users/Admin/Desktop/Reading HUB/parsed_bow/[G3] Science.txt', 'utf8');

const subjects = [
    { id: 'english', name: 'English', icon: '📖', color: '#2563EB', bg: '#EFF6FF', grade_level: 'Grade 3' },
    { id: 'filipino', name: 'Filipino', icon: '🇵🇭', color: '#DC2626', bg: '#FEF2F2', grade_level: 'Grade 3' },
    { id: 'gmrc', name: 'GMRC', icon: '🤝', color: '#059669', bg: '#ECFDF5', grade_level: 'Grade 3' },
    { id: 'makabansa', name: 'Makabansa', icon: '🏛️', color: '#D97706', bg: '#FFFBEB', grade_level: 'Grade 3' },
    { id: 'math', name: 'Mathematics', icon: '🔢', color: '#7C3AED', bg: '#F5F3FF', grade_level: 'Grade 3' },
    { id: 'science', name: 'Science', icon: '🔬', color: '#0891B2', bg: '#ECFEFF', grade_level: 'Grade 3' }
];

function cleanText(t) {
    if (!t) return '';
    return t.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
}

// 1. EXTRACT TERM 1
const term1Data = {};
subjects.forEach(s => term1Data[s.id] = {});

// GMRC T1
for (let w = 1; w <= 11; w++) {
    const row = t1_t2.t1[w];
    term1Data['gmrc'][w] = {
        week: w,
        competency: cleanText(row[1]),
        strand: 'Good Manners and Right Conduct'
    };
}

// MAKABANSA T1
for (let w = 1; w <= 11; w++) {
    const row = t1_t2.t1[12 + w];
    term1Data['makabansa'][w] = {
        week: w,
        competency: cleanText(row[1]),
        strand: 'Ang Ating Komunidad sa Paglipas ng Panahon'
    };
}

// MATH T1
const mathT1Map = {
    1: t1_t2.t1[25][1],
    2: t1_t2.t1[26][1],
    3: t1_t2.t1[27][1],
    4: t1_t2.t1[28][1],
    5: t1_t2.t1[29][1],
    6: t1_t2.t1[30][1],
    7: t1_t2.t1[31][1] + ' (Part 1: Addition and Subtraction)',
    8: t1_t2.t1[31][1] + ' (Part 2: Problem Solving with Money)',
    9: t1_t2.t1[32][1],
    10: t1_t2.t1[33][1],
    11: t1_t2.t1[34][1]
};
for (let w = 1; w <= 11; w++) {
    term1Data['math'][w] = {
        week: w,
        competency: cleanText(mathT1Map[w]),
        strand: 'Numbers, Operations, and Geometry'
    };
}

// SCIENCE T1
const sciT1_4 = t1_t2.t1[37][1];
const sciT1_11 = t1_t2.t1[39][1];
const sciT1Map = {
    1: 'Participate in guided science activities to explore and describe the physical properties of solid objects, such as hardness, shape, and flexibility.',
    2: 'Participate in guided science activities to explore and describe liquid substances and their properties, such as fluidity and container shape.',
    3: 'Participate in guided science activities to explore and describe gases around us, their presence, and their importance.',
    4: sciT1_4,
    5: 'Describe changes in materials based on temperature: melting and freezing.',
    6: 'Describe changes in materials based on temperature: evaporation and condensation.',
    7: 'Participate in guided activities observing physical changes when substances are mixed or dissolved.',
    8: 'Identify useful and harmful changes in materials around the home and school.',
    9: 'Explain safety measures when handling hot objects, sharp materials, and chemical substances.',
    10: 'Demonstrate proper handling, storing, and disposal of household materials.',
    11: sciT1_11
};
for (let w = 1; w <= 11; w++) {
    term1Data['science'][w] = {
        week: w,
        competency: cleanText(sciT1Map[w]),
        strand: 'Materials, Matter, and Guided Inquiries'
    };
}

// ENGLISH T1
for (let w = 1; w <= 11; w++) {
    const row = t1_t2.t1[40 + w];
    term1Data['english'][w] = {
        week: w,
        competency: cleanText(row[1]),
        strand: 'Language, Literacy, and Story Exploration'
    };
}

// FILIPINO T1
for (let w = 1; w <= 11; w++) {
    const row = t1_t2.t1[52 + w];
    term1Data['filipino'][w] = {
        week: w,
        competency: cleanText(row[1]),
        strand: 'Palabigkasan, Pagbasa, at Pag-unawa'
    };
}

// 2. EXTRACT TERM 2
const term2Data = {};
subjects.forEach(s => term2Data[s.id] = {});

const t2SubjectRows = {
    gmrc: [1, 8, 15],
    makabansa: [2, 9, 16],
    math: [3, 10, 17],
    science: [4, 11, 18],
    english: [5, 12, 19],
    filipino: [6, 13, 20]
};

for (const s of subjects) {
    const rows = t2SubjectRows[s.id];
    for (let c = 1; c <= 4; c++) {
        term2Data[s.id][c] = {
            week: c,
            competency: cleanText(t1_t2.t2[rows[0]][c]),
            strand: s.name + ' - Second Term'
        };
    }
    for (let c = 1; c <= 4; c++) {
        term2Data[s.id][4 + c] = {
            week: 4 + c,
            competency: cleanText(t1_t2.t2[rows[1]][c]),
            strand: s.name + ' - Second Term'
        };
    }
    for (let c = 1; c <= 3; c++) {
        term2Data[s.id][8 + c] = {
            week: 8 + c,
            competency: cleanText(t1_t2.t2[rows[2]][c]),
            strand: s.name + ' - Second Term'
        };
    }
}

// 3. EXTRACT TERM 3
const term3Data = {};
subjects.forEach(s => term3Data[s.id] = {});

// GMRC T3
for (let w = 1; w <= 11; w++) {
    const row = unpacked.gmrc[24 + w];
    term3Data['gmrc'][w] = {
        week: w,
        competency: cleanText(row[2] || row[1]),
        title: cleanText(row[1]),
        strand: 'Edukasyon sa Pagpapakatao / GMRC'
    };
}

// MAKABANSA T3
for (let w = 1; w <= 11; w++) {
    const row = unpacked.makabansa[33 + w];
    term3Data['makabansa'][w] = {
        week: w,
        competency: cleanText(row[1] || row[0]),
        strand: 'Tayo Bilang Aktibong Pilipino'
    };
}

// ENGLISH T3
let currentEngWeek = 1;
const engT3Grouped = {};
for (let w = 1; w <= 11; w++) engT3Grouped[w] = [];

for (let i = 141; i <= 201 && i < unpacked.eng.length; i++) {
    const r = unpacked.eng[i];
    if (r[0] && r[0].match(/^(\d+)/)) {
        currentEngWeek = parseInt(r[0].match(/^(\d+)/)[1]);
    }
    if (r[2] && r[2].trim()) {
        engT3Grouped[currentEngWeek].push(cleanText(r[2]));
    }
}
for (let w = 1; w <= 11; w++) {
    term3Data['english'][w] = {
        week: w,
        competency: engT3Grouped[w].join(' • ') || 'Read and compose grade-level texts with appropriate fluency, expression, and grammatical accuracy.',
        strand: 'English Literacy and Communication'
    };
}

// FILIPINO T3
let currentFilWeek = 1;
const filT3Grouped = {};
for (let w = 1; w <= 11; w++) filT3Grouped[w] = [];

for (let i = 94; i < unpacked.fil.length; i++) {
    const r = unpacked.fil[i];
    if (r[0] && r[0].match(/^(\d+)/)) {
        currentFilWeek = parseInt(r[0].match(/^(\d+)/)[1]);
    }
    if (r[2] && r[2].trim()) {
        filT3Grouped[currentFilWeek].push(cleanText(r[2]));
    }
}
for (let w = 1; w <= 11; w++) {
    term3Data['filipino'][w] = {
        week: w,
        competency: filT3Grouped[w].join(' • ') || 'Naisasagawa ang wastong pagbigkas, pag-unawa sa binasang teksto, at pagbuo ng makabuluhang talata.',
        strand: 'Wikang Filipino at Pagbasa'
    };
}

// MATHEMATICS T3
const mathT3Map = {
    1: 'Multiply numbers using the 6, 7, 8, and 9 multiplication tables accurately and automatically.',
    2: 'Illustrate and apply properties of multiplication for the 6, 7, 8, and 9 tables (Identity, Zero, Commutative, Associative, and Distributive properties).',
    3: 'Multiply 2- to 3-digit numbers by 1-digit numbers with and without regrouping, and 2- to 4-digit numbers with products up to 10 000. Estimate products using multiples of 10.',
    4: 'Solve 1- to 2-step multiplication word problems involving whole numbers and money. Determine missing terms in repeating and increasing/decreasing patterns.',
    5: 'Illustrate division through equal jumps on the number line, sharing, grouping, and as the inverse operation of multiplication.',
    6: 'Divide numbers using the 6, 7, 8, and 9 multiplication tables. Find the missing number in number sentences involving multiplication and division.',
    7: 'Divide 2- to 3-digit numbers by 1-digit numbers with and without remainder, and divide 2- to 4-digit numbers by 10, 100, and 1 000.',
    8: 'Estimate the quotient of 2- to 3-digit numbers divided by 1- to 2-digit numbers using multiples of 10 or 100. Solve 1- to 2-step division problems, including money.',
    9: 'Represent fractions equal to one and greater than one using models. Add and subtract similar fractions using models.',
    10: 'Describe and draw the effect of a two-direction multi-step slide (translation) in basic shapes and figures. Identify symmetrical shapes and draw lines of symmetry.',
    11: 'Culminating Review & Performance Task: Comprehensive problem solving involving the four fundamental operations, fractions, and geometric patterns.'
};
for (let w = 1; w <= 11; w++) {
    term3Data['math'][w] = {
        week: w,
        competency: cleanText(mathT3Map[w]),
        strand: 'Multiplication, Division, Fractions, and Geometry'
    };
}

// SCIENCE T3
const sciT3Map = {
    1: 'Explore and describe how sound is produced and transferred in everyday situations (ringing bells, voices, vibrating objects).',
    2: 'Describe natural and artificial sources of light and their uses in everyday situations.',
    3: 'Participate in guided science activities to explore how light behaves (shadows, reflection, passing through transparent/translucent/opaque materials).',
    4: 'Explain how excessive light and loud sounds can be harmful to people and suggest safety measures to protect eyes and ears.',
    5: 'Participate in guided activities to explore ways to use movement, sound, and light to communicate or send signals between two people.',
    6: 'Locate and describe different types of non-living things found in and around school and community (rocks, soil, water, air, metals, sunlight).',
    7: 'Identify useful things made from non-living earth materials and recognize how materials are utilized to create tools, structures, and daily items.',
    8: 'Observe and record changes in weather conditions during a day or over several days, identifying sunny, cloudy, rainy, and windy patterns.',
    9: 'Describe how weather changes affect daily activities, livelihood, health, and identify types of weather that can be dangerous (storms, intense heat).',
    10: 'Observe and describe natural objects seen in the daytime and nighttime sky (Sun, Moon, stars, planets) and their observable movements.',
    11: 'Culminating Science Inquiry: Explain how celestial objects affect daily activities, and demonstrate personal safety measures against the harmful effects of the Sun.'
};
for (let w = 1; w <= 11; w++) {
    term3Data['science'][w] = {
        week: w,
        competency: cleanText(sciT3Map[w]),
        strand: 'Light, Sound, Earth Materials, Weather, and Sky'
    };
}

const completeCurriculum = {
    grade: 'Grade 3',
    school_year: '2026-2027',
    school: 'San Vicente Elementary School',
    district: 'Concepcion District, SDO Romblon',
    subjects,
    terms: [
        {
            term_number: 1,
            title: 'First Term (Term 1)',
            theme: 'Foundations of Learning, Self-Confidence, and Community History',
            weeks: Array.from({ length: 11 }, (_, i) => ({
                week_number: i + 1,
                title: `Term 1 - Week ${i + 1}`,
                subjects: subjects.map(s => ({
                    subject_id: s.id,
                    subject_name: s.name,
                    ...term1Data[s.id][i + 1]
                }))
            }))
        },
        {
            term_number: 2,
            title: 'Second Term (Term 2)',
            theme: 'Culture, Arts, Living Things, Operations, and Regional Vocabulary',
            weeks: Array.from({ length: 11 }, (_, i) => ({
                week_number: i + 1,
                title: `Term 2 - Week ${i + 1}`,
                subjects: subjects.map(s => ({
                    subject_id: s.id,
                    subject_name: s.name,
                    ...term2Data[s.id][i + 1]
                }))
            }))
        },
        {
            term_number: 3,
            title: 'Third Term (Term 3)',
            theme: 'Active Citizenship, Energy, Division, Fractions, and Celestial Wonders',
            weeks: Array.from({ length: 11 }, (_, i) => ({
                week_number: i + 1,
                title: `Term 3 - Week ${i + 1}`,
                subjects: subjects.map(s => ({
                    subject_id: s.id,
                    subject_name: s.name,
                    ...term3Data[s.id][i + 1]
                }))
            }))
        }
    ]
};

const outPath = 'C:/Users/Admin/Desktop/Reading HUB/server/complete_curriculum.json';
const outDir = path.dirname(outPath);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(completeCurriculum, null, 2), 'utf8');

console.log("SUCCESS! Generated complete_curriculum.json with:");
console.log(`- 3 Terms`);
console.log(`- 33 Weeks`);
console.log(`- 6 Subjects per week`);
console.log(`- Total subject-week modules: 33 * 6 = ${33 * 6}`);
