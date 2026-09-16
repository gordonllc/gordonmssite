# Gordon Machinery Solutions

Replit-ready Next.js application for the public website, inventory management and inquiry inbox. The existing design, logo, hero video and application PDFs are preserved.

## Import and run in Replit

1. Import this repository from GitHub. Use this latest revision, not a copy imported before the Replit migration.
2. Use Node.js 22 or newer. Run `npm ci` if dependencies were not installed automatically.
3. Add a PostgreSQL database using the Replit Database tool. Its connection string must be available as the `DATABASE_URL` secret.
4. Create an App Storage bucket and give this application access to it. Set `REPLIT_STORAGE_BUCKET_ID` to the bucket's **ID**, not its display name. The server uses the official Replit SDK; never place storage credentials in browser code.
5. Run `npm run admin:setup` in the Replit Shell. Choose a unique password; typing is hidden. Copy the generated `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` into Replit Secrets. Set `ADMIN_EMAIL` to the email you want to use for the Gordon admin login. Do not paste the password or generated secrets into chat or commit them.
6. Set `APP_URL` to the exact public HTTPS URL you will publish, without a path. Before publishing, the editor preview can use `REPLIT_DEV_DOMAIN` automatically. Set `APP_URL` again when connecting a custom domain and republish.
7. Run `npm run db:setup` for the development database, then press Run. Without a database, development preview shows the bundled inventory read-only; it **does not save** forms or admin changes.
8. Open `/admin/login` in a normal browser tab to manage inventory and inquiries. Embedded editor previews can block third-party cookies; use Open in new tab for admin work. There is no public registration and no ChatGPT sign-in dependency.

## Publish on Replit

Use an Autoscale or Reserved VM web deployment, **not Static hosting**. The committed `.replit` file sets:

- Build: `npm run build`
- Run: `npm start`
- Listening host: `0.0.0.0`
- Port: `PORT` when provided, otherwise `3000`

Configure production database access and all required deployment Secrets. Development and production databases are separate; confirm which database you are connecting before copying data. At first database access the application creates its PostgreSQL tables and seeds the bundled listings once. Deleted seed listings do not return after a restart. The setup command is safe to rerun; it never replaces edited listings.

The production startup check refuses to run without the database, admin credentials, session secret, public HTTPS URL and storage bucket ID. This prevents accidentally publishing an unprotected or non-persistent admin system.

### Inquiry email automation

Add these optional Secrets to both environments where you want real email delivery:

- `RESEND_API_KEY`: your Resend API key.
- `INQUIRY_FROM_EMAIL`: a sender on a domain verified in your Resend account.
- `SALES_NOTIFICATION_EMAIL`: normally `Sales@GordonMachinerySolutions.com`.

With these configured, a saved inquiry sends a staff notification and customer acknowledgment without n8n. If delivery fails or is not configured, the request stays in the database/inbox; the visitor is not falsely told an email was sent. Admin links use `APP_URL`, not the former hosting URL.

## Existing live data: before switching domains

This source migration is **not an export of the old hosting account's database or storage**.

- Bundled inventory comes from `app/data/equipment.ts`. Compare it against the current live inventory before publishing and transfer any added/edited/unpublished listings.
- Existing customer inquiries remain on the old host. Export them securely before retiring that host. Never put customer records, passwords or API keys in this public repository.
- Original equipment photos still use Squarespace CDN URLs. Keep those URLs available or replace the images using the new admin editor.
- Images uploaded to the old host under `/api/media/` need to be copied/reuploaded to Replit App Storage and their listing URLs updated. They are not in GitHub.
- New uploads persist in Replit App Storage, not the deployment's ephemeral local filesystem. Removing a listing retains its photograph so another listing sharing it is not broken; remove genuinely unused photographs manually from App Storage when appropriate.
- Do not turn off the old host or change DNS until production inventory, admin login, image uploads, inquiry saving/email delivery and both PDF downloads have been checked on Replit.

## Security and maintenance

Admin passwords are salted scrypt hashes. Admin sessions expire after 8 hours, use signed HttpOnly/SameSite=Strict cookies, and use Secure cookies in production. Password/secret rotation invalidates all old sessions. Write endpoints check request Origin; login and inquiry limits are stored in PostgreSQL rather than per-process memory. The public media route serves only equipment-image keys. OpenAI identity headers are ignored.

Login allows 10 attempts per 15 minutes across this single-admin application. Inquiry limits are 5 per email per 15 minutes and 100 globally per hour. These application limits are not a substitute for deployment-level bot/DDoS protections.

At migration review, the production dependency audit had no high or critical alerts. Six moderate alerts remain in dependencies of the official Replit storage SDK, with no compatible automated fix available. Recheck the audit when updating the SDK; do not treat this review as a guarantee of security.

Run `npm run typecheck`, `npm test` and `npm run build` after changes. Tests use a PostgreSQL emulator and do not prove real Replit storage, email delivery or deployment integration; verify those on the actual deployment. Keep dependencies current and review `npm audit`. The legacy SQLite schema/migrations in `legacy/sites/` are reference-only, are excluded from compilation, and must not be run against PostgreSQL. New PostgreSQL schema changes belong in the tracked bootstrap implementation, using additive, reviewed migrations for existing installations.

Official setup references: [Replit Database](https://docs.replit.com/features/data-and-storage/sql-database), [App Storage SDK](https://docs.replit.com/features/sdks/object-storage-javascript-sdk), [Secrets](https://docs.replit.com/core-concepts/project-editor/app-setup/secrets), [Deployment configuration](https://docs.replit.com/features/project-setup/configuration).
