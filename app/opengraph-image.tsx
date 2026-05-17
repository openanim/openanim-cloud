import { ImageResponse } from 'next/og';

export const alt = 'OpenAnim — Deterministic Video Generation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #000000, #1c1c1c)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <svg width="120" height="40" viewBox="0 0 650 200" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 538 40 L 598 40 L 178 40 L 403 160 L 73 100 L 403 160 L 478 40 L 463 160"
              stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <div style={{ marginLeft: 24, fontSize: 32, color: 'white', letterSpacing: '0.1em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
            OpenAnim
          </div>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Deterministic Video Generation
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#c0c0c0',
            textAlign: 'center',
            marginTop: 32,
            maxWidth: '80%',
            lineHeight: 1.5,
          }}
        >
          Describe your video and receive deterministic, editable rendering pipelines.
        </div>
      </div>
    ),
    { ...size }
  );
}
