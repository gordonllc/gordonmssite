import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scryptSync } from 'node:crypto';
import { DataType, newDb } from 'pg-mem';
import type { Pool } from 'pg';
import { bootstrapDatabase } from '../db/bootstrap';
import { consumeLimitWithPool } from '../db/rate-limit';
import { equipment } from '../app/data/equipment';
import { createEquipment, deleteEquipment, listEquipment, updateEquipment } from '../db/equipment';
import { createInquiry, listInquiries, updateInquiryStatus } from '../db/inquiries';
import { createSession, verifySession, verifyPassword, type AdminConfig } from '../app/lib/session';
import { readJsonBody, sameOrigin } from '../app/lib/request';
import { imageType } from '../app/lib/storage';

test('PostgreSQL migration: seed once, inventory CRUD, inquiries and limits', async () => {
  // pg-mem's AST coverage checker rejects a repeated CREATE IF NOT EXISTS,
  // even though the table constraints were applied on the first bootstrap.
  const memory = newDb({ noAstCoverageCheck: true });
  memory.public.registerFunction({ name: 'pg_advisory_xact_lock', args: [DataType.integer], returns: DataType.integer, implementation: () => 0 });
  const Adapter = memory.adapters.createPg();
  const pool = new Adapter.Pool() as Pool;
  process.env.DATABASE_URL = 'postgresql://test-only';
  const state = globalThis as typeof globalThis & { gordonPool?: Pool; gordonSchemaReady?: Promise<void> };
  state.gordonPool = pool;
  state.gordonSchemaReady = undefined;
  try {
    await bootstrapDatabase(pool);
    await bootstrapDatabase(pool);
    assert.equal((await listEquipment()).length, equipment.length);
    const deleted = equipment[0];
    await deleteEquipment(deleted.slug);
    await bootstrapDatabase(pool);
    assert.equal((await listEquipment()).some((item) => item.slug === deleted.slug), false, 'deleted seeds must not reappear');
    const created = await createEquipment({ ...deleted, slug: 'test-machine', featured: true, published: false, sortOrder: 100 });
    assert.equal((await listEquipment()).some((item) => item.slug === created.slug), false);
    assert.equal((await listEquipment({ publishedOnly: false })).some((item) => item.slug === created.slug), true);
    await updateEquipment(created.slug, { ...created, price: 100_000, featured: true, published: true, sortOrder: 100 });
    assert.equal((await listEquipment()).find((item) => item.slug === created.slug)?.price, 100_000);
    await assert.rejects(createEquipment({ ...created, featured: false, published: true, sortOrder: 0 }));
    const input = { name: 'Test customer', company: null, phone: '', email: 'customer@example.invalid', interest: 'Equipment rental', equipmentSlug: null, equipmentTitle: null, message: 'Test request only', sourcePage: '/rentals' };
    const inquiry = await createInquiry(input);
    assert.ok(inquiry.id > 0);
    assert.equal((await createInquiry(input)).id, inquiry.id, 'immediate duplicates must reuse the saved inquiry');
    await updateInquiryStatus(inquiry.id, 'Contacted');
    assert.equal((await listInquiries())[0].status, 'Contacted');
    for (let i = 0; i < 3; i++) assert.equal(await consumeLimitWithPool(pool, 'test-limit', 3, 1000, 1000), true);
    assert.equal(await consumeLimitWithPool(pool, 'test-limit', 3, 1000, 1000), false);
    assert.equal(await consumeLimitWithPool(pool, 'test-limit', 3, 1000, 2001), true);
  } finally {
    state.gordonPool = undefined; state.gordonSchemaReady = undefined;
    delete process.env.DATABASE_URL;
    await pool.end();
  }
});

test('sessions reject tampering, expiry, missing configuration and rotated credentials', () => {
  const config: AdminConfig = { email: 'admin@example.invalid', passwordHash: 'test-hash', secret: 'a'.repeat(64) };
  const now = 1_000_000;
  const token = createSession(config, now);
  assert.equal(verifySession(token, config, now)?.email, config.email);
  assert.equal(verifySession(token + 'x', config, now), null);
  assert.equal(verifySession(token, config, now + 9 * 60 * 60 * 1000), null);
  assert.equal(verifySession(token, null, now), null);
  assert.equal(verifySession(token, { ...config, passwordHash: 'rotated' }, now), null);
  assert.equal(verifySession(token, { ...config, secret: 'b'.repeat(64) }, now), null);
});

test('password hashes verify without accepting incorrect or malformed input', async () => {
  const salt = 'a'.repeat(32);
  const password = 'test-password-not-a-real-credential';
  const digest = scryptSync(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString('hex');
  const hash = `scrypt:${salt}:${digest}`;
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('wrong', hash), false);
  assert.equal(await verifyPassword(password, 'invalid'), false);
});

test('cross-origin requests and oversized JSON are rejected', async () => {
  process.env.APP_URL = 'https://gordon.example.invalid';
  assert.equal(sameOrigin(new Request('https://gordon.example.invalid/api/admin/login', { headers: { Origin: 'https://other.example.invalid' } })), false);
  assert.equal(sameOrigin(new Request('https://gordon.example.invalid/api/admin/login', { headers: { Origin: 'https://gordon.example.invalid' } })), true);
  assert.equal(sameOrigin(new Request('https://gordon.example.invalid/api/admin/login')), false);
  await assert.rejects(readJsonBody(new Request('https://gordon.example.invalid', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: 'x'.repeat(20_000) }) })));
  delete process.env.APP_URL;
  const previousPort = process.env.PORT;
  process.env.PORT = '3090';
  assert.equal(sameOrigin(new Request('http://0.0.0.0:3090/api/admin/login', { headers: { Origin: 'http://localhost:3090' } })), true);
  if (previousPort === undefined) delete process.env.PORT;
  else process.env.PORT = previousPort;
});

test('uploads reject HTML masquerading as an image', () => {
  assert.equal(imageType(Buffer.from('<html>not an image</html>')), null);
  assert.equal(imageType(Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0])), 'image/png');
});
