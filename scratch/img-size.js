const fs = require('fs');
const buf = fs.readFileSync('public/images/logo.png');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log('logo.png:', width, 'x', height);

try {
  const buf2 = fs.readFileSync('public/images/auth-bg.jpg'); // Let's check other images too if they exist.
  // JPEG size extraction is a bit complex, but let's check what images exist in public/images
} catch (e) {}

const files = fs.readdirSync('public/images');
console.log('All files in public/images:', files);
