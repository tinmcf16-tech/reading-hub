const fs = require('fs');
const pdf = require('pdf-parse');

async function parsePdf(filePath) {
    console.log("=== " + filePath + " ===");
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    console.log("Pages: " + data.numpages);
    console.log("Total text length: " + data.text.length);
    console.log("First 1500 chars:\n" + data.text.substring(0, 1500));
    fs.writeFileSync(filePath.replace('.pdf', '_extracted.txt').replace(/.*[\\\/]/, ''), data.text, 'utf8');
}

async function run() {
    await parsePdf('C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G3/[G3] Mathematics.pdf');
    await parsePdf('C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G3/[G3] Science.pdf');
}
run();
