const { createClient } = require('@supabase/supabase-js');

const url1 = 'https://znednuexxtwcoesygzlo.supabase.co';
const key1 = 'sb_publishable__62E71hfpY3fXzPJOYD3EQ_4JeklGwM';

const url2 = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const key2 = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const client1 = createClient(url1, key1);
const client2 = createClient(url2, key2);

const tables = [
  'admin_profiles',
  'profiles',
  'hero_slides',
  'services',
  'projects',
  'project_media',
  'testimonials',
  'site_settings',
  'contact_info',
  'consultation_requests',
  'newsletter_subscribers',
  'activity_logs'
];

async function checkProject(name, client) {
  console.log(`\n=== Checking Project: ${name} ===`);
  for (const table of tables) {
    try {
      const { data, error } = await client.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table [${table}]: ERROR - ${error.message} (${error.code})`);
      } else {
        console.log(`Table [${table}]: SUCCESS - ${data.length} row(s)`);
      }
    } catch (err) {
      console.log(`Table [${table}]: CATCH ERROR - ${err.message}`);
    }
  }
}

async function run() {
  await checkProject('Active (from .env.local) - znednuexxtwcoesygzlo', client1);
  await checkProject('Fallback (from test-status.js) - oewwbgjcrouiotcjfubs', client2);
}

run();
