"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import type { ArtifactData } from "@/lib/mock-session";

const MOCK_CODE = `from manim import *

class FourierScene(Scene):
    def construct(self):
        axes = Axes(x_range=[-4, 4], y_range=[-2, 2])
        signal = axes.plot(lambda t: np.sin(2 * PI * t), color=GREEN)
        spectrum = axes.plot(lambda f: np.abs(np.fft.fft([...]))[int(f)],
                             color=TEAL)
        self.play(Create(axes), run_time=0.6)
        self.play(Create(signal), run_time=1.5)
        self.play(Transform(signal, spectrum), run_time=1.4)
        self.wait(0.7)`;

type Tab = "video" | "code";

interface ArtifactCardProps {
  artifact: ArtifactData;
}

export default function ArtifactCard({ artifact }: ArtifactCardProps) {
  const [tab, setTab] = useState<Tab>("video");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(MOCK_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: "var(--bg-1)",
        border: "1px solid var(--border)",
        borderRadius: "3px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.55rem 0.75rem",
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Name + badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#A7C080", fontSize: "0.6rem" }}>▶</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--fg-1)" }}>
            {artifact.name}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.55rem",
            background: "var(--bg-2)", border: "1px solid var(--border)",
            padding: "0.1rem 0.35rem", borderRadius: "2px",
            color: "rgba(157,169,160,0.5)",
          }}>
            v{artifact.version}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.55rem",
            background: "var(--bg-2)", border: "1px solid var(--border)",
            padding: "0.1rem 0.35rem", borderRadius: "2px",
            color: "rgba(157,169,160,0.35)",
          }}>
            #{artifact.hash}
          </span>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex",
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: "3px",
          padding: "2px",
          gap: "2px",
        }}>
          {(["video", "code"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "0.2rem 0.6rem",
                borderRadius: "2px",
                border: tab === t ? "1px solid rgba(211,198,170,0.15)" : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s",
                background: tab === t ? "var(--bg-3)" : "transparent",
                color: tab === t ? "var(--fg-1)" : "rgba(157,169,160,0.4)",
              }}
            >
              {t === "video" ? "▶  Video" : "{ }  Code"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "video" ? (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <VideoPlayer
              src={artifact.src}
              segments={artifact.segments}
              durationSec={artifact.durationSec}
            />
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{ position: "relative" }}
          >
            {/* Copy button */}
            <button
              onClick={copy}
              style={{
                position: "absolute",
                top: "0.6rem",
                right: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                color: copied ? "#A7C080" : "rgba(157,169,160,0.4)",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.15s",
                zIndex: 2,
                letterSpacing: "0.05em",
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
            <pre style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              color: "var(--fg-2)",
              padding: "1rem 1rem 1rem 1rem",
              overflowX: "auto",
              lineHeight: 1.75,
              margin: 0,
              background: "var(--black)",
              minHeight: "9rem",
            }}>
              <code>{MOCK_CODE}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 0.75rem",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <MetaItem label="Renderer" value={artifact.renderer} />
          <MetaItem label="Duration" value={`${artifact.durationSec}s`} />
          <MetaItem label="Render time" value={`${(artifact.renderTimeMs / 1000).toFixed(2)}s`} />
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "rgba(157,169,160,0.45)",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "2px",
            padding: "0.2rem 0.55rem",
            cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--fg-1)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(211,198,170,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(157,169,160,0.45)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          }}
        >
          <Download size={10} />
          Export
        </button>
      </div>
    </motion.div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: "0.5rem",
        textTransform: "uppercase", letterSpacing: "0.12em",
        color: "rgba(157,169,160,0.4)",
      }}>{label}</span>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: "0.65rem",
        color: "var(--fg-1)",
      }}>{value}</span>
    </div>
  );
}
