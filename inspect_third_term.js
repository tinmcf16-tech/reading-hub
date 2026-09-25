const fs = require('fs');

function inspectThirdTerm(name, path) {
    const text = fs.readFileSync(path, 'utf8');
    console.log("==========================================");
    console.log("SUBJECT: " + name);
    console.log("==========================================");
    const idx = text.indexOf('Third Term');
    if (idx !== -1) {
        console.log(text.substring(idx, idx + 4000));
    } else {
        console.log("Could not find 'Third Term'");
    }
}

inspectThirdTerm("MATHEMATICS", "C:/Users/Admin/Desktop/Reading HUB/parsed_bow/[G3] Mathematics.txt");
inspectThirdTerm("SCIENCE", "C:/Users/Admin/Desktop/Reading HUB/parsed_bow/[G3] Science.txt");
