import { getChatGPTUser } from '../chatgpt-auth';
import { isAdminEmail } from '../../db/equipment';

export async function authorizeAdminRequest() {
  const user = await getChatGPTUser();
  if (!user) return { error: Response.json({ error: 'Sign in is required.' }, { status: 401 }) };
  if (!isAdminEmail(user.email)) return { error: Response.json({ error: 'You do not have access to inventory management.' }, { status: 403 }) };
  return { user };
}
