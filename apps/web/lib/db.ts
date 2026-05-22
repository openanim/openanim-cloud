import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email       TEXT UNIQUE NOT NULL,
      status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'active')),
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `;
}

export { sql };
