import { authorizeAdminRequest } from '../../../lib/admin';
import { createEquipment, parseEquipmentInput } from '../../../../db/equipment';
import { readJsonBody } from '../../../lib/request';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const item = await createEquipment(parseEquipmentInput(await readJsonBody(request)));
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to add the machine.';
    const status = /unique|already exists/i.test(message) ? 409 : /^(Enter |Request |Use a JSON)/.test(message) ? 400 : 503;
    return Response.json({ error: status === 409 ? 'That listing URL is already in use.' : status === 400 ? message : 'Unable to save the machine. Please try again.' }, { status });
  }
}
