const fs = require('fs');
const path = require('path');

function readJsonSafe(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}

const t1_t2 = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t1_t2_tables.json');
const unpacked = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t3_unpacked_raw.json');
const mathTxt = fs.readFileSync('C:/Users/Admin/Desktop/Reading HUB/parsed_bow/[G3] Mathematics.txt', 'utf8');
const sciTxt = fs.readFileSync('C:/Users/Admin/Desktop/Reading HUB/parsed_bow/[G3] Science.txt', 'utf8');

// Build the complete 3-term, 11-week, 6-subject structure
const subjects = [
    { id: 'english', name: 'English', icon: '📖', color: '#3B82F6' },
    { id: 'filipino', name: 'Filipino', icon: '🇵🇭', color: '#EF4444' },
    { id: 'gmrc', name: 'GMRC', icon: '🤝', color: '#10B981' },
    { id: 'makabansa', name: 'Makabansa', icon: '🏛️', color: '#F59E0B' },
    { id: 'math', name: 'Mathematics', icon: '🔢', color: '#8B5CF6' },
    { id: 'science', name: 'Science', icon: '🔬', color: '#06B6D4' }
];

console.log("Subjects defined:", subjects.map(s => s.name).join(', '));
