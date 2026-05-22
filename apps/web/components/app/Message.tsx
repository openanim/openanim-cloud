"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import ArtifactCard from "./ArtifactCard";
import PipelineViz from "./PipelineViz";
import type { SessionMessage } from "@/lib/mock-session";

interface MessageProps {
  message: SessionMessage;
}

export default function Message({ message }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {message.role === "user" && <UserMessage message={message} />}
      {message.role === "orchestrator" && <OrchestratorMessage message={message} />}
      {message.role === "pipeline" && <PipelineMessage message={message} />}
      {message.role === "artifact" && (
        <ArtifactCard artifact={message.artifact} />
      )}
      {message.role === "code" && <CodeMessage message={message} />}
    </motion.div>
  );
}

function UserMessage({ message }: { message: Extract<SessionMessage, { role: "user" }> }) {
  return (
    <div className="flex justify-end">
      <div>
        <div className="bg-app-bg2 border border-white/[0.08] text-app-fg1 text-sm px-4 py-2.5 rounded-sm max-w-[75%] font-sans leading-relaxed">
          {message.content}
        </div>
        <div className="font-mono text-[9px] text-app-fg3/60 text-right mt-1 pr-0.5" suppressHydrationWarning>
          {formatTs(message.ts)}
        </div>
      </div>
    </div>
  );
}

function OrchestratorMessage({ message }: { message: Extract<SessionMessage, { role: "orchestrator" }> }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-app-fg3/60">
          Orchestrator
        </span>
        <span className="font-mono text-[9px] text-app-fg3/40" suppressHydrationWarning>{formatTs(message.ts)}</span>
      </div>
      <div
        className="text-app-fg2 text-sm leading-relaxed font-sans"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
      />
    </div>
  );
}

function PipelineMessage({ message }: { message: Extract<SessionMessage, { role: "pipeline" }> }) {
  const [open, setOpen] = useState(false);
  const doneCount = message.steps.filter((s) => s.status === "done").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {/* Clickable header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--bg-1)",
          border: "1px solid var(--border)",
          borderRadius: "3px",
          padding: "0.45rem 0.75rem",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(211,198,170,0.2)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
      >
        <Activity size={10} style={{ color: "#A7C080", flexShrink: 0 }} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.6rem",
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(157,169,160,0.55)", flex: 1,
        }}>
          Render Pipeline
        </span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.55rem",
          color: "rgba(157,169,160,0.4)",
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          padding: "0.1rem 0.4rem",
          borderRadius: "2px",
        }}>
          {doneCount}/{message.steps.length}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.7rem",
          color: "rgba(157,169,160,0.35)",
          marginLeft: "0.25rem",
          transition: "transform 0.2s",
          display: "inline-block",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }}>
          ›
        </span>
      </button>

      {/* Collapsible steps */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <PipelineViz steps={message.steps} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CodeMessage({ message }: { message: Extract<SessionMessage, { role: "code" }> }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(message.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-app-bg1 border border-white/[0.08] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.08]">
        <span className="font-mono text-[9px] uppercase tracking-wider text-app-primary/80">
          {message.lang}
        </span>
        <button
          onClick={copy}
          className="font-mono text-[9px] text-app-fg3 hover:text-app-fg1 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="font-mono text-xs text-app-fg2 p-4 overflow-x-auto leading-relaxed">
        <code>{message.content}</code>
      </pre>
    </div>
  );
}

/* Minimal markdown renderer — handles **bold** and `code` */
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong class=\"text-app-fg1 font-medium\">$1</strong>")
    .replace(/`(.+?)`/g, "<code class=\"font-mono text-app-primary bg-app-bg2 px-1 text-xs rounded-sm\">$1</code>")
    .replace(/\n/g, "<br />");
}

function formatTs(_ts: string) {
  // Rendered client-only via suppressHydrationWarning on the parent
  if (typeof window === "undefined") return "";
  const d = new Date(_ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
