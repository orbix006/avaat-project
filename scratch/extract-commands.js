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
      if (obj.source === 'MODEL' && obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'run_command') {
            console.log(`Step ${index}: CommandLine: ${tc.args.CommandLine}`);
          }
        }
      }
    } catch (err) {
      // Ignore
    }
    index++;
  }
}

run();
