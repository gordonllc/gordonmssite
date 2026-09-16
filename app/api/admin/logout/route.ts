import { NextResponse } from 'next/server';
import { cookieName, cookieOptions } from '../../../lib/auth';
import { sameOrigin } from '../../../lib/request';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const response = NextResponse.json({ signedOut: true });
  response.cookies.set(cookieName(), '', { ...cookieOptions(), maxAge: 0 });
  return response;
}
