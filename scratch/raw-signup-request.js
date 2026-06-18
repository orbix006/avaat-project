const fs = require('fs');
const path = require('path');
const https = require('https');

// Read env variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const url = `${supabaseUrl}/auth/v1/signup`;
console.log('Sending raw POST request to:', url);

const bodyData = JSON.stringify({
  email: `test_raw_${Date.now()}@gmail.com`,
  password: 'Password123!',
  data: {
    full_name: 'Test Raw User'
  }
});

const urlObj = new URL(url);
const req = https.request({
  hostname: urlObj.hostname,
  path: urlObj.pathname,
  method: 'POST',
  headers: {
    'apikey': supabaseKey,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(bodyData)
  }
}, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response Body Length:', body.length);
    console.log('Response Body:');
    console.log(body);
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e);
});

req.write(bodyData);
req.end();
