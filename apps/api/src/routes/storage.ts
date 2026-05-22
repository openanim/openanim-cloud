import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { authMiddleware } from '../middleware/auth';
import type { PresignRequest, PresignResponse } from '@openanim/shared';

type Bindings = {
  ASSETS_BUCKET: R2Bucket;
  JWT_SECRET: string;
};

type Variables = {
  user: { sub: string; email: string };
};

export const storageRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// All storage routes require authentication
storageRouter.use('*', authMiddleware as Parameters<typeof storageRouter.use>[1]);

/**
 * POST /storage/presign
 * Returns a short-lived presigned URL for uploading a file to R2.
 *
 * Note: Cloudflare R2 via Workers Binding doesn't use presigned URLs in the
 * traditional S3 sense — uploads happen through the Worker itself. This endpoint
 * returns an upload token that the client uses to POST to /storage/upload.
 *
 * Body: { filename: string, contentType: string }
 */
storageRouter.post('/presign', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Partial<PresignRequest>;

  if (!body.filename || !body.contentType) {
    throw new HTTPException(400, { message: 'Missing filename or contentType' });
  }

  const user = c.get('user');
  const ext = body.filename.split('.').pop() ?? 'bin';
  const key = `uploads/${user.sub}/${crypto.randomUUID()}.${ext}`;

  // Generate a short-lived upload token (signed, 15 min TTL)
  const tokenPayload = {
    key,
    contentType: body.contentType,
    userId: user.sub,
    exp: Math.floor(Date.now() / 1000) + 15 * 60,
  };

  // Encode token as a simple base64 JSON (in production: sign this with JWT_SECRET)
  const uploadToken = btoa(JSON.stringify(tokenPayload));

  const payload: PresignResponse = {
    uploadToken,
    key,
    // The upload URL points back to this worker's /storage/upload endpoint
    uploadUrl: `${new URL(c.req.url).origin}/storage/upload`,
    expiresAt: new Date(tokenPayload.exp * 1000).toISOString(),
  };

  return c.json(payload);
});

/**
 * PUT /storage/upload
 * Receives the file binary and stores it in R2.
 * Header: X-Upload-Token: <token from /presign>
 */
storageRouter.put('/upload', async (c) => {
  const token = c.req.header('X-Upload-Token');
  if (!token) {
    throw new HTTPException(400, { message: 'Missing X-Upload-Token header' });
  }

  let tokenPayload: { key: string; contentType: string; userId: string; exp: number };
  try {
    tokenPayload = JSON.parse(atob(token));
  } catch {
    throw new HTTPException(400, { message: 'Invalid upload token' });
  }

  if (tokenPayload.exp < Math.floor(Date.now() / 1000)) {
    throw new HTTPException(410, { message: 'Upload token expired' });
  }

  const body = await c.req.arrayBuffer();
  if (!body || body.byteLength === 0) {
    throw new HTTPException(400, { message: 'Empty file body' });
  }

  await c.env.ASSETS_BUCKET.put(tokenPayload.key, body, {
    httpMetadata: { contentType: tokenPayload.contentType },
    customMetadata: { uploadedBy: tokenPayload.userId },
  });

  return c.json({
    success: true,
    key: tokenPayload.key,
    size: body.byteLength,
  });
});

/**
 * DELETE /storage/object/:key
 * Deletes an object from R2. Only the owner can delete their files.
 */
storageRouter.delete('/object/:key', async (c) => {
  const key = c.req.param('key');
  const user = c.get('user');

  // Enforce ownership — key must start with uploads/{userId}/
  if (!key.startsWith(`uploads/${user.sub}/`)) {
    throw new HTTPException(403, { message: 'Forbidden: not your file' });
  }

  await c.env.ASSETS_BUCKET.delete(key);
  return c.json({ success: true, key });
});
