const fs = require('fs');
const content = fs.readFileSync('types/database.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.toLowerCase().includes('database')) {
    console.log(`Line ${index + 1}: ${line}`);
  }
});
