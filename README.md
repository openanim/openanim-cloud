# OpenAnim Cloud

OpenAnim Cloud is moving to a monorepo while keeping the current landing page intact.

## Structure

- `.` - Next.js landing page and marketing site
- `apps/api` - Hono backend for waitlist, auth, and Cloudflare R2 access
- `packages/shared` - shared API contracts and types

## Development

- `npm run dev` - start the Next.js landing page
- `npm run dev:api` - start the Hono backend on port `8787`
- `npm run build` - build the Next.js app
- `npm run build:api` - typecheck the backend workspace

## Environment

Copy `.env.example` and set:

- `DATABASE_URL` for the backend
- `NEXT_PUBLIC_API_URL` for the frontend waitlist form
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for future auth work

## Next Steps

The current landing page stays in place for now. The next implementation step is wiring Google auth into the backend and adding R2 upload endpoints behind the Hono API.
