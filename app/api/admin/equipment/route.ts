import { authorizeAdminRequest } from '../../../lib/admin';
import { createEquipment, parseEquipmentInput } from '../../../../db/equipment';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest();
  if (auth.error) return auth.error;

  try {
    const item = await createEquipment(parseEquipmentInput(await request.json()));
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to add the machine.';
    const status = /unique|already exists/i.test(message) ? 409 : 400;
    return Response.json({ error: status === 409 ? 'That listing URL is already in use.' : message }, { status });
  }
}
