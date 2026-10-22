import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('lappy_auth_token');

  const accept = req.headers.get('accept') || '';
  const contentType = req.headers.get('content-type') || '';
  if (accept.includes('text/html') || contentType.includes('application/x-www-form-urlencoded')) {
    return NextResponse.redirect(new URL('/login', req.url), 303);
  }

  return NextResponse.json({ success: true });
}
