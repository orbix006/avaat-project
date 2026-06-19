const fs = require('fs');
const path = require('path');
const https = require('https');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const url = `${supabaseUrl}/rest/v1/`;
console.log('Fetching OpenAPI schema from:', url);

const req = https.get(url, {
  headers: {
    'apikey': supabaseKey
  }
}, (res) => {
  console.log('Status code:', res.statusCode);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      if (parsed.definitions) {
        if (parsed.definitions.projects) {
          console.log('\n--- projects Columns in Database ---');
          console.log(Object.keys(parsed.definitions.projects.properties));
        } else {
          console.log('projects table definition not found in schema.');
        }
        if (parsed.definitions.v_published_projects) {
          console.log('\n--- v_published_projects Columns in Database ---');
          console.log(Object.keys(parsed.definitions.v_published_projects.properties));
        } else {
          console.log('v_published_projects definition not found in schema.');
        }
      } else {
        console.log('No definitions in parsed OpenAPI schema.');
        console.log('Keys:', Object.keys(parsed));
      }
    } catch (err) {
      console.log('Error parsing response:', err.message);
      console.log('First 500 chars of body:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});
req.end();
