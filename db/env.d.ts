declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    FILES: R2Bucket;
    ADMIN_EMAILS?: string;
    RESEND_API_KEY?: string;
    INQUIRY_FROM_EMAIL?: string;
    SALES_NOTIFICATION_EMAIL?: string;
  }
}
