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
  console.log('Signing in...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@example.com',
    password: 'Password123!'
  });

  if (signInError) {
    console.error('Sign in error:', signInError);
    return;
  }

  const userId = signInData.user.id;
  console.log('Logged in user ID:', userId);

  // 1. Try updating full_name
  console.log('1. Attempting to update full_name...');
  const { data: data1, error: error1 } = await supabase
    .from('profiles')
    .update({ full_name: 'Admin User Updated' })
    .eq('id', userId)
    .select();

  console.log('Update full_name result:', { data: data1, error: error1 });

  // 2. Try updating role
  console.log('2. Attempting to update role...');
  const { data: data2, error: error2 } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId)
    .select();

  console.log('Update role result:', { data: data2, error: error2 });
}

run();
