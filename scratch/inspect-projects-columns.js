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

function inspectTable(tableName) {
  const urlObj = new URL(`${supabaseUrl}/rest/v1/${tableName}`);
  const req = https.request({
    method: 'OPTIONS',
    hostname: urlObj.hostname,
    path: urlObj.pathname,
    headers: {
      'apikey': supabaseKey
    }
  }, (res) => {
    console.log(`\n=== OPTIONS ${tableName} (Status: ${res.statusCode}) ===`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        console.log('Columns:', Object.keys(parsed.definitions[tableName].properties));
        console.log('Required:', parsed.definitions[tableName].required);
      } catch (err) {
        console.log('Raw response:', body);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e);
  });
  req.end();
}

inspectTable('projects');
inspectTable('services');
