import type { Pool } from 'pg';
import { getPool } from './connect';
import { equipment } from '../app/data/equipment';

const state = globalThis as typeof globalThis & { gordonSchemaReady?: Promise<void> };

export function initializeDatabase() {
  return state.gordonSchemaReady ??= bootstrapDatabase(getPool()).catch((error) => {
    state.gordonSchemaReady = undefined;
    throw error;
  });
}

export async function bootstrapDatabase(pool: Pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serialize initialization across instances, not just within one process.
    await client.query('SELECT pg_advisory_xact_lock(73924185)');
    await client.query(`CREATE TABLE IF NOT EXISTS equipment_items (
      id SERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, year INTEGER NOT NULL,
      make TEXT NOT NULL, model TEXT NOT NULL, title TEXT NOT NULL,
      category TEXT NOT NULL, price INTEGER NOT NULL, hours INTEGER,
      availability TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Available',
      image TEXT NOT NULL, alternate_image TEXT, alt TEXT NOT NULL,
      description TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    )`);
    await client.query('CREATE INDEX IF NOT EXISTS idx_equipment_published_sort ON equipment_items (published, sort_order)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment_items (status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment_items (category)');
    await client.query(`CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, company TEXT, phone TEXT NOT NULL,
      email TEXT NOT NULL, interest TEXT NOT NULL, equipment_slug TEXT,
      equipment_title TEXT, message TEXT NOT NULL, source_page TEXT NOT NULL DEFAULT '/',
      status TEXT NOT NULL DEFAULT 'New', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    )`);
    await client.query('CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON inquiries (status, created_at)');
    await client.query('CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
    await client.query(`CREATE TABLE IF NOT EXISTS request_limits (
      key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at BIGINT NOT NULL
    )`);
    await client.query('CREATE INDEX IF NOT EXISTS idx_request_limits_reset ON request_limits (reset_at)');
    const marker = await client.query("SELECT key FROM app_state WHERE key = 'inventory_seed_v1'");
    if (!marker.rows.length) {
      const now = new Date().toISOString();
      for (const [index, item] of equipment.entries()) {
        await client.query(`INSERT INTO equipment_items (
          slug, year, make, model, title, category, price, hours, availability,
          status, image, alternate_image, alt, description, featured, published,
          sort_order, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,1,$16,$17,$18)
        ON CONFLICT (slug) DO NOTHING`, [
          item.slug, item.year, item.make, item.model, item.title, item.category,
          item.price, item.hours, item.availability, item.status, item.image,
          item.alternateImage ?? null, item.alt, item.description,
          item.featured ? 1 : 0, equipment.length - index, now, now,
        ]);
      }
      await client.query("INSERT INTO app_state (key, value) VALUES ('inventory_seed_v1', 'complete')");
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
