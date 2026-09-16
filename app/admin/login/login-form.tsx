'use client';
import { useState, type FormEvent } from 'react';

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError('');
    const fields = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fields.get('email'), password: fields.get('password') }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not sign in.');
      window.location.assign('/admin');
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not sign in.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit}>
    <label>Email<input name="email" type="email" autoComplete="username" required maxLength={180} /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-dark" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
  </form>;
}
