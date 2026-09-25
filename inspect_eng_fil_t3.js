const fs = require('fs');
function readJsonSafe(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}
const unpacked = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t3_unpacked_raw.json');

console.log("=== ENGLISH ROWS SEARCH FOR TERM 3 ===");
unpacked.eng.forEach((r, i) => {
    const text = r.join(' | ');
    if (text.match(/term 3|third term|week 1|week 11/i)) {
        console.log(`[ENG ${i}] ${text.substring(0, 70)}...`);
    }
});

console.log("\n=== FILIPINO ROWS SEARCH FOR TERM 3 ===");
unpacked.fil.forEach((r, i) => {
    const text = r.join(' | ');
    if (text.match(/ikatlong|termino 3|linggo 1|linggo 11/i)) {
        console.log(`[FIL ${i}] ${text.substring(0, 70)}...`);
    }
});
