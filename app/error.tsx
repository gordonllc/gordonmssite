'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="admin-login"><section className="admin-login-card">
    <a className="eyebrow" href="/">Gordon Machinery Solutions</a>
    <h1>Temporarily unavailable</h1>
    <p>We couldn’t load this page. Please try again or call Gordon for current availability.</p>
    <button className="button button-dark" onClick={reset}>Try again</button>
    <a href="tel:+17707695281">Call 770-769-5281</a>
  </section></main>;
}
