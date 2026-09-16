import { randomUUID } from 'node:crypto';
import { authorizeAdminRequest } from '../../../lib/admin';
import { readLimitedBody } from '../../../lib/request';
import { putImage, imageType } from '../../../lib/storage';

export const dynamic = 'force-dynamic';

const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.error) return auth.error;
  try {
    const bytes = await readLimitedBody(request, 9 * 1024 * 1024);
    const bounded = new Request(request.url, {
      method: 'POST', headers: { 'Content-Type': request.headers.get('content-type') || '' }, body: new Uint8Array(bytes),
    });
    const form = await bounded.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return Response.json({ error: 'Choose an image to upload.' }, { status: 400 });
    if (file.size > 8 * 1024 * 1024 || file.size === 0) return Response.json({ error: 'Images must be smaller than 8 MB and not empty.' }, { status: 400 });
    const contents = Buffer.from(await file.arrayBuffer());
    if (!extensions[file.type] || imageType(contents) !== file.type) return Response.json({ error: 'Upload a valid JPG, PNG, WebP or AVIF image.' }, { status: 400 });
    const key = `equipment/${randomUUID()}.${extensions[file.type]}`;
    await putImage(key, contents);
    return Response.json({ url: `/api/media/${key}` }, { status: 201 });
  } catch (error) {
    console.error('Photo upload failed.', error);
    return Response.json({ error: 'Unable to upload the image. Check App Storage setup or try a smaller image.' }, { status: 503 });
  }
}
