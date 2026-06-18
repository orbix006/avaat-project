import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oewwbgjcrouiotcjfubs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_DlM9k-yY4hxHCXhs1-ffMQ_vN6yH49q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEnum() {
  const { data, error } = await supabase.rpc('get_enum_values'); // Will likely fail but just want to see.
  // Actually, I'll just try inserting a lead with 'won' status.
  const { data: d2, error: e2 } = await supabase
    .from('consultation_requests')
    .insert({
      name: 'Test Lead',
      email: 'test@example.com',
      phone: '1234567890',
      status: 'won', // 'won' is not in the types/database.ts enum
      source: 'web'
    })
    .select();
  console.log({ d2, e2 });
}
checkEnum();
