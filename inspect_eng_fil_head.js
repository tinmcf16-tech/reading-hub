const fs = require('fs');
function readJsonSafe(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}
const unpacked = readJsonSafe('C:/Users/Admin/Desktop/Reading HUB/t3_unpacked_raw.json');
console.log("ENG rows:", unpacked.eng.length);
console.log("FIL rows:", unpacked.fil.length);
for (let i = 0; i < 5; i++) {
    console.log(`ENG[${i}]:`, unpacked.eng[i]);
}
for (let i = 0; i < 5; i++) {
    console.log(`FIL[${i}]:`, unpacked.fil[i]);
}
