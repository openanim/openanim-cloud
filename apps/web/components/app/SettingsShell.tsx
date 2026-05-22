"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, User, HardDrive, Cpu, Key, Bell, Shield } from "lucide-react";
import Link from "next/link";

type Section = "account" | "renderer" | "api" | "notifications" | "privacy";

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "account",       label: "Account",       icon: <User size={14} /> },
  { id: "renderer",      label: "Renderer",       icon: <Cpu size={14} /> },
  { id: "api",           label: "API Keys",       icon: <Key size={14} /> },
  { id: "notifications", label: "Notifications",  icon: <Bell size={14} /> },
  { id: "privacy",       label: "Privacy",        icon: <Shield size={14} /> },
];

export default function SettingsShell() {
  const [section, setSection] = useState<Section>("account");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--black)" }}>

      {/* Settings sidebar */}
      <div style={{
        width: "220px",
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        background: "var(--bg-1)",
        display: "flex",
        flexDirection: "column",
        padding: "1.25rem 0",
      }}>
        {/* Back */}
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0 1.25rem 1.25rem",
            color: "rgba(157,169,160,0.5)",
            textDecoration: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            borderBottom: "1px solid var(--border)",
            marginBottom: "0.75rem",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(157,169,160,0.5)"; }}
        >
          <ArrowLeft size={12} />
          Back to Studio
        </Link>

        <div style={{
          padding: "0 0.75rem 0.5rem 1.25rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(157,169,160,0.35)",
          marginBottom: "0.25rem",
        }}>
          Settings
        </div>

        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              width: "100%",
              padding: "0.6rem 1.25rem",
              background: section === item.id ? "var(--bg-3)" : "transparent",
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              borderLeft: section === item.id ? "2px solid #A7C080" : "2px solid transparent",
              cursor: "pointer",
              color: section === item.id ? "var(--fg-1)" : "var(--fg-2)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
              fontWeight: section === item.id ? 500 : 400,
              textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (section !== item.id) (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-2)";
            }}
            onMouseLeave={(e) => {
              if (section !== item.id) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <span style={{ color: section === item.id ? "#A7C080" : "rgba(157,169,160,0.5)", flexShrink: 0 }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2.5rem 3rem" }}>
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{ maxWidth: "640px" }}
        >
          {section === "account"       && <AccountSection />}
          {section === "renderer"      && <RendererSection />}
          {section === "api"           && <ApiSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "privacy"       && <PrivacySection />}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Section components ────────────────────────────────────────────── */

function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h1 style={{
        fontFamily: "var(--font-heading)",
        fontSize: "1.35rem",
        fontWeight: 700,
        color: "var(--fg-1)",
        marginBottom: "0.35rem",
      }}>{title}</h1>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--fg-3)" }}>{desc}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(46,56,60,0.5), rgba(39,46,51,0.5))",
      border: "1px solid var(--border)",
      borderRadius: "10px",
      overflow: "hidden",
      marginBottom: "1.5rem",
    }}>
      {children}
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 1.25rem",
      borderBottom: "1px solid var(--border)",
      gap: "1rem",
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--fg-1)", fontWeight: 500 }}>
          {label}
        </div>
        {desc && (
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--fg-3)", marginTop: "0.15rem" }}>
            {desc}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function LastRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 1.25rem",
      gap: "1rem",
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--fg-1)", fontWeight: 500 }}>
          {label}
        </div>
        {desc && (
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--fg-3)", marginTop: "0.15rem" }}>
            {desc}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Badge({ color = "#A7C080", children }: { color?: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "var(--font-mono)",
      fontSize: "0.7rem",
      padding: "0.2rem 0.65rem",
      borderRadius: "20px",
      background: `${color}18`,
      border: `1px solid ${color}40`,
      color,
    }}>
      {children}
    </span>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div style={{
      width: "36px",
      height: "20px",
      borderRadius: "20px",
      background: on ? "rgba(167,192,128,0.3)" : "var(--bg-3)",
      border: `1px solid ${on ? "rgba(167,192,128,0.4)" : "var(--border)"}`,
      position: "relative",
      cursor: "pointer",
      transition: "all 0.2s",
    }}>
      <div style={{
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        background: on ? "#A7C080" : "rgba(157,169,160,0.4)",
        position: "absolute",
        top: "2px",
        left: on ? "18px" : "2px",
        transition: "left 0.2s, background 0.2s",
      }} />
    </div>
  );
}

function ActionBtn({ children, danger, onClick }: { children: React.ReactNode; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        padding: "0.35rem 0.85rem",
        borderRadius: "6px",
        border: danger ? "1px solid rgba(230,126,128,0.3)" : "1px solid var(--border-bright)",
        background: "transparent",
        color: danger ? "#E67E80" : "var(--fg-2)",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function AccountSection() {
  return (
    <>
      <SectionTitle title="Account" desc="Manage your profile and authentication." />
      <Card>
        <Row label="Name" desc="Your display name"><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--fg-2)" }}>—</span></Row>
        <Row label="Email" desc="Your login email"><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--fg-2)" }}>—</span></Row>
        <LastRow label="Auth Provider"><Badge>Google OAuth</Badge></LastRow>
      </Card>
      <Card>
        <Row label="Plan" desc="Your current subscription"><Badge>Free</Badge></Row>
        <LastRow label="Render Credits" desc="Resets monthly"><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--fg-1)", fontWeight: 600 }}>100 <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>/ 100</span></span></LastRow>
      </Card>
      <Card>
        <LastRow label="Sign Out" desc="End your current session"><ActionBtn danger onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</ActionBtn></LastRow>
      </Card>
    </>
  );
}

function RendererSection() {
  return (
    <>
      <SectionTitle title="Renderer" desc="Configure your local and cloud rendering engines." />
      <Card>
        <Row label="Default Engine" desc="Used when no provider is specified"><Badge color="#A7C080">Manim CE 0.18</Badge></Row>
        <Row label="Render Mode" desc="Where renders execute by default"><Badge color="#7FBBB3">Local</Badge></Row>
        <LastRow label="Output Resolution" desc="Default resolution for new renders"><Badge color="#DBBC7F">1920 × 1080</Badge></LastRow>
      </Card>
      <Card>
        <Row label="Manim" desc="Python math animation engine"><Badge color="#A7C080">Installed</Badge></Row>
        <Row label="Remotion" desc="React-based video rendering"><Badge color="#9DA9A0">Not configured</Badge></Row>
        <LastRow label="FFmpeg" desc="Video composition & encoding"><Badge color="#A7C080">Installed</Badge></LastRow>
      </Card>
    </>
  );
}

function ApiSection() {
  return (
    <>
      <SectionTitle title="API Keys" desc="Keys for connecting external services and your local engine." />
      <Card>
        <Row label="OpenAnim API Key" desc="Use this to call the API programmatically">
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "rgba(157,169,160,0.5)", background: "var(--bg-3)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
              oa_••••••••••••••
            </code>
            <ActionBtn>Reveal</ActionBtn>
          </div>
        </Row>
        <LastRow label="Regenerate Key" desc="Invalidates the current key immediately">
          <ActionBtn danger>Regenerate</ActionBtn>
        </LastRow>
      </Card>
      <Card>
        <LastRow label="Webhook URL" desc="Receive callbacks when renders complete">
          <input
            placeholder="https://your-server.com/hook"
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "0.3rem 0.65rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--fg-2)",
              outline: "none",
              width: "220px",
            }}
          />
        </LastRow>
      </Card>
    </>
  );
}

function NotificationsSection() {
  return (
    <>
      <SectionTitle title="Notifications" desc="Control when and how you get notified." />
      <Card>
        <Row label="Render complete" desc="Notify when a render finishes"><Toggle on={true} /></Row>
        <Row label="Render failed" desc="Alert on pipeline errors"><Toggle on={true} /></Row>
        <Row label="New session" desc="Notify when a new session starts"><Toggle on={false} /></Row>
        <LastRow label="Weekly digest" desc="Summary of your renders each week"><Toggle on={false} /></LastRow>
      </Card>
      <Card>
        <LastRow label="Email notifications" desc="Send alerts to your registered email"><Toggle on={true} /></LastRow>
      </Card>
    </>
  );
}

function PrivacySection() {
  return (
    <>
      <SectionTitle title="Privacy" desc="Control data retention and usage." />
      <Card>
        <Row label="Session history" desc="Store prompt and pipeline logs"><Toggle on={true} /></Row>
        <LastRow label="Analytics" desc="Help improve OpenAnim with anonymous usage data"><Toggle on={false} /></LastRow>
      </Card>
      <Card>
        <Row label="Delete all sessions" desc="Permanently remove your session history">
          <ActionBtn danger>Delete</ActionBtn>
        </Row>
        <LastRow label="Delete account" desc="Permanently remove your account and all data">
          <ActionBtn danger>Delete Account</ActionBtn>
        </LastRow>
      </Card>
    </>
  );
}
