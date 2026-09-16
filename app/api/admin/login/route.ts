import { NextResponse } from 'next/server';
import { adminConfig, createSession, SESSION_DURATION, verifyPassword } from '../../../lib/session';
import { cookieName, cookieOptions } from '../../../lib/auth';
import { readJsonBody, sameOrigin } from '../../../lib/request';
import { consumeLimit } from '../../../../db/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const config = adminConfig();
  if (!config) return Response.json({ error: 'Admin access has not been configured.' }, { status: 503 });
  try {
    const raw = await readJsonBody(request);
    const body = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
    if (!await consumeLimit('admin-login', 10, 15 * 60 * 1000)) {
      return Response.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
    }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const valid = await verifyPassword(password, config.passwordHash);
    if (!valid || email !== config.email) return Response.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    const response = NextResponse.json({ signedIn: true }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(cookieName(), createSession(config), { ...cookieOptions(), maxAge: SESSION_DURATION });
    return response;
  } catch (error) {
    console.error('Admin login unavailable.', error);
    return Response.json({ error: 'Sign-in is temporarily unavailable. Check the database setup or try again.' }, { status: 503 });
  }
}
