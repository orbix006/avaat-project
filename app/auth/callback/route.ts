import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, pathname } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  console.log(`[AUTH CALLBACK] Received callback request. Path: ${pathname}, Code: ${code ? 'Present' : 'Absent'}, Next: ${next}`);

  if (code) {
    const supabase = createServerClient();
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('[AUTH CALLBACK ERROR] Failed to exchange code for session:', error);
      } else {
        console.log('[AUTH CALLBACK SUCCESS] Code successfully exchanged for session.');
      }
    } catch (err) {
      console.error('[AUTH CALLBACK EXCEPTION] Unexpected error during code exchange:', err);
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
