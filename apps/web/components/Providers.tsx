const PROVIDERS = [
  {
    tag: 'Mathematical Animations',
    name: 'Manim',
    desc: 'Precision-rendered mathematical and scientific animations. Ideal for equations, graphs, geometry, and data visualizations.',
    chips: ['Python', 'LaTeX', 'Cairo', 'FFmpeg'],
  },
  {
    tag: 'Web-Native Rendering',
    name: 'Remotion',
    desc: 'React-based video generation. Perfect for data-driven motion graphics, UI recordings, and web-native compositions.',
    chips: ['React', 'Node.js', 'Chromium', 'MP4'],
  },
  {
    tag: 'Diagram Generation',
    name: 'Mermaid',
    desc: 'Flowcharts, sequence diagrams, class diagrams, and architecture graphs — rendered as animated visual scenes.',
    chips: ['Flowcharts', 'Sequence', 'ER Diagrams', 'Gantt'],
  },
  {
    tag: 'UML & Architecture',
    name: 'PlantUML',
    desc: 'UML diagrams, architecture blueprints, and system maps — automatically generated from structured notation.',
    chips: ['UML', 'C4 Model', 'Component', 'Deployment'],
  },
];

export default function Providers() {
  return (
    <section id="providers" aria-labelledby="providers-title">
      <div className="divider" />
      <div className="section">
        <p className="section-label">Execution Providers</p>
        <h2 className="section-title" id="providers-title">
          Not backends. Execution runtimes.
        </h2>
        <p className="section-desc">
          Each provider is an isolated rendering container. One video can span
          multiple providers — orchestrated seamlessly.
        </p>

        <div className="providers-grid" role="list">
          {PROVIDERS.map((p) => (
            <div className="provider-card" key={p.name} role="listitem">
              <div className="provider-tag">{p.tag}</div>
              <div className="provider-name">{p.name}</div>
              <div className="provider-desc">{p.desc}</div>
              <div className="provider-tags" aria-label={`${p.name} technologies`}>
                {p.chips.map((c) => (
                  <span className="provider-chip" key={c}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
