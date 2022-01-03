cd frontend
npm install
npm run build
cp -r dist/* ../backend/public
cd ../backend
npm install
npm install -g pm2@latest
pwd
pm2 install typescript
pm2 restart ./backend/src/index.ts