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
  console.log('Querying from remote Supabase...');
  
  // Projects
  const { data: pData, error: pError } = await supabase.from('projects').select('*').limit(1);
  if (pError) console.error('Error fetching project:', pError);
  else console.log('Project row returned:', pData[0] ? Object.keys(pData[0]) : 'No projects in table');

  // Services
  const { data: sData, error: sError } = await supabase.from('services').select('*').limit(1);
  if (sError) console.error('Error fetching service:', sError);
  else console.log('Service row returned:', sData[0] ? Object.keys(sData[0]) : 'No services in table');

  // Consultation Requests
  const { data: cData, error: cError } = await supabase.from('consultation_requests').select('*').limit(1);
  if (cError) console.error('Error fetching consultation request:', cError);
  else console.log('Consultation Request row returned:', cData[0] ? Object.keys(cData[0]) : 'No consultation requests in table');
}

run();
