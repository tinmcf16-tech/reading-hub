const fs = require('fs');
function readJsonSafe(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}
const raw = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t3_unpacked_raw.json');

console.log("=== GMRC sample rows ===");
raw.gmrc.forEach((r, i) => {
    const text = r.join(' | ');
    if (text.match(/term|termino|week|linggo/i)) {
        console.log(`[GMRC ${i}] ${text.substring(0, 60)}...`);
    }
});

console.log("=== MAKABANSA sample rows ===");
raw.makabansa.forEach((r, i) => {
    const text = r.join(' | ');
    if (text.match(/term|termino|week|linggo/i)) {
        console.log(`[MAKABANSA ${i}] ${text.substring(0, 60)}...`);
    }
});

console.log("=== FILIPINO sample rows ===");
raw.fil.forEach((r, i) => {
    const text = r.join(' | ');
    if (text.match(/term|termino|week|linggo/i)) {
        console.log(`[FILIPINO ${i}] ${text.substring(0, 60)}...`);
    }
});
