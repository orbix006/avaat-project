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
    console.log('Headers:', res.headers);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Raw Body:', body);
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e);
  });
  req.end();
}

inspectTable('projects');
inspectTable('services');
inspectTable('consultation_requests');
