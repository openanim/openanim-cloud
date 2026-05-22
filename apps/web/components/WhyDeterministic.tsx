const WHY_POINTS = [
  {
    icon: "↺",
    title: "Reproducible by design",
    desc: "The same prompt produces the same render graph every time. Version it, diff it, roll it back.",
  },
  {
    icon: "⊞",
    title: "Transparent execution",
    desc: "Every scene is a piece of code you can read, modify, and own. No proprietary black boxes.",
  },
  {
    icon: "⟶",
    title: "Editable at any stage",
    desc: "Fork the execution graph. Swap a provider. Adjust parameters. Re-render only what changed.",
  },
  {
    icon: "⊗",
    title: "No hallucinated frames",
    desc: "Rendering is deterministic computation — not stochastic sampling. Results are predictable.",
  },
];

export default function WhyDeterministic() {
  return (
    <section id="why" aria-labelledby="why-title">
      <div className="divider" />
      <div className="section">
        <p className="section-label">Why Deterministic</p>
        <h2 className="section-title" id="why-title">
          Code, not chance.
        </h2>
        <p className="section-desc">
          Traditional AI video generation is a lottery. OpenAnim is a compiler.
        </p>

        <div className="why-grid">
          <div
            className="code-block"
            data-title="// openanim sdk example"
            role="complementary"
            aria-label="OpenAnim SDK code example"
          >
            <span className="code-comment">
              # install: pip install openanim
            </span>
            {"\n"}
            {"\n"}
            <span className="code-key">from</span> openanim{" "}
            <span className="code-key">import</span> Orchestrator{"\n"}
            {"\n"}
            orc = Orchestrator(){"\n"}
            {"\n"}
            result = <span className="code-key">await</span> orc.generate({"\n"}
            {"    "}
            <span className="code-val">prompt</span>=
            <span className="code-comment">
              &quot;Explain Fourier transforms&quot;
            </span>
            ,{"\n"}
            {"    "}
            <span className="code-val">provider</span>=
            <span className="code-comment">&quot;manim&quot;</span>,{"\n"})
            {"\n"}
            {"\n"}
            <span className="code-comment">
              # same input → same output, always
            </span>
            {"\n"}
            <span className="code-key">print</span>(result.artifact_url)
          </div>

          <div className="why-points" role="list">
            {WHY_POINTS.map((p) => (
              <div className="why-point" key={p.title} role="listitem">
                <div className="why-point-icon" aria-hidden="true">
                  {p.icon}
                </div>
                <div>
                  <div className="why-point-title">{p.title}</div>
                  <div className="why-point-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
