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

async function test() {
  console.log('--- Checking Supabase RPC check_email_exists ---');
  try {
    const { data, error } = await supabase.rpc('check_email_exists', { email_to_check: 'test@example.com' });
    console.log('check_email_exists result:', { data, error });
  } catch (err) {
    console.error('check_email_exists exception:', err);
  }

  console.log('--- Checking Supabase RPC is_admin ---');
  try {
    const { data, error } = await supabase.rpc('is_admin');
    console.log('is_admin result:', { data, error });
  } catch (err) {
    console.error('is_admin exception:', err);
  }

  console.log('--- Checking Supabase RPC handle_new_user ---');
  try {
    const { data, error } = await supabase.rpc('handle_new_user');
    console.log('handle_new_user result:', { data, error });
  } catch (err) {
    console.error('handle_new_user exception:', err);
  }

  console.log('--- Checking inserting valid lead into consultation_requests ---');
  try {
    const { data, error } = await supabase
      .from('consultation_requests')
      .insert({
        name: 'Test Lead',
        email: 'test_lead_valid@example.com',
        phone: '1234567890',
        message: 'Hello world',
        source: 'website'
      })
      .select();
    console.log('consultation_requests insert result:', { data, error });
  } catch (err) {
    console.error('consultation_requests insert exception:', err);
  }
}

test();
