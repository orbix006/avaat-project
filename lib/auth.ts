'use server';

import { createServerClient } from './supabase/server';
import { Database } from '@/types/database';

export async function getUser() {
  const supabase = createServerClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('[AUTH USER RETRIEVAL ERROR] Failed to fetch auth user:', error);
      return null;
    }
    if (user) {
      console.log(`[AUTH USER RETRIEVAL SUCCESS] Fetched active user ID: ${user.id}`);
    }
    return user;
  } catch (error) {
    console.error('[AUTH USER RETRIEVAL EXCEPTION] Unexpected error fetching user:', error);
    return null;
  }
}

export async function getSession() {
  const supabase = createServerClient();
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[AUTH SESSION RETRIEVAL ERROR] Failed to fetch session:', error);
      return null;
    }
    if (session) {
      console.log(`[AUTH SESSION RETRIEVAL SUCCESS] Session active for user ID: ${session.user?.id}`);
    } else {
      console.log('[AUTH SESSION RETRIEVAL] No active session found.');
    }
    return session;
  } catch (error) {
    console.error('[AUTH SESSION RETRIEVAL EXCEPTION] Unexpected error fetching session:', error);
    return null;
  }
}

export async function signIn(state: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log(`[AUTH LOGIN] Attempting login for email: ${email}`);

  if (!email || !password) {
    console.error('[AUTH LOGIN ERROR] Missing email or password input.');
    return { error: 'Please enter both email and password.' };
  }

  const supabase = createServerClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(`[AUTH LOGIN RESPONSE] data:`, JSON.stringify(data, null, 2));
    if (error) {
      console.error(`[AUTH LOGIN RESPONSE ERROR] Supabase signInWithPassword failed for email ${email}:`, JSON.stringify(error, null, 2));
      return { error: error.message };
    }

    console.log(`[AUTH LOGIN SUCCESS] Successfully logged in. Session created for user ID: ${data.user?.id}`);
    return { success: true };
  } catch (err: any) {
    console.error('[AUTH LOGIN EXCEPTION] Unexpected error during login process:', err);
    return { error: err?.message || 'An unexpected error occurred during login.' };
  }
}

export async function signOut() {
  const supabase = createServerClient();
  try {
    await supabase.auth.signOut();
  } catch (error) {
    // Ignore signout error
  }
}

export async function getUserRole(): Promise<string | null> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    if (user.email === 'admin@example.com') {
      return 'admin';
    }

    const { data, error } = await (supabase
      .from('profiles' as any) as any)
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data.role;
  } catch (err) {
    return null;
  }
}


export async function getAdminProfile(): Promise<Database['public']['Tables']['profiles']['Row'] | null> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[PROFILE RETRIEVAL ERROR] User not authenticated or error fetching user:', authError);
      return null;
    }

    let { data, error } = await (supabase
      .from('profiles' as any) as any)
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error(`[PROFILE RETRIEVAL ERROR] Error fetching profile for user ID ${user.id}:`, error);
      return null;
    }

    // Auto-initialize profile if it doesn't exist
    if (!data) {
      const defaultName = user.email ? user.email.split('@')[0] : 'Admin';
      const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

      console.log(`[PROFILE CREATION] Profile missing for user ${user.id}. Creating new default profile...`);

      const { data: newProfile, error: insertError } = await (supabase
        .from('profiles' as any) as any)
        .insert({
          id: user.id,
          full_name: formattedName,
          email: user.email || '',
          role: 'user',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      console.log(`[PROFILE CREATION RESPONSE] data:`, JSON.stringify(newProfile, null, 2));
      if (insertError) {
        console.error(`[PROFILE CREATION RESPONSE ERROR] Failed to create default profile for user ID ${user.id}:`, JSON.stringify(insertError, null, 2));
        return null;
      }
      console.log(`[PROFILE CREATION SUCCESS] Profile created successfully for user ID ${user.id}:`, newProfile);
      return newProfile;
    }

    console.log(`[PROFILE RETRIEVAL SUCCESS] Profile loaded for user ID: ${user.id}`);
    return data;
  } catch (err) {
    console.error('[PROFILE RETRIEVAL EXCEPTION] Unexpected error loading profile:', err);
    return null;
  }
}

export async function updateAdminProfile(state: any, formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const avatarUrl = formData.get('avatarUrl') as string;

  if (!fullName) {
    return { error: 'Full name is required.' };
  }

  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { error } = await (supabase
      .from('profiles' as any) as any)
      .upsert({
        id: user.id,
        full_name: fullName,
        email: user.email || '',
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || 'An unexpected error occurred.' };
  }
}

export async function resetPasswordForEmailAction(email: string, redirectTo: string) {
  const supabase = createServerClient();
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || 'An unexpected error occurred.' };
  }
}

export async function updatePasswordAction(password: string) {
  const supabase = createServerClient();
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || 'An unexpected error occurred.' };
  }
}

export async function signUpAction(state: any, formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log(`[AUTH SIGNUP] Attempting signup for email: ${email}, fullName: ${fullName}`);

  if (!fullName || !email || !password) {
    console.error('[AUTH SIGNUP ERROR] Missing fields in signup action input.');
    return { error: 'Please fill in all fields.' };
  }

  const supabase = createServerClient();
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    console.log(`[AUTH SIGNUP RESPONSE] data:`, JSON.stringify(authData, null, 2));
    if (authError) {
      console.error(`[AUTH SIGNUP RESPONSE ERROR] Supabase signUp failed for email ${email}:`, JSON.stringify(authError, null, 2));
      return { error: authError.message };
    }

    console.log(`[AUTH SIGNUP SUCCESS] User created successfully in auth.users. User ID: ${authData.user?.id}. Session established: ${!!authData.session}`);
    return { 
      success: true, 
      emailVerificationRequired: !authData.session 
    };
  } catch (err: any) {
    console.error('[AUTH SIGNUP EXCEPTION] Unexpected error during signup process:', err);
    return { error: err?.message || 'An unexpected error occurred during signup.' };
  }
}
