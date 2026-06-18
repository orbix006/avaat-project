const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const supabaseKey = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const email = 'test_user_1781691681917@gmail.com';
  const password = 'Password123!';
  
  console.log(`Attempting to sign in with: ${email}`);
  
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('Sign In Error:', signInError);
    return;
  }

  console.log('Sign In Success! User ID:', signInData.user?.id);
  console.log('Session exists:', !!signInData.session);

  // Now, attempt to insert into admin_profiles
  console.log('Attempting to insert profile into admin_profiles with active session...');
  const { data: pData, error: pError } = await supabase
    .from('admin_profiles')
    .insert({
      id: signInData.user.id,
      full_name: 'Test User Gmail',
      email: email,
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
}

test();
