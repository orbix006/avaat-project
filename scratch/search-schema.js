const fs = require('fs');

const content = fs.readFileSync('scratch/user-input-step-265.txt', 'utf8');
console.log('File size:', content.length, 'characters');

// Let's search for function definitions
const lines = content.split('\n');
console.log('Total lines:', lines.length);

console.log('Searching for trigger handle_new_user or table profiles:');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('handle_new_user') || line.includes('profiles') || line.includes('user_role')) {
    console.log(`Line ${i + 1}: ${line.substring(0, 120)}`);
  }
}
