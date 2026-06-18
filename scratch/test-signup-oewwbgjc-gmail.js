const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const supabaseKey = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const testEmail = `test_user_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';
  const fullName = 'Test User';
  
  console.log(`Starting signup test with: ${testEmail} on fallback URL: ${supabaseUrl}`);
  
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
    }
  } catch (err) {
    console.error('Unexpected catch error:', err);
  }
}

test();
