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

// We need a helper to execute the auth and profile updates
async function registerUser(email, password, role) {
  // Create a separate client for signup
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  
  console.log(`Registering user ${email}...`);
  
  // 1. Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: email.split('@')[0]
      }
    }
  });
  
  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log(`User ${email} already signed up, attempting to sign in and update role...`);
    } else {
      console.error(`Error signing up ${email}:`, authError);
      return;
    }
  }

  // 2. Sign in as that user to gain authorization to update their profile role
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    console.error(`Error signing in as ${email}:`, signInError);
    return;
  }

  const user = signInData.user;
  console.log(`Successfully logged in as ${email} (User ID: ${user.id}).`);

  // 3. Update their role in the profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', user.id)
    .select();

  if (profileError) {
    console.error(`Error updating role for ${email}:`, profileError);
  } else {
    console.log(`Successfully set role to "${role}" for ${email}:`, profileData);
  }
}

async function run() {
  try {
    // Register Admin
    await registerUser('admin@example.com', 'Password123!', 'admin');
    
    // Register User
    await registerUser('user@example.com', 'Password123!', 'user');
    
    console.log('Test users preparation done.');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
