const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(walk(filePath));
      }
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '..'));
const patterns = ['max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-[', 'w-[', 'max-width'];
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    patterns.forEach(pattern => {
      if (line.includes(pattern)) {
        console.log(`${path.relative(path.join(__dirname, '..'), file)}:${idx + 1} (${pattern}): ${line.trim()}`);
      }
    });
  });
});
