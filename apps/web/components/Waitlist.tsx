'use client';
import { useState } from 'react';
import type { WaitlistResponse } from '@openanim/shared';

type State = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState('loading');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
      const response = await fetch(`${apiUrl}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as WaitlistResponse;

      if (response.ok && data.success) {
        setState('success');
        setMsg(data.message || "You're on the list.");
        setEmail('');
      } else if (!data.success && data.status === 'duplicate') {
        setState('duplicate');
        setMsg(data.error || "You're already on the waitlist.");
      } else {
        setState('error');
        setMsg(!data.success && data.error ? data.error : 'Something went wrong. Try again.');
      }
    } catch {
      setState('error');
      setMsg('Network error. Please try again.');
    }
  };

  const msgClass =
    state === 'success' ? 'waitlist-msg success' :
    state === 'error'   ? 'waitlist-msg error' :
                          'waitlist-msg info';

  return (
    <section id="waitlist" className="waitlist-section" aria-labelledby="waitlist-title">
      <div className="waitlist-inner">
        <p className="section-label waitlist-label">
          Early Access
        </p>
        <h2 className="waitlist-title" id="waitlist-title">
          Be first to render.
        </h2>
        <p className="waitlist-desc">
          OpenAnim is in private development. Join the waitlist and get early
          access before the public launch.
        </p>

        {state === 'success' ? (
          <div className={`${msgClass} waitlist-msg--success`} role="status" aria-live="polite">
            ✓ &nbsp;{msg}
          </div>
        ) : (
          <form
            className="waitlist-form"
            onSubmit={submit}
            noValidate
            aria-label="Waitlist signup form"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="waitlist-email"
              className="waitlist-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={state === 'loading'}
              autoComplete="email"
            />
            <button
              className="waitlist-submit"
              type="submit"
              disabled={state === 'loading'}
              id="waitlist-submit-btn"
            >
              {state === 'loading' ? '...' : 'Join →'}
            </button>
          </form>
        )}

        {state !== 'success' && msg && (
          <p className={msgClass} role="alert" aria-live="assertive">{msg}</p>
        )}
      </div>
    </section>
  );
}
