'use client';
import { useScrollY } from '@/hooks/useScrollY';

const LogoSVG = () => (
  <svg width="420" height="129" viewBox="0 0 650 200" xmlns="http://www.w3.org/2000/svg" aria-label="OpenAnim logo">
    <path
      d="M 538 40 L 598 40 L 178 40 L 403 160 L 73 100 L 403 160 L 478 40 L 463 160"
      stroke="rgba(255,255,255,0.9)" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export default function Hero() {
  const scrollY = useScrollY();

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToHow = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      {/* Parallax grid layer */}
      <div
        className="grid-bg"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        aria-hidden="true"
      />

      <div className="hero-logo fade-up fade-up-1" aria-hidden="true">
        <LogoSVG />
      </div>

      <p className="hero-eyebrow fade-up fade-up-2">
        Deterministic multimodal compilation
      </p>

      <h1 className="hero-title fade-up fade-up-2" id="hero-title">
        Video generation<br /><span>that doesn&apos;t hallucinate.</span>
      </h1>

      <p className="hero-desc fade-up fade-up-3">
        Describe your video. Receive a deterministic, editable rendering pipeline
        powered by Manim, Remotion, and programmable visual systems.
      </p>

      <div className="hero-actions fade-up fade-up-4">
        <button className="btn-primary" onClick={scrollToWaitlist} id="hero-waitlist-btn">
          Join the Waitlist
        </button>
        <button className="btn-secondary" onClick={scrollToHow} id="hero-learn-btn">
          How It Works →
        </button>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  );
}
