const fs = require('fs');
function readJsonSafe(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}
const raw = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t1_t2_tables.json');
raw.t1.forEach((r, idx) => {
    console.log(`[${idx}] cols=${r.length} -> col0: "${r[0]}"`);
});
