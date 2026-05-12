import Link from 'next/link';

const LogoSVG = () => (
  <svg width="48" height="15" viewBox="0 0 650 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M 538 40 L 598 40 L 178 40 L 403 160 L 73 100 L 403 160 L 478 40 L 463 160"
      stroke="rgba(255,255,255,0.4)" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-left">
        <LogoSVG />
        <span className="footer-name">OPENANIM</span>
        <span className="footer-copy">© {year}</span>
      </div>
      <div className="footer-right">
        <Link
          href="https://github.com/openanim"
          className="footer-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="OpenAnim on GitHub"
          id="footer-github-link"
        >
          GitHub
        </Link>
        <span className="footer-link" style={{ cursor: 'default' }}>
          Private Beta
        </span>
      </div>
    </footer>
  );
}
