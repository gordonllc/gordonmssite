import { env } from 'cloudflare:workers';
import { authorizeAdminRequest } from '../../../../lib/admin';
import { deleteEquipment, getEquipmentRecord, parseEquipmentInput, updateEquipment } from '../../../../../db/equipment';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await authorizeAdminRequest();
  if (auth.error) return auth.error;

  try {
    const { slug } = await context.params;
    const previous = await getEquipmentRecord(slug, false);
    if (!previous) return Response.json({ error: 'Equipment not found.' }, { status: 404 });
    const item = await updateEquipment(slug, parseEquipmentInput(await request.json()));
    if (!item) return Response.json({ error: 'Equipment not found.' }, { status: 404 });
    if (previous && env.FILES) {
      const staleKeys = [previous.image, previous.alternateImage]
        .filter((value): value is string => Boolean(value?.startsWith('/api/media/')))
        .filter((value) => value !== item.image && value !== item.alternateImage)
        .map((value) => decodeURIComponent(value.slice('/api/media/'.length)));
      if (staleKeys.length) await env.FILES.delete(staleKeys);
    }
    return Response.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update the machine.';
    const status = /unique|already exists/i.test(message) ? 409 : 400;
    return Response.json({ error: status === 409 ? 'That listing URL is already in use.' : message }, { status });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await authorizeAdminRequest();
  if (auth.error) return auth.error;
  const { slug } = await context.params;
  const item = await deleteEquipment(slug);
  if (!item) return Response.json({ error: 'Equipment not found.' }, { status: 404 });

  const uploadedKeys = [item.image, item.alternateImage]
    .filter((value): value is string => Boolean(value?.startsWith('/api/media/')))
    .map((value) => decodeURIComponent(value.slice('/api/media/'.length)));
  if (uploadedKeys.length && env.FILES) await env.FILES.delete(uploadedKeys);

  return Response.json({ deleted: true });
}
