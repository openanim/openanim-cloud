import { auth } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | OpenAnim",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"} 👋
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-label">Projects</span>
          <span className="stat-value">—</span>
          <span className="stat-hint">Coming soon</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Storage Used</span>
          <span className="stat-value">—</span>
          <span className="stat-hint">Coming soon</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Renders</span>
          <span className="stat-value">—</span>
          <span className="stat-hint">Coming soon</span>
        </div>
      </div>

      <div className="dashboard-cta">
        <div className="cta-card">
          <h2>🚀 Infrastructure is ready</h2>
          <p>
            Authentication, storage, and API are all wired up. The product is
            coming soon.
          </p>
          <a href="/dashboard/upload" className="btn-primary">
            Try an upload
          </a>
        </div>
      </div>
    </div>
  );
}
