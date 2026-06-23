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

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Querying site_settings...');
  const { data: settings, error: errSettings } = await supabase.from('site_settings').select('*');
  console.log('Site Settings:', settings, errSettings);

  console.log('Querying hero_slides...');
  const { data: slides, error: errSlides } = await supabase.from('hero_slides').select('*');
  console.log('Hero Slides:', slides, errSlides);
}

test();
