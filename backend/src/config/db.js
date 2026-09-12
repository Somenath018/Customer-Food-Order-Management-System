import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

let pool = null;
let isPgConnected = false;

try {
  pool = new Pool({
    connectionString: config.databaseUrl,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 10000
  });

  // Test connection silently
  pool.connect((err, client, release) => {
    if (err) {
      console.log('ℹ️  PostgreSQL not reachable at ' + config.databaseUrl + ' -> Running with resilient in-memory/persistent fallback datastore.');
      isPgConnected = false;
    } else {
      console.log('✅ Connected to PostgreSQL database successfully!');
      isPgConnected = true;
      release();
    }
  });
} catch (error) {
  console.log('ℹ️  PostgreSQL client initialization: fallback store active.');
}

export const query = async (text, params) => {
  if (!isPgConnected || !pool) {
    return null;
  }
  return pool.query(text, params);
};

export const getPgStatus = () => ({
  isConnected: isPgConnected,
  databaseUrl: config.databaseUrl
});

export default pool;
