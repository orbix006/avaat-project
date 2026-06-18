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

const url = `${supabaseUrl}/rest/v1/`;
console.log('Fetching URL:', url);

const req = https.get(url, {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
}, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      console.log('Keys in root:', Object.keys(parsed));
      if (parsed.paths) {
        console.log('Paths in OpenAPI:', Object.keys(parsed.paths));
      }
      if (parsed.definitions) {
        console.log('Definitions in OpenAPI:', Object.keys(parsed.definitions));
      }
    } catch (err) {
      console.log('Raw body length:', body.length);
      console.log('First 500 chars of body:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});
