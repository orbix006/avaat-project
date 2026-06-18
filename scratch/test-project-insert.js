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

async function run() {
  console.log('Testing insertion with new schema columns...');
  const testNew = {
    title: 'Test New Schema',
    slug: 'test-new-schema',
    category: 'residential',
    location: 'Test Location',
    short_description: 'Test Short Description',
    full_description: 'Test Full Description',
    featured_image: 'https://example.com/image.jpg',
    featured: true,
    display_order: 1,
    completion_date: '2026',
    status: 'draft'
  };

  const { data: dataNew, error: errorNew } = await supabase
    .from('projects')
    .insert(testNew)
    .select();

  if (errorNew) {
    console.log('New schema insertion failed:', errorNew.message);
  } else {
    console.log('New schema insertion SUCCEEDED! Row:', dataNew);
    // Cleanup
    await supabase.from('projects').delete().eq('id', dataNew[0].id);
    return;
  }

  console.log('\nTesting insertion with legacy schema columns...');
  const testLegacy = {
    title: 'Test Legacy Schema',
    slug: 'test-legacy-schema',
    category: 'residential',
    location: 'Test Location',
    short_desc: 'Test Short Desc',
    overview: 'Test Overview',
    cover_image: 'https://example.com/image.jpg',
    is_featured: true,
    sort_order: 1,
    completion_year: 2026,
    status: 'draft'
  };

  const { data: dataLegacy, error: errorLegacy } = await supabase
    .from('projects')
    .insert(testLegacy)
    .select();

  if (errorLegacy) {
    console.log('Legacy schema insertion failed:', errorLegacy.message);
  } else {
    console.log('Legacy schema insertion SUCCEEDED! Row:', dataLegacy);
    // Cleanup
    await supabase.from('projects').delete().eq('id', dataLegacy[0].id);
  }
}

run();
