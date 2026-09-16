import { siteUrl } from './site-url';

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  if (origin === siteUrl()) return true;
  // Allow the Replit editor preview as well as the configured public domain.
  if (process.env.REPLIT_DEPLOYMENT !== '1' && process.env.REPLIT_DEV_DOMAIN && origin === `https://${process.env.REPLIT_DEV_DOMAIN}`) return true;
  if (process.env.NODE_ENV !== 'production') {
    try {
      const url = new URL(origin);
      return ['localhost', '127.0.0.1'].includes(url.hostname) && origin === new URL(request.url).origin;
    } catch { return false; }
  }
  return false;
}

export async function readLimitedBody(request: Request, maxBytes: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Request body is required.');
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) { await reader.cancel(); throw new Error('Request is too large.'); }
    chunks.push(value);
  }
  return Buffer.concat(chunks, length);
}

export async function readJsonBody(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new Error('Use a JSON request.');
  const body = await readLimitedBody(request, 16 * 1024);
  try { return JSON.parse(body.toString('utf8')) as unknown; }
  catch { throw new Error('Request is not valid JSON.'); }
}
