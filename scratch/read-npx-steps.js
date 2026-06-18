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
      if (index >= 92 && index <= 100) {
        console.log(`Step ${index}: type=${obj.type}, source=${obj.source}`);
        if (obj.content) {
          console.log(`Content:\n${obj.content.substring(0, 1000)}`);
        }
      }
    } catch (err) {
      // Ignore
    }
    index++;
  }
}

run();
