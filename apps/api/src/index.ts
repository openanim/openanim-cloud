import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { ApiHealth, WaitlistRequest, WaitlistResponse } from '@openanim/shared';
import { createSql, ensureWaitlistTable } from './db';
import { authRouter } from './routes/auth';
import { storageRouter } from './routes/storage';

type Bindings = {
  DATABASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
  ASSETS_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors({ origin: '*' }));

// ── Health ──────────────────────────────────────────────────────────────────
app.get('/health', (c) => {
  const payload: ApiHealth = {
    ok: true,
    service: 'openanim-api',
    timestamp: new Date().toISOString(),
  };

  return c.json(payload);
});

// ── Waitlist ─────────────────────────────────────────────────────────────────
app.post('/waitlist', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Partial<WaitlistRequest>;
  const email = (body.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    const payload: WaitlistResponse = {
      success: false,
      error: 'Invalid email address.',
      status: 'invalid',
    };

    return c.json(payload, 400);
  }

  await ensureWaitlistTable(c.env.DATABASE_URL);

  try {
    const sql = createSql(c.env.DATABASE_URL);
    await sql`INSERT INTO waitlist (email) VALUES (${email})`;

    const payload: WaitlistResponse = {
      success: true,
      message: "You're on the list. We'll reach out before launch.",
    };

    return c.json(payload);
  } catch (error: unknown) {
    const pgError = error as { code?: string };

    if (pgError.code === '23505') {
      const payload: WaitlistResponse = {
        success: false,
        error: "You're already on the waitlist.",
        status: 'duplicate',
      };

      return c.json(payload, 409);
    }

    console.error('Waitlist error:', error);

    const payload: WaitlistResponse = {
      success: false,
      error: 'Something went wrong. Try again.',
      status: 'error',
    };

    return c.json(payload, 500);
  }
});

// ── Auth routes ───────────────────────────────────────────────────────────────
// POST /auth/google  — exchange Google OAuth code for API JWT
// GET  /auth/me      — info stub
app.route('/auth', authRouter);

// ── Storage routes ────────────────────────────────────────────────────────────
// POST   /storage/presign      — get upload token + URL (requires Bearer JWT)
// PUT    /storage/upload       — upload file to R2 (requires X-Upload-Token)
// DELETE /storage/object/:key  — delete a file (requires Bearer JWT)
app.route('/storage', storageRouter);

export default app;