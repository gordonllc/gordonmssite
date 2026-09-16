import { redirect } from 'next/navigation';
import { getAdminUser } from '../../lib/auth';
import { adminConfig } from '../../lib/session';
import LoginForm from './login-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Gordon Administration', robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getAdminUser()) redirect('/admin');
  return <main className="admin-login"><section className="admin-login-card">
    <a href="/" className="eyebrow">Gordon Machinery Solutions</a>
    <h1>Site management</h1>
    {adminConfig() ? <LoginForm /> : <p>Admin access has not been configured yet. Add the admin credentials in Replit Secrets using the setup guide.</p>}
    <a href="/">Back to the website</a>
  </section></main>;
}
