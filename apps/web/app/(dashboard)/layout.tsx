import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <span className="logo-text">OpenAnim</span>
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard" className="sidebar-link">
            <span>🏠</span> Overview
          </a>
          <a href="/dashboard/projects" className="sidebar-link">
            <span>🎬</span> Projects
          </a>
          <a href="/dashboard/upload" className="sidebar-link">
            <span>⬆️</span> Upload
          </a>
          <a href="/dashboard/settings" className="sidebar-link">
            <span>⚙️</span> Settings
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            {session.user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="user-avatar"
              />
            )}
            <div className="user-meta">
              <span className="user-name">{session.user.name}</span>
              <span className="user-email">{session.user.email}</span>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="btn-signout">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
