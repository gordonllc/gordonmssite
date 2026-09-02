import { listEquipment } from '../../../db/equipment';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const featuredOnly = url.searchParams.get('featured') === '1';
  const requestedLimit = Number(url.searchParams.get('limit'));
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 24)
    : undefined;
  const items = await listEquipment({ featuredOnly, limit });
  return Response.json({ items }, { headers: { 'Cache-Control': 'no-store' } });
}
