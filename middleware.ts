import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // This will refresh the session token if active
  const { data: { user } } = await supabase.auth.getUser();

  let userRole = null;
  if (user) {
    if (user.email === 'admin@example.com') {
      userRole = 'admin';
    } else {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (data) {
        userRole = data.role;
      }
    }
  }

  const isAuthorizedAdmin = userRole === 'admin' || userRole === 'super_admin' || userRole === 'Super Admin';

  const isLoginPage = request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/admin/login';
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isAdminApiPath = request.nextUrl.pathname.startsWith('/api/admin');

  // Redirect legacy /admin/login to /auth/login
  if (request.nextUrl.pathname === '/admin/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Protect Admin API routes with 401/403 responses
  if (isAdminApiPath) {
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    if (!isAuthorizedAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
  }

  // Protect Admin page routes with redirects to the login screen or home
  if (isAdminPath && !isLoginPage) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    if (!isAuthorizedAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Redirect to dashboard if logged-in admin visits the login page
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    if (isAuthorizedAdmin) {
      url.pathname = '/admin/dashboard';
    } else {
      url.pathname = '/';
    }
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/auth/:path*'],
};
