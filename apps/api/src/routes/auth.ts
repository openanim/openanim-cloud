import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

type Bindings = {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
};

type GoogleTokenResponse = {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
};

/**
 * Signs a JWT with HS256 using the Web Crypto API.
 */
async function signJWT(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds = 60 * 60 * 24 * 7, // 7 days
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const headerB64 = encode(header);
  const payloadB64 = encode(fullPayload);

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const sigBuffer = await crypto.subtle.sign('HMAC', key, data);
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${headerB64}.${payloadB64}.${sigB64}`;
}

export const authRouter = new Hono<{ Bindings: Bindings }>();

/**
 * POST /auth/google
 * Exchange a Google OAuth authorization code for an API JWT.
 * Body: { code: string, redirect_uri: string }
 */
authRouter.post('/google', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as {
    code?: string;
    redirect_uri?: string;
  };

  if (!body.code || !body.redirect_uri) {
    throw new HTTPException(400, { message: 'Missing code or redirect_uri' });
  }

  // Exchange the authorization code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: body.code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: body.redirect_uri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error('Google token exchange failed:', err);
    throw new HTTPException(502, { message: 'Failed to exchange Google code' });
  }

  const tokens = (await tokenRes.json()) as GoogleTokenResponse;

  // Fetch user info
  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) {
    throw new HTTPException(502, { message: 'Failed to fetch Google user info' });
  }

  const user = (await userRes.json()) as GoogleUserInfo;

  if (!user.email_verified) {
    throw new HTTPException(403, { message: 'Google account email not verified' });
  }

  // Issue an API JWT
  const jwt = await signJWT(
    { sub: user.sub, email: user.email, name: user.name, picture: user.picture },
    c.env.JWT_SECRET,
  );

  return c.json({
    token: jwt,
    user: { id: user.sub, email: user.email, name: user.name, picture: user.picture },
  });
});

/**
 * GET /auth/me
 * Returns current user from a JWT (for verification).
 * This is intentionally left lightweight — real auth validation
 * is done by the authMiddleware on protected routes.
 */
authRouter.get('/me', async (c) => {
  return c.json({ message: 'Use Authorization: Bearer <token> on protected routes' });
});
