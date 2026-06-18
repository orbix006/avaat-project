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

function checkColumns(selectString) {
  return new Promise((resolve) => {
    const urlObj = new URL(`${supabaseUrl}/rest/v1/projects?select=${selectString}&limit=1`);
    const req = https.request({
      method: 'GET',
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body
        });
      });
    });

    req.on('error', (e) => {
      resolve({ error: e });
    });
    req.end();
  });
}

async function main() {
  // Test both schemas
  const test1 = await checkColumns('id,title,slug,category,short_desc,overview,cover_image,is_featured,sort_order,status');
  console.log('Test 1 (Existing schema in types):', test1.status, test1.body);

  const test2 = await checkColumns('id,title,slug,category,short_description,full_description,client_name,location,project_url,technologies,featured_image,gallery_images,completion_date,display_order,featured,status');
  console.log('Test 2 (Requested schema):', test2.status, test2.body);
}

main();
