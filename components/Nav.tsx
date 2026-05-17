import Link from 'next/link';

const LogoSVG = ({ width = 80 }: { width?: number }) => {
  const h = Math.round(width * (200 / 650));
  return (
    <svg width={width} height={h} viewBox="0 0 650 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M 538 40 L 598 40 L 178 40 L 403 160 L 73 100 L 403 160 L 478 40 L 463 160"
        stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
};

export default function Nav() {
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <Link href="/" className="nav-logo" aria-label="OpenAnim home">
        <LogoSVG width={72} />
        <span className="nav-logo-text">OpenAnim</span>
      </Link>
      <div className="nav-right">
        <Link href="#how-it-works" className="nav-link">
          How It Works
        </Link>
        <Link href="#providers" className="nav-link">
          Providers
        </Link>
        <Link href="#why" className="nav-link">
          Why OpenAnim
        </Link>
        <Link href="#waitlist" className="nav-cta">
          Join Waitlist
        </Link>
      </div>
    </nav>
  );
}

