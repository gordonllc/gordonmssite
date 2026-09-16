import { Pool } from 'pg';

const state = globalThis as typeof globalThis & { gordonPool?: Pool };

export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL in Replit Secrets to enable saved inventory and inquiries.');
  return state.gordonPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 8_000,
    idleTimeoutMillis: 30_000,
  });
}

// This small prepared-statement interface keeps the existing editor's queries
// parameterized while moving their execution from D1 to PostgreSQL.
export function database() {
  return createDatabase(getPool());
}

export function createDatabase(pool: Pool) {
  function prepare(sql: string) {
    let index = 0;
    const text = sql.replace(/\?/g, () => `$${++index}`);
    function statement(values: unknown[] = []) {
      return {
        text,
        values,
        bind: (...bound: unknown[]) => statement(bound),
        async all<T>() {
          const result = await pool.query(text, values);
          return { results: result.rows as T[] };
        },
        async first<T>() {
          const result = await pool.query(text, values);
          return (result.rows[0] as T | undefined) ?? null;
        },
        async run() {
          const result = await pool.query(text, values);
          return { meta: { changes: result.rowCount ?? 0 } };
        },
      };
    }
    return statement();
  }
  return {
    prepare,
    async batch(statements: Array<{ text: string; values: unknown[] }>) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const statement of statements) await client.query(statement.text, statement.values);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
