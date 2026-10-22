import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtRole(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    if (parsed.exp && Date.now() >= parsed.exp * 1000) return null;
    return parsed.role || null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API endpoints
  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('lappy_auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }
    const role = decodeJwtRole(token);
    if (!role || role === 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges for admin operations' },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // Protect admin UI routes
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/login?from=/admin', request.url));
    }

    const token = request.cookies.get('lappy_auth_token')?.value;
    if (!token) {
      return NextResponse.redirect(
        new URL('/login?from=/admin&error=unauthorized', request.url)
      );
    }

    const role = decodeJwtRole(token);
    if (!role || role === 'CUSTOMER') {
      return NextResponse.redirect(
        new URL('/login?from=/admin&error=unauthorized', request.url)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
