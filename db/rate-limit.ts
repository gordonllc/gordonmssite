import type { Pool } from 'pg';
import { getPool } from './connect';
import { initializeDatabase } from './bootstrap';

export async function consumeLimit(key: string, max: number, windowMs: number) {
  await initializeDatabase();
  return consumeLimitWithPool(getPool(), key, max, windowMs);
}

export async function consumeLimitWithPool(pool: Pool, key: string, max: number, windowMs: number, now = Date.now()) {
  await pool.query('DELETE FROM request_limits WHERE reset_at < $1', [now - 24 * 60 * 60 * 1000]);
  const result = await pool.query(`INSERT INTO request_limits (key, count, reset_at)
    VALUES ($1, 1, $3) ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN request_limits.reset_at <= $2 THEN 1 ELSE request_limits.count + 1 END,
      reset_at = CASE WHEN request_limits.reset_at <= $2 THEN $3 ELSE request_limits.reset_at END
    RETURNING count`, [key, now, now + windowMs]);
  return Number(result.rows[0].count) <= max;
}
