const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function run() {
  const logPath = 'C:\\Users\\Administrator\\.gemini\\antigravity-ide\\brain\\501042c0-4ff4-41b8-8cd5-a1190f341972\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(logPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      console.log(`Step ${index}: source=${obj.source}, type=${obj.type}, status=${obj.status}`);
      if (obj.source === 'USER_EXPLICIT' && obj.type === 'USER_INPUT') {
        const text = obj.content || '';
        if (text.includes('DATABASE SCHEMA')) {
          console.log(`  -> Found user input with DATABASE SCHEMA at Step ${index}`);
          fs.writeFileSync(`scratch/user-input-step-${index}.txt`, text);
          console.log(`  -> Saved to scratch/user-input-step-${index}.txt`);
        }
      }
    } catch (err) {
      console.error(`Error parsing line ${index}:`, err.message);
    }
    index++;
  }
}

run();
