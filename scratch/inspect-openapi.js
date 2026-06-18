const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

async function run() {
  console.log(`Fetching OpenAPI spec from ${supabaseUrl}/rest/v1...`);
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch:', res.status, res.statusText);
      return;
    }
    
    const spec = await res.json();
    console.log('API title:', spec.info.title);
    
    if (spec.definitions && spec.definitions.projects) {
      console.log('\n--- PROJECTS PROPERTIES ---');
      console.log(Object.keys(spec.definitions.projects.properties));
    } else {
      console.log('projects definition not found');
    }
    
    if (spec.definitions && spec.definitions.services) {
      console.log('\n--- SERVICES PROPERTIES ---');
      console.log(Object.keys(spec.definitions.services.properties));
    } else {
      console.log('services definition not found');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
