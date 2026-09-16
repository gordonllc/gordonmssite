import { cookies } from 'next/headers';
import { adminConfig, verifySession } from './session';

export const cookieName = () => process.env.NODE_ENV === 'production' ? '__Host-gordon_admin' : 'gordon_admin';

export async function getAdminUser() {
  const jar = await cookies();
  return verifySession(jar.get(cookieName())?.value, adminConfig());
}

export const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
});
