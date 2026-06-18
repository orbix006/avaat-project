const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const supabaseKey = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const testEmail = `test_fallback_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';
  
  console.log(`Testing signup on fallback project (${supabaseUrl}) with email: ${testEmail}`);
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Test Fallback User'
      }
    }
  });

  if (signUpError) {
    console.error('Auth Sign Up Error:', signUpError);
    return;
  }

  console.log('Auth Sign Up Success! User ID:', signUpData.user?.id);
  console.log('Session returned:', signUpData.session ? 'Yes' : 'No (Confirmation email sent)');
}

test();
