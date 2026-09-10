# Trust.Me

Premium verified social + asset network built with Next.js, Auth.js, Prisma and PostgreSQL.

## Shared social backend

The social graph is server-backed. User identity, public profiles, follows, posts, conversations and messages do not use browser storage as their source of truth.

### Required production environment

Set `DATABASE_URL` to a PostgreSQL connection string in Vercel and locally. Neon, Supabase, Prisma Postgres and other PostgreSQL providers are supported by Prisma.

Then run:

```bash
npm install
npm run db:deploy
npm run build
```

Vercel installs dependencies and runs `prisma generate` through `postinstall`; the migration is intentionally explicit through `npm run db:deploy` so database changes are not silently applied by a frontend build.

For media, the upload endpoint uses Vercel Blob. On Vercel, connect a Blob store to the project. Legacy stores may require `BLOB_READ_WRITE_TOKEN`.

## Multi-user features

- Stable database user IDs derived from Auth.js sessions
- Case-insensitive normalized unique usernames
- Canonical `/u/[username]` public profiles
- Persistent followers/following with database uniqueness
- Persistent posts
- Direct conversations with one deterministic conversation per user pair
- Server-side conversation authorization
- Read state for messages
- `/messages` and `/messages/[conversationId]`
- Vercel Blob-backed image uploads

## Verification

The repository can be typechecked and built after dependencies are installed. Production browser A/B testing still requires a configured PostgreSQL database, authenticated test accounts, and the Vercel/Blob environment.
