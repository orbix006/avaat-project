const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oewwbgjcrouiotcjfubs.supabase.co';
const supabaseKey = 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const userId = '3cfd7926-8c52-46a7-9beb-7b9cf2206070';
  console.log('Querying admin_profiles for user ID:', userId);
  
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', userId);
    
  console.log('Result:', { data, error });
}

test();
