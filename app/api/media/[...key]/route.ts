import { getImage } from '../../../lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key: parts } = await context.params;
  const key = parts.join('/');
  if (!/^equipment\/[a-f0-9-]{36}\.(jpg|png|webp|avif)$/.test(key)) return new Response('Not found', { status: 404 });
  try {
    const bytes = await getImage(key);
    if (!bytes) return new Response('Not found', { status: 404 });
    const types: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif' };
    return new Response(new Uint8Array(bytes), { headers: {
      'Content-Type': types[key.split('.').pop()!], 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff',
    } });
  } catch { return new Response('Image storage is temporarily unavailable.', { status: 503 }); }
}
