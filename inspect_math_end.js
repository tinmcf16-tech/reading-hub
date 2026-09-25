const fs = require('fs');
const text = fs.readFileSync('C:/Users/Admin/Desktop/Reading HUB/parsed_bow/[G3] Mathematics.txt', 'utf8');
const idx = text.indexOf('8 to 9');
if (idx !== -1) {
    console.log(text.substring(idx, idx + 2000));
}
