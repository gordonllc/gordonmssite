export function siteUrl() {
  const configured = process.env.APP_URL?.trim();
  if (configured) return new URL(configured).origin;
  if (process.env.REPLIT_DEV_DOMAIN && process.env.REPLIT_DEPLOYMENT !== '1') {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  if (process.env.NODE_ENV === 'production') return 'https://www.gordonmachinerysolutions.com';
  return `http://localhost:${process.env.PORT || '3000'}`;
}
