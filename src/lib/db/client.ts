import { createClient } from '@libsql/client';

const url = import.meta.env.VITE_TURSO_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error('Database configuration missing');
}

export const db = createClient({
  url,
  authToken
});

export async function initializeDatabase() {
  try {
    await db.execute(schema);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}