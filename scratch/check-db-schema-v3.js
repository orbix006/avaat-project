const { createClient } = require('@supabase/supabase-js');

const url1 = 'https://znednuexxtwcoesygzlo.supabase.co';
const key1 = 'sb_publishable__62E71hfpY3fXzPJOYD3EQ_4JeklGwM';

const url2 = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const key2 = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const client1 = createClient(url1, key1);
const client2 = createClient(url2, key2);

async function check(name, client) {
  console.log(`\n=== Checking Tables for ${name} ===`);
  const tables = ['profiles', 'admin_profiles', 'admin_audit_logs', 'media_library', 'hero_slides'];
  for (const table of tables) {
    const { data, error } = await client.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table [${table}]: ERROR - ${error.message} (${error.code})`);
    } else {
      console.log(`Table [${table}]: SUCCESS - ${data.length} row(s)`);
    }
  }
}

async function run() {
  await check('Active (znednuexxtwcoesygzlo)', client1);
  await check('Fallback (oewwbgjcrouiotcjfubs)', client2);
}

run();
