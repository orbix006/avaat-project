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
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('avaat')) {
      console.log(`${path.relative(path.join(__dirname, '..'), file)}:${idx + 1}: ${line.trim()}`);
    }
  });
});
