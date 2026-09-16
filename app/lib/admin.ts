import { getAdminUser } from './auth';
import { sameOrigin } from './request';

export async function authorizeAdminRequest(request: Request) {
  if (!sameOrigin(request)) return { error: Response.json({ error: 'Request origin is not allowed.' }, { status: 403 }) };
  const user = await getAdminUser();
  if (!user) return { error: Response.json({ error: 'Sign in is required.' }, { status: 401 }) };
  return { user };
}
