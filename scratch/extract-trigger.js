const fs = require('fs');

const content = fs.readFileSync('scratch/user-input-step-265.txt', 'utf8');

const regex = /CREATE[^{]*FUNCTION[^{]*handle_new_user[\s\S]*?LANGUAGE\s+plpgsql/i;
const match = content.match(regex);
if (match) {
  console.log('Found function handle_new_user:');
  console.log(match[0]);
} else {
  console.log('Direct handle_new_user function definition match not found. Searching for mentions of handle_new_user...');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('handle_new_user')) {
      console.log(`Line ${index + 1}: ${line}`);
    }
  });
}
