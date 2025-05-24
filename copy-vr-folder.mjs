import fs from 'fs';
import path from 'path';

const sourceDir = 'vr';
const destDir = 'dist/vr';

function copyDir(src, dest) {
  // 创建目标目录，如果不存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 如果是目录，递归复制
      copyDir(srcPath, destPath);
    } else {
      // 如果是文件，复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`正在将文件夹 "${sourceDir}" 复制到 "${destDir}"...`);

try {
  // 确保 dist 目录存在
   if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
  copyDir(sourceDir, destDir);
  console.log('VR 文件夹复制成功！');
} catch (err) {
  console.error('复制 VR 文件夹时出错：', err);
  process.exit(1); // 复制失败时退出并报错
}
