'use client';

import { ArrowRight, Check } from 'lucide-react';
import { useState, type FormEvent } from 'react';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

export function RentalRatesForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [acknowledgementSent, setAcknowledgementSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const firstName = String(values.get('firstName') || '').trim();
    const lastName = String(values.get('lastName') || '').trim();

    setState('sending');
    setError('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          company: null,
          phone: values.get('phone'),
          email: values.get('email'),
          interest: 'Rental rates',
          equipmentSlug: null,
          equipmentTitle: null,
          message: values.get('details') || 'Please send your current equipment rental rates.',
          website: values.get('website'),
          sourcePage: '/rentals',
        }),
      });
      const data = await response.json() as { received?: boolean; acknowledgementSent?: boolean; error?: string };
      if (!response.ok || !data.received) throw new Error(data.error || 'We could not send your request.');
      form.reset();
      setAcknowledgementSent(Boolean(data.acknowledgementSent));
      setState('sent');
    } catch (caught) {
      setState('error');
      setError(caught instanceof Error ? caught.message : 'We could not send your request. Please call 770-769-5281.');
    }
  }

  if (state === 'sent') {
    return (
      <div className="service-form service-form-success" role="status">
        <span className="service-form-success-icon"><Check size={25} aria-hidden="true" /></span>
        <p className="eyebrow">Request Received</p>
        <h2>We&apos;ll send the current rates.</h2>
        <p>Your request is with the Gordon rental desk. {acknowledgementSent && 'A confirmation email is on its way. '}For an immediate availability check, call <a href="tel:+17707695281">770-769-5281</a>.</p>
        <button className="service-form-reset" type="button" onClick={() => setState('idle')}>Send another request</button>
      </div>
    );
  }

  return (
    <form className="service-form" onSubmit={submit}>
      <label className="form-honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      <div className="service-field-grid">
        <label>First name<input name="firstName" type="text" autoComplete="given-name" required /></label>
        <label>Last name<input name="lastName" type="text" autoComplete="family-name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Phone <span>Optional</span><input name="phone" type="tel" autoComplete="tel" /></label>
      </div>
      <label>What are you looking to rent? <span>Optional</span><textarea name="details" rows={4} placeholder="Machine type, project dates or rental term" /></label>
      {state === 'error' && <p className="form-error" role="alert">{error}</p>}
      <button className="button service-form-submit" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Request Rental Rates'}
        {state !== 'sending' && <ArrowRight size={17} aria-hidden="true" />}
      </button>
      <p className="form-note">We&apos;ll use your details only to respond to this rental request.</p>
    </form>
  );
}
