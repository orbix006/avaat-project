const { createClient } = require('@supabase/supabase-js');

// Original active database project credentials
const supabaseUrl = 'https://znednuexxtwcoesygzlo.supabase.co';
const supabaseKey = 'sb_publishable__62E71hfpY3fXzPJOYD3EQ_4JeklGwM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const testEmail = `test_v3_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';
  
  console.log(`Testing signup on active project (${supabaseUrl}) with email: ${testEmail}`);
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Test V3 User'
      }
    }
  });

  if (signUpError) {
    console.error('Auth Sign Up Error:', signUpError);
    return;
  }

  console.log('Auth Sign Up Success! User ID:', signUpData.user?.id);
  console.log('Session returned:', signUpData.session ? 'Yes' : 'No (Confirmation email sent)');

  // Let's check if the trigger handle_new_user automatically inserted a profile row in profiles table
  console.log('Checking profiles table for user ID:', signUpData.user?.id);
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', signUpData.user?.id);

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  } else {
    console.log('Profile found:', profileData);
  }
}

test();
