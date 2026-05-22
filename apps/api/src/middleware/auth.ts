import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

type JWTPayload = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  iat: number;
  exp: number;
};

/**
 * Verifies a JWT signed with HS256 using the Web Crypto API (available in
 * Cloudflare Workers).  Throws 401 if the token is missing or invalid.
 */
async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  const [headerB64, payloadB64, sigB64] = token.split('.');
  if (!headerB64 || !payloadB64 || !sigB64) {
    throw new Error('malformed token');
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const signature = Uint8Array.from(atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')), (c) =>
    c.charCodeAt(0),
  );

  const valid = await crypto.subtle.verify('HMAC', key, signature, data);
  if (!valid) throw new Error('invalid signature');

  const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))) as JWTPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('token expired');
  }

  return payload;
}

type AuthEnv = {
  Variables: { user: JWTPayload };
  Bindings: { JWT_SECRET: string };
};

/**
 * Middleware that requires a valid Bearer JWT in the Authorization header.
 * Attaches the decoded payload to `c.var.user`.
 */
export async function authMiddleware(c: Context<AuthEnv>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    c.set('user', payload);
  } catch {
    throw new HTTPException(401, { message: 'Invalid or expired token' });
  }

  await next();
}
