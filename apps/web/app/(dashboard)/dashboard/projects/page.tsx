import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | OpenAnim",
};

export default function ProjectsPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Projects</h1>
        <p className="dashboard-subtitle">Your animation projects</p>
      </div>

      <div className="placeholder-card">
        <div className="placeholder-icon">🎬</div>
        <h2>No projects yet</h2>
        <p>
          Projects will appear here once the rendering pipeline is connected.
          Storage is ready via Cloudflare R2.
        </p>
      </div>
    </div>
  );
}
