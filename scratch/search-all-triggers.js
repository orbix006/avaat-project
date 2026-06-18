const fs = require('fs');

try {
  const content = fs.readFileSync('scratch/user-input-step-265.txt', 'utf8');
  const lines = content.split('\n');
  console.log('Searching for TRIGGER or FUNCTION mentions in user-input-step-265.txt:');
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes('trigger') || line.toLowerCase().includes('create function') || line.toLowerCase().includes('create or replace function')) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
} catch (err) {
  console.error('Error reading file:', err.message);
}
