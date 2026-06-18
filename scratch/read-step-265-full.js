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
      if (index === 265) {
        console.log('Step 265 length:', obj.content.length);
        console.log('FIRST 1000 CHARACTERS:');
        console.log(obj.content.substring(0, 1000));
        console.log('\nLAST 1000 CHARACTERS:');
        console.log(obj.content.substring(obj.content.length - 1000));
      }
    } catch (err) {
      console.error('Error on line', index, err);
    }
    index++;
  }
}

run();
