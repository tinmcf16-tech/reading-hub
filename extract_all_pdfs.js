const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const outDir = 'C:/Users/Admin/Desktop/Reading HUB/parsed_bow';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function parseOnePdf(filePath) {
    const baseName = path.basename(filePath, '.pdf');
    console.log("Parsing: " + baseName);
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    await parser.load();
    const textResult = await parser.getText();
    const text = typeof textResult === 'string' ? textResult : (textResult.text || JSON.stringify(textResult));
    fs.writeFileSync(path.join(outDir, baseName + '.txt'), text, 'utf8');
    console.log("Saved " + baseName + ".txt (length: " + text.length + ")");
    await parser.destroy();
}

async function run() {
    const files = [
        'C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G3/[G3] Mathematics.pdf',
        'C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G3/[G3] Science.pdf',
        'C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G3/[G3] English.pdf',
        'C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G3/[G3] Filipino.pdf',
        'C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G3/[G3] GMRC.pdf',
        'C:/Users/Admin/Desktop/2026-2027 Files/BOW (Budget of Work) 123/G3/[G3] MAKABANSA.pdf'
    ];
    for (const f of files) {
        try {
            await parseOnePdf(f);
        } catch (err) {
            console.error("Error parsing " + f + ":", err.message);
        }
    }
    console.log("ALL PDFS EXTRACTED SUCCESSFULLY!");
}
run();
