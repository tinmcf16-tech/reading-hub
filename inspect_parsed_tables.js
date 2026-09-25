const fs = require('fs');

function readJsonSafe(p) {
    const raw = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
}

const raw = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t1_t2_tables.json');

console.log("=== T1 sample rows (first 10) ===");
for (let i = 0; i < Math.min(10, raw.t1.length); i++) {
    console.log(`Row ${i} (${raw.t1[i].length} cols):`, raw.t1[i].map(c => (c || '').substring(0, 45) + '...'));
}

console.log("\n=== T2 sample rows (first 10) ===");
for (let i = 0; i < Math.min(10, raw.t2.length); i++) {
    console.log(`Row ${i} (${raw.t2[i].length} cols):`, raw.t2[i].map(c => (c || '').substring(0, 45) + '...'));
}
