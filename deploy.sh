cd frontend
npm install
npm run build
cp -r dist/* ../backend/public
cd ../backend
npm install
npm install -g pm2@latest
pm2 install typescript
pm2 restart /home/runner/work/42cabi/42cabi/backend/src/index.ts