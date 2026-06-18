import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const results: any = {};
  
  // 1. Supabase Connection Test
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    results.supabase_connection = {
      success: !error,
      error: error ? {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      } : null,
      data: data || null
    };
  } catch (err: any) {
    results.supabase_connection = {
      success: false,
      error: { message: err?.message || 'Unexpected exception' }
    };
  }
  
  // 2. Auth SignUp Test
  const timestamp = Date.now();
  const testEmail = `debug_test_${timestamp}@example.com`;
  const testPassword = 'Password123!';
  const testFullName = 'Debug Test User';
  
  try {
    const supabase = createServerClient();
    
    console.log(`[DEBUG AUTH API] Starting auth.signUp() test with email: ${testEmail}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testFullName
        }
      }
    });
    
    console.log('[DEBUG AUTH API] signUp response:', { authData, authError });
    
    results.auth_signup = {
      success: !authError,
      error: authError ? {
        message: authError.message,
        status: authError.status
      } : null,
      data: authData ? {
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          role: authData.user.role,
          user_metadata: authData.user.user_metadata
        } : null,
        session: authData.session
      } : null
    };
    
    // 3. Profiles Insert Test
    if (!authError && authData.user) {
      console.log(`[DEBUG AUTH API] Querying profile for created user ID: ${authData.user.id}`);
      // Wait for a short delay or query directly to see if trigger worked
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();
        
      console.log('[DEBUG AUTH API] profile trigger query result:', { profileData, profileError });
      
      results.profile_trigger_check = {
        exists: !!profileData,
        error: profileError ? {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details
        } : null,
        data: profileData || null
      };
      
      // Attempt manual insert to test RLS policies directly
      console.log(`[DEBUG AUTH API] Attempting manual profile insert for user ID: ${authData.user.id}`);
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: testEmail,
          full_name: testFullName,
          role: 'user'
        } as any)
        .select()
        .maybeSingle();
        
      console.log('[DEBUG AUTH API] manual profiles insert response:', { insertData, insertError });
      
      results.profile_insert_test = {
        success: !insertError,
        error: insertError ? {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        } : null,
        data: insertData || null
      };
    } else {
      results.profile_trigger_check = {
        skipped: true,
        message: 'Auth signup failed or no user returned'
      };
      results.profile_insert_test = {
        skipped: true,
        message: 'Auth signup failed or no user returned'
      };
    }
    
  } catch (err: any) {
    console.error('[DEBUG AUTH API EXCEPTION] Unexpected error during signup test:', err);
    results.auth_signup = {
      success: false,
      error: { message: err?.message || 'Unexpected exception' }
    };
  }
  
  return NextResponse.json(results);
}
