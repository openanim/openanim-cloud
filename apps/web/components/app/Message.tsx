"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import ArtifactCard from "./ArtifactCard";
import PipelineViz from "./PipelineViz";
import type { SessionMessage, ArtifactData } from "@/lib/mock-session";

interface MessageProps {
  message: SessionMessage;
  onArtifactExpand?: (a: ArtifactData) => void;
}

export default function Message({ message, onArtifactExpand }: MessageProps) {
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
        <ArtifactCard artifact={message.artifact} onExpand={onArtifactExpand} />
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
        <div className="font-mono text-[9px] text-app-fg3/60 text-right mt-1 pr-0.5">
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
        <span className="font-mono text-[9px] text-app-fg3/40">{formatTs(message.ts)}</span>
      </div>
      <div
        className="text-app-fg2 text-sm leading-relaxed font-sans"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
      />
    </div>
  );
}

function PipelineMessage({ message }: { message: Extract<SessionMessage, { role: "pipeline" }> }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Activity size={10} className="text-app-primary" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-app-fg3/60">
          Render Pipeline
        </span>
        <span className="font-mono text-[9px] text-app-fg3/40">{formatTs(message.ts)}</span>
      </div>
      <PipelineViz steps={message.steps} />
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

function formatTs(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
