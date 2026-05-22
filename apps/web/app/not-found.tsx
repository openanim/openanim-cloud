import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="hero" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <div className="grid-bg" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <h1 className="hero-title fade-up fade-up-1">404</h1>
      <p className="hero-desc fade-up fade-up-2">
        This page could not be found.
      </p>
      <div className="hero-actions fade-up fade-up-3">
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  );
}
