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

const columns = [
  'id', 'title', 'slug', 'category', 'status', 'location',
  'short_desc', 'short_description',
  'overview', 'full_description',
  'cover_image', 'featured_image',
  'is_featured', 'featured',
  'sort_order', 'display_order',
  'completion_year', 'completion_date',
  'client_name', 'gallery_images',
  'project_url', 'github_url', 'technologies',
  'city', 'created_by', 'created_at', 'updated_at',
  'resolved_cover', 'tag_names'
];

async function run() {
  console.log('Testing each column individually on v_published_projects view:');
  for (const col of columns) {
    const { error } = await supabase.from('v_published_projects').select(col).limit(1);
    if (error) {
      console.log(`❌ Column [${col}]: FAILED - ${error.message}`);
    } else {
      console.log(`✅ Column [${col}]: EXISTS`);
    }
  }
}

run();
