const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env variables
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
  console.log('Testing insert on consultation_requests table...');
  const { data, error } = await supabase
    .from('consultation_requests')
    .insert({
      name: 'Test Name',
      email: 'test@example.com',
      phone: '1234567890',
      budget_range: 'under_5L',
      project_type: 'interior_design',
      message: 'Test message',
      source: 'website'
    })
    .select();

  console.log('Result:', { data, error });
}

run();
