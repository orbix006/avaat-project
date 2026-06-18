const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const supabaseKey = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const testEmail = `test_session_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';
  
  console.log(`Starting signup test with: ${testEmail}`);
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('User created:', data.user ? 'Yes' : 'No');
    console.log('Session returned:', data.session ? 'Yes' : 'No');
    console.log('User identities:', data.user?.identities);
  }
}

test();
