const { createClient } = require('@supabase/supabase-js');
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
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching service rows to verify schema:');
  const { data, error } = await supabase.from('services').select('*').limit(1);
  if (error) {
    console.error('Error fetching services:', error);
  } else {
    console.log('Service Columns:', data && data[0] ? Object.keys(data[0]) : 'No data in services table');
    console.log('Full service data row:', data);
  }
}

run();
