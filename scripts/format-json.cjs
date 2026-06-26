const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync('src/data/puzzles/index.json', 'utf8'));
fs.writeFileSync('src/data/puzzles/index.json', JSON.stringify(data, null, 2));
console.log('Formatted', data.length, 'puzzles with indentation.');
