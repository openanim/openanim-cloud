const ACKNOWLEDGMENTS = [
  {
    tag: 'Animation Engine',
    name: 'Manim',
    desc: 'The mathematical animation engine that inspired our core visualization capabilities. Created by Grant Sanderson and maintained by the community.',
  },
  {
    tag: 'Programmatic Video',
    name: 'Remotion',
    desc: 'The incredible framework for creating videos programmatically with React. Developed by Jonny Burger and contributors.',
  },
  {
    tag: 'Media Processing',
    name: 'FFmpeg',
    desc: 'The Swiss Army knife of audio/video processing that powers our rendering and encoding pipeline.',
  },
  {
    tag: 'Diagrams & Visualization',
    name: 'PlantUML & Mermaid',
    desc: 'The components that enable generating beautiful diagrams and visualizations from structured text notation.',
  },
];

export default function Acknowledgments() {
  return (
    <section id="acknowledgments" aria-labelledby="acknowledgments-title">
      <div className="divider" />
      <div className="section">
        <p className="section-label">Gratitude</p>
        <h2 className="section-title" id="acknowledgments-title">
          Standing on the shoulders of giants.
        </h2>
        <p className="section-desc">
          OpenAnim is only possible because of the intelligent minds that created the open-source tools we rely on. We want to give a huge acknowledgment to them.
        </p>

        <div className="providers-grid" style={{ marginTop: '3rem' }} role="list">
          {ACKNOWLEDGMENTS.map((a) => (
            <div className="provider-card" key={a.name} role="listitem">
              <div className="provider-tag">{a.tag}</div>
              <div className="provider-name" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{a.name}</div>
              <div className="provider-desc" style={{ fontSize: '1rem', color: 'var(--fg-1)', lineHeight: '1.6' }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
