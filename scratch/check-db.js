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

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Not Found');

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing admin_profiles table access...');
  try {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching admin_profiles:', error);
    } else {
      console.log('Query succeeded! Result:', data);
    }
  } catch (err) {
    console.error('Catch error:', err);
  }
}

test();
