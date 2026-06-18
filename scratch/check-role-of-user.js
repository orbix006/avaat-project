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

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function run() {
  console.log('Signing in as admin@example.com...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@example.com',
    password: 'Password123!'
  });

  if (signInError) {
    console.error('Sign in error:', signInError);
    return;
  }

  console.log('User ID:', signInData.user.id);

  console.log('Querying profile...');
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', signInData.user.id)
    .single();

  if (profileError) {
    console.error('Query profile error:', profileError);
  } else {
    console.log('Profile loaded:', profileData);
  }
}

run();
