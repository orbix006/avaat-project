const fs = require('fs');
const content = fs.readFileSync('scratch/user-input-step-265.txt', 'utf8');

const regex = /CREATE\s+TABLE\s+(?:public\.)?profiles\b[\s\S]*?\);/i;
const match = content.match(regex);
if (match) {
  console.log('Found profiles table definition:');
  console.log(match[0]);
} else {
  console.log('profiles table definition not found. Mentions of profiles table:');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('CREATE TABLE') && line.includes('profile')) {
      console.log(`Line ${index + 1}: ${line}`);
    }
  });
}
