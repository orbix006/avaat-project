const fs = require('fs');

try {
  const content = fs.readFileSync('scratch/user-input-step-265.txt', 'utf8');
  const lines = content.split('\n');
  let found = false;
  lines.forEach((line, index) => {
    if (line.includes('handle_new_user')) {
      console.log(`\n--- Mention of handle_new_user at line ${index + 1} ---`);
      const start = Math.max(0, index - 10);
      const end = Math.min(lines.length - 1, index + 50);
      for (let i = start; i <= end; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
      found = true;
    }
  });
  if (!found) {
    console.log('No mention of handle_new_user in user-input-step-265.txt');
  }
} catch (err) {
  console.error('Error:', err.message);
}
