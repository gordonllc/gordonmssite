import { createHash, createHmac, scrypt, timingSafeEqual } from 'node:crypto';

export const SESSION_DURATION = 8 * 60 * 60;
export type AdminConfig = { email: string; passwordHash: string; secret: string };

export function adminConfig(): AdminConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const secret = process.env.SESSION_SECRET;
  if (!email || !passwordHash || !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(passwordHash) || !secret || secret.length < 32) return null;
  return { email, passwordHash, secret };
}

function sign(value: string, config: AdminConfig) {
  // Rotating either secret or password invalidates every existing session.
  return createHmac('sha256', config.secret).update(`${config.passwordHash}:${value}`).digest('base64url');
}

export function createSession(config: AdminConfig, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ email: config.email, exp: Math.floor(now / 1000) + SESSION_DURATION })).toString('base64url');
  return `${payload}.${sign(payload, config)}`;
}

export function verifySession(token: string | undefined, config: AdminConfig | null, now = Date.now()) {
  if (!token || token.length > 1_000 || !config) return null;
  try {
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;
    const actual = Buffer.from(signature, 'base64url');
    const expected = Buffer.from(sign(payload, config), 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: string; exp?: number };
    if (data.email !== config.email || !Number.isInteger(data.exp) || data.exp! <= Math.floor(now / 1000)) return null;
    return { email: config.email, fullName: 'Gordon Machinery Solutions' };
  } catch { return null; }
}

export async function verifyPassword(password: string, hash: string) {
  if (password.length > 256 || !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash)) return false;
  const [, salt, expected] = hash.split(':');
  const actual = await new Promise<Buffer>((resolve, reject) => scrypt(password, salt, 64,
    { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
    (error, value) => error ? reject(error) : resolve(value)));
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}

export function limitKey(namespace: string, value: string) {
  return `${namespace}:${createHash('sha256').update(value.toLowerCase().trim()).digest('hex')}`;
}
