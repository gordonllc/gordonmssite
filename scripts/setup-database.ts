import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
const { initializeDatabase } = await import('../db/bootstrap');
const { getPool } = await import('../db/connect');
try {
  await initializeDatabase();
  console.log('Gordon database is ready. Existing listings are preserved.');
} finally {
  await getPool().end();
}
