import { neon } from '@neondatabase/serverless';

export function createSql(databaseUrl: string) {
  return neon(databaseUrl);
}

export async function ensureWaitlistTable(databaseUrl: string) {
  const sql = createSql(databaseUrl);

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email       TEXT UNIQUE NOT NULL,
      status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'active')),
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `;
}