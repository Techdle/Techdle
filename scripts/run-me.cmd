@echo off
cd /d "%~dp0.."
echo === Puzzle Count and Distribution ===
node -e "const d=require('fs').readFileSync('src/data/puzzles/index.json','utf8');const j=JSON.parse(d);console.log('Total:',j.length);const t={};j.forEach(p=>{t[p.category]=t[p.category]||{Easy:0,Medium:0,Hard:0,total:0};t[p.category][p.difficulty]++;t[p.category].total++});Object.entries(t).forEach(([c,ct])=>console.log(c+':',ct.total,'(E:',ct.Easy,'M:',ct.Medium,'H:',ct.Hard+')'));const ids=new Set(j.map(p=>p.id));const answers=new Set(j.map(p=>p.answer.toLowerCase()));console.log('Unique IDs:',ids.size===j.length);console.log('Unique answers:',answers.size===j.length)"
echo === Generating Combined File ===
node scripts/generate-puzzles-final.mjs
pause
