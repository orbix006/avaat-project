const fs = require('fs');
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
      const stepIndex = obj.step_index;
      if ([392, 480, 485, 493, 494].includes(stepIndex)) {
        console.log(`\n========================================`);
        console.log(`Step Index: ${stepIndex}, type: ${obj.type}, source: ${obj.source}`);
        if (obj.content) {
          console.log(`Content:\n${obj.content.substring(0, 1500)}`);
        }
      }
    } catch (err) {
      // Ignore
    }
    index++;
  }
}

run();
