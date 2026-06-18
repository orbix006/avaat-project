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
  const testEmail = `test_user_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const fullName = 'Test User';
  
  console.log(`Starting signup test with: ${testEmail}`);
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.error('Auth Sign Up Error:', authError);
      return;
    }

    console.log('Auth Sign Up Success! User ID:', authData.user?.id);
    console.log('User object:', JSON.stringify(authData.user, null, 2));

    if (authData.user) {
      console.log('Attempting to insert profile into admin_profiles...');
      const { data: pData, error: pError } = await supabase
        .from('admin_profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          email: testEmail,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      if (pError) {
        console.error('Insert to admin_profiles error:', pError);
      } else {
        console.log('Insert to admin_profiles success! Data:', pData);
      }

      console.log('Attempting to insert profile into profiles...');
      const { data: pData2, error: pError2 } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          email: testEmail,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      if (pError2) {
        console.error('Insert to profiles error:', pError2);
      } else {
        console.log('Insert to profiles success! Data:', pData2);
      }
    }
  } catch (err) {
    console.error('Unexpected catch error:', err);
  }
}

test();
