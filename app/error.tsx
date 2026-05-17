'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="hero" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <div className="grid-bg" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <h1 className="hero-title fade-up fade-up-1">Error</h1>
      <p className="hero-desc fade-up fade-up-2">
        Something went wrong.
      </p>
      <div className="hero-actions fade-up fade-up-3">
        <button onClick={() => reset()} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
