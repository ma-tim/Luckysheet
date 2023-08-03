const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

if (dotenv.config()?.parsed?.DIST_PATH) {
  const distPath = path.resolve(__dirname, '../dist');
  const targetPath = path.resolve(dotenv.config().parsed.DIST_PATH);
  fs.cpSync(distPath, targetPath, {recursive: true})
} else {
  console.warn('DIST_PATH为空请检查env文件')
}