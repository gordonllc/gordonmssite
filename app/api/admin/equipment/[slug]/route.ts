import { authorizeAdminRequest } from '../../../../lib/admin';
import { readJsonBody } from '../../../../lib/request';
import { deleteEquipment, getEquipmentRecord, parseEquipmentInput, updateEquipment } from '../../../../../db/equipment';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await authorizeAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const { slug } = await context.params;
    const previous = await getEquipmentRecord(slug, false);
    if (!previous) return Response.json({ error: 'Equipment not found.' }, { status: 404 });
    const item = await updateEquipment(slug, parseEquipmentInput(await readJsonBody(request)));
    if (!item) return Response.json({ error: 'Equipment not found.' }, { status: 404 });
    // Retain uploads: another listing may still reference the same photograph.
    return Response.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update the machine.';
    const status = /unique|already exists/i.test(message) ? 409 : /^(Enter |Request |Use a JSON)/.test(message) ? 400 : 503;
    return Response.json({ error: status === 409 ? 'That listing URL is already in use.' : status === 400 ? message : 'Unable to update the machine. Please try again.' }, { status });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await authorizeAdminRequest(request);
  if (auth.error) return auth.error;
  try {
    const { slug } = await context.params;
    const item = await deleteEquipment(slug);
    if (!item) return Response.json({ error: 'Equipment not found.' }, { status: 404 });
    return Response.json({ deleted: true });
  } catch {
    return Response.json({ error: 'Unable to remove the listing. Please try again.' }, { status: 503 });
  }
}
