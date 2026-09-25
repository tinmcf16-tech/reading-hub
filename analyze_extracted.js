const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Admin/Desktop/Reading HUB/parsed_bow';
const files = fs.readdirSync(dir);

for (const file of files) {
    if (!file.endsWith('.txt')) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log("==================================================");
    console.log("FILE: " + file);
    console.log("Length: " + content.length);
    // Find quarters, terms, weeks
    const terms = content.match(/(quarter|kuwarter|term|termino)\s*\d+/gi) || [];
    const weeks = content.match(/(week|linggo)\s*\d+/gi) || [];
    console.log("Terms/Quarters found:", [...new Set(terms.map(t => t.toUpperCase()))].join(', '));
    console.log("Weeks found:", [...new Set(weeks.map(w => w.toUpperCase()))].slice(0, 15).join(', '));
    console.log("--- Snippet (first 400 chars) ---");
    console.log(content.substring(0, 400).replace(/\r?\n/g, ' '));
}
