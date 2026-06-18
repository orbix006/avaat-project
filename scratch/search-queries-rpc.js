const fs = require('fs');
const content = fs.readFileSync('lib/supabase/queries.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('.rpc(')) {
    console.log(`Line ${index + 1}: ${line}`);
  }
});
