import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload | OpenAnim",
};

export default function UploadPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Upload</h1>
        <p className="dashboard-subtitle">
          Upload assets to Cloudflare R2 storage
        </p>
      </div>

      <div className="placeholder-card">
        <div className="placeholder-icon">⬆️</div>
        <h2>Upload coming soon</h2>
        <p>
          The API endpoint for generating R2 presigned URLs is ready at{" "}
          <code>POST /storage/presign</code>. The upload UI will be built here.
        </p>
        <div className="code-block">
          <pre>{`// API endpoint ready:
POST /storage/presign
Body: { filename: string, contentType: string }
Returns: { uploadUrl: string, key: string }`}</pre>
        </div>
      </div>
    </div>
  );
}
