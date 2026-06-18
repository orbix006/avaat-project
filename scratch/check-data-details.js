const { createClient } = require('@supabase/supabase-js');

const url1 = 'https://znednuexxtwcoesygzlo.supabase.co';
const key1 = 'sb_publishable__62E71hfpY3fXzPJOYD3EQ_4JeklGwM';

const url2 = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const key2 = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const client1 = createClient(url1, key1);
const client2 = createClient(url2, key2);

async function inspect(name, client) {
  console.log(`\n=== Data for ${name} ===`);
  
  const { data: sData } = await client.from('services').select('*');
  console.log('Services:', sData);

  const { data: cData } = await client.from('contact_info').select('*');
  console.log('Contact Info:', cData);

  const { data: setVal } = await client.from('site_settings').select('*');
  console.log('Site Settings:', setVal);
}

async function run() {
  await inspect('Active (znednuexxtwcoesygzlo)', client1);
  await inspect('Fallback (oewwbgjcrouiotcjfubs)', client2);
}

run();
