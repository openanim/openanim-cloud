import type { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Settings | OpenAnim",
};

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Settings</h1>
        <p className="dashboard-subtitle">Manage your account</p>
      </div>

      <div className="settings-section">
        <h2 className="settings-heading">Account</h2>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-label">Name</span>
            <span className="settings-value">{session?.user?.name ?? "—"}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Email</span>
            <span className="settings-value">{session?.user?.email ?? "—"}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Auth Provider</span>
            <span className="settings-value">Google</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-heading">Storage</h2>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-label">Provider</span>
            <span className="settings-value">Cloudflare R2</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Status</span>
            <span className="settings-value settings-badge">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
