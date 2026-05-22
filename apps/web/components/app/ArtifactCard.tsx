"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, Download, MoreHorizontal } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import type { ArtifactData } from "@/lib/mock-session";

interface ArtifactCardProps {
  artifact: ArtifactData;
  onExpand?: (a: ArtifactData) => void;
}

export default function ArtifactCard({ artifact, onExpand }: ArtifactCardProps) {
  const [showIR, setShowIR] = useState(false);

  const irPreview = JSON.stringify(artifact.sceneIR, null, 2);
  const irTruncated = irPreview.length > 900 ? irPreview.slice(0, 900) + "\n  ..." : irPreview;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="bg-app-bg1 border border-white/[0.08] rounded-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-app-primary text-[10px]">▶</span>
          <span className="font-mono text-xs text-app-fg1">{artifact.name}</span>
          <span className="font-mono text-[9px] bg-app-bg2 border border-white/[0.08] px-1.5 py-0.5 text-app-fg3 rounded-sm">
            v{artifact.version}
          </span>
          <span className="font-mono text-[9px] bg-app-bg2 border border-white/[0.08] px-1.5 py-0.5 text-app-fg3 rounded-sm">
            #{artifact.hash}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] bg-app-primary/10 text-app-primary border border-app-primary/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">
            {artifact.provider}
          </span>
          <button
            onClick={() => onExpand?.(artifact)}
            className="text-app-fg3 hover:text-app-fg1 transition-colors"
            title="Expand in inspector"
          >
            <Expand size={13} />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <VideoPlayer
        src={artifact.src}
        segments={artifact.segments}
        durationSec={artifact.durationSec}
      />

      {/* Footer metadata */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.08]">
        <div className="flex gap-6">
          <MetaItem label="Renderer" value={artifact.renderer} />
          <MetaItem label="Duration" value={`${artifact.durationSec}s`} />
          <MetaItem
            label="Render Time"
            value={`${(artifact.renderTimeMs / 1000).toFixed(2)}s`}
          />
        </div>
        <div className="flex items-center gap-2">
          <ActionButton onClick={() => setShowIR((s) => !s)} active={showIR}>
            IR
          </ActionButton>
          <ActionButton>
            <Download size={11} className="inline mr-1" />
            Export
          </ActionButton>
          <ActionButton>
            <MoreHorizontal size={11} />
          </ActionButton>
        </div>
      </div>

      {/* Scene IR Preview (collapsible) */}
      <AnimatePresence>
        {showIR && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-white/[0.08]"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-app-black/40">
              <span className="font-mono text-[9px] uppercase tracking-widest text-app-fg3">
                Scene IR
              </span>
              <span className="font-mono text-[9px] text-app-fg3 bg-app-bg2 border border-white/[0.08] px-2 py-0.5 rounded-sm">
                JSON
              </span>
            </div>
            <pre className="font-mono text-[10px] text-app-fg2 px-4 py-3 overflow-x-auto bg-app-black leading-relaxed max-h-64">
              {irTruncated}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[9px] uppercase tracking-wider text-app-fg3">{label}</span>
      <span className="font-mono text-[10px] text-app-fg1">{value}</span>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[9px] px-2 py-1 rounded-sm border transition-all flex items-center gap-1
        ${active
          ? "border-app-primary/40 text-app-primary bg-app-primary/5"
          : "border-white/[0.08] text-app-fg3 hover:text-app-fg1 hover:border-white/20"
        }`}
    >
      {children}
    </button>
  );
}
