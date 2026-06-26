@echo off
cd /d "%~dp0.."
node scripts/generate-puzzles-final.mjs
pause
