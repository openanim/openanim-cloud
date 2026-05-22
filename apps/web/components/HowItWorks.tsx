const STEPS = [
  { num: '01', name: 'Prompt', desc: 'Natural language input describing the desired video or visualization.' },
  { num: '02', name: 'Scene Planning', desc: 'The orchestrator decomposes the prompt into a structured scene graph.' },
  { num: '03', name: 'Execution Graph', desc: 'A deterministic task DAG is compiled — reproducible on every run.' },
  { num: '04', name: 'Provider Dispatch', desc: 'Each scene node is routed to the optimal execution provider.' },
  { num: '05', name: 'Composition', desc: 'Rendered scenes are assembled, composited, and encoded.' },
  { num: '06', name: 'Artifact Output', desc: 'A versioned, downloadable render artifact is delivered.' },
];

const HW_ITEMS = [
  {
    label: '// deterministic',
    title: 'Same input, same output. Always.',
    desc: 'Unlike black-box diffusion models, OpenAnim compiles your prompt into a reproducible execution graph. Re-run it tomorrow and get the same video.',
  },
  {
    label: '// programmable',
    title: 'Every frame is editable code.',
    desc: 'Rendering is done by Manim, Remotion, and diagramming engines — all code-driven. You can inspect, fork, and modify any scene.',
  },
  {
    label: '// composable',
    title: 'Mix providers in a single video.',
    desc: 'One scene in Manim, another in Remotion, another as a diagram. The orchestrator handles dispatch and composition automatically.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title">
      <div className="divider" />
      <div className="section">
        <p className="section-label">How It Works</p>
        <h2 className="section-title" id="how-title">From prompt to rendered artifact.</h2>
        <p className="section-desc">
          OpenAnim is not a black box. It&apos;s a compiler — transparent at every stage.
        </p>

        <div className="howitworks-wrap">
          <div className="pipeline-diagram" role="img" aria-label="OpenAnim rendering pipeline diagram">
            <div className="pipeline-corner tl" aria-hidden="true" />
            <div className="pipeline-corner tr" aria-hidden="true" />
            <div className="pipeline-corner bl" aria-hidden="true" />
            <div className="pipeline-corner br" aria-hidden="true" />

            {STEPS.map((step, i) => (
              <div key={step.num}>
                <div className="pipeline-step">
                  <div>
                    <div className="step-num" aria-hidden="true">{step.num}</div>
                  </div>
                  <div>
                    <div className="step-name">{step.name}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </div>
                {i < STEPS.length - 1 && <div className="step-connector" aria-hidden="true" />}
              </div>
            ))}
          </div>

          <div className="howitworks-text">
            {HW_ITEMS.map((item) => (
              <div className="hw-item" key={item.label}>
                <div className="hw-item-label">{item.label}</div>
                <div className="hw-item-title">{item.title}</div>
                <div className="hw-item-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
