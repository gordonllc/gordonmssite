import { env } from 'cloudflare:workers';
import { authorizeAdminRequest } from '../../../lib/admin';

export const dynamic = 'force-dynamic';

const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest();
  if (auth.error) return auth.error;
  if (!env.FILES) return Response.json({ error: 'Image storage is unavailable.' }, { status: 503 });

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Choose an image to upload.' }, { status: 400 });
  if (!extensions[file.type]) return Response.json({ error: 'Upload a JPG, PNG, WebP or AVIF image.' }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return Response.json({ error: 'Images must be smaller than 8 MB.' }, { status: 400 });

  const key = `equipment/${crypto.randomUUID()}.${extensions[file.type]}`;
  await env.FILES.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: { uploadedBy: auth.user.email },
  });
  return Response.json({ url: `/api/media/${key}` }, { status: 201 });
}
