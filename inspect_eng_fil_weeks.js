const fs = require('fs');
function readJsonSafe(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}
const unpacked = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t3_unpacked_raw.json');

console.log("=== ENG non-empty col0 rows ===");
unpacked.eng.forEach((r, i) => {
    if (r[0] && r[0].trim()) {
        console.log(`[ENG ${i}] ${r[0]}`);
    }
});

console.log("\n=== FIL non-empty col0 rows ===");
unpacked.fil.forEach((r, i) => {
    if (r[0] && r[0].trim()) {
        console.log(`[FIL ${i}] ${r[0]}`);
    }
});
