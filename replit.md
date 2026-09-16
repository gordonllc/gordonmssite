# Gordon website - Replit migration

This app uses Next.js App Router on Node.js 22, PostgreSQL via `pg`, Replit App Storage via `@replit/object-storage`, and optional Resend inquiry emails.

Preserve the existing website's design and routes. Do not restore Sites/Cloudflare bindings or ChatGPT authentication. Read README.md for the exact setup, Secrets, migration boundaries and launch checklist.

Run `npm ci`, then configure PostgreSQL, App Storage and Secrets. Use `npm run admin:setup` for a private password setup, `npm run db:setup` for database initialization, and `npm run dev` for preview. For publishing use `npm run build` and `npm start`.

No secrets or customer inquiry data belong in this public repository. Use the Git identity Gordon Machinery Solutions with a no-reply address, never a developer's personal identity. Do not overwrite production records with seed inventory or retire the old hosting service before the production migration is verified.
