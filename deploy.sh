cd frontend
npm install
npm run build
cp -r dist/* ../backend/public
cd ../backend
npm install -g pm2@latest
# pm2 install typescript
npm install
pm2 start src/index.ts