const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const supabaseKey = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing fallback Supabase URL:', supabaseUrl);
  const { data: d1, error: e1 } = await supabase.from('profiles').select('*').limit(1);
  console.log('profiles result:', { data: d1, error: e1 });

  const { data: d2, error: e2 } = await supabase.from('admin_profiles').select('*').limit(1);
  console.log('admin_profiles result:', { data: d2, error: e2 });
}

test();
