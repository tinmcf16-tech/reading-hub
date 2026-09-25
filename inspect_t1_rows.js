const fs = require('fs');

function readJsonSafe(p) {
    const raw = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
}

const raw = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t1_t2_tables.json');

console.log("=== T1 all rows ===");
raw.t1.forEach((row, i) => {
    if (row.length > 0 && (row[0].includes('WEEK') || row[0].includes('SUBJECT') || isNaN(row[0]) === false && parseInt(row[0]) === 1)) {
        console.log(`Row ${i}: ${row[0]} | ${row[1] ? row[1].substring(0, 50) : ''}`);
    }
});
