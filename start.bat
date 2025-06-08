@echo off
cd backend
echo Starting backend at http://localhost:3000...
start /B php -S localhost:3000 router.php

cd ../frontend
echo Starting frontend server...
npm run dev

pause
