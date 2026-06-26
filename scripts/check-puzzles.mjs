import fs from 'fs';
const puzzles = JSON.parse(fs.readFileSync('src/data/puzzles/index.json', 'utf8'));
console.log('Total puzzles:', puzzles.length);
const tally = {};
puzzles.forEach(p => {
  tally[p.category] = tally[p.category] || { Easy: 0, Medium: 0, Hard: 0, total: 0 };
  tally[p.category][p.difficulty]++;
  tally[p.category].total++;
});
Object.entries(tally).forEach(([cat, c]) => {
  console.log(cat + ':', c.total, '(Easy:', c.Easy + ', Medium:', c.Medium + ', Hard:', c.Hard + ')');
});
const ids = new Set(puzzles.map(p => p.id));
const answers = new Set(puzzles.map(p => p.answer.toLowerCase()));
console.log('Unique IDs:', ids.size === puzzles.length ? 'YES' : 'NO - DUPLICATE!');
console.log('Unique answers:', answers.size === puzzles.length ? 'YES' : 'NO - DUPLICATE!');
