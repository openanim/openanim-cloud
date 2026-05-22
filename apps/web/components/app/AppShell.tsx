"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import OrchestrationPanel from "./OrchestrationPanel";
import ArtifactInspector from "./ArtifactInspector";
import {
  MOCK_SESSIONS,
  type Session,
  type ArtifactData,
  type Provider,
  type RenderMode,
  type SessionMessage,
  type PipelineStep,
} from "@/lib/mock-session";

let _idCounter = 100;
const uid = () => `msg_${++_idCounter}`;

const MOCK_PIPELINE: PipelineStep[] = [
  { id: "p1", label: "Prompt Parsing", status: "done", durationMs: 18, log: '{"intent":"animation","provider":"manim"}' },
  {
    id: "p2", label: "Scene IR Generation", status: "done", durationMs: 312,
    log: "Generated 4 scene nodes · 2 function graphs · 1 transition",
    children: [
      { id: "p2a", label: "Semantic parse", status: "done", durationMs: 89 },
      { id: "p2b", label: "IR compilation", status: "done", durationMs: 223 },
    ],
  },
  {
    id: "p3", label: "Renderer Compilation", status: "done", durationMs: 2100,
    log: "Rendered 252 frames @ 60fps · Output: scene.mp4",
    children: [
      { id: "p3a", label: "Scene setup", status: "done", durationMs: 340 },
      { id: "p3b", label: "Frame render", status: "done", durationMs: 1520 },
      { id: "p3c", label: "MP4 encode", status: "done", durationMs: 240 },
    ],
  },
  { id: "p4", label: "FFmpeg Composition", status: "done", durationMs: 890, log: "Merged 4 segments · Color graded · 1920×1080" },
  { id: "p5", label: "Artifact Assembly", status: "done", durationMs: 42, log: "Hash: a3f2c1d9 · Stored" },
];

const MOCK_ARTIFACT: ArtifactData = {
  id: "art_gen_001",
  name: "generated_scene_v1",
  version: "1",
  hash: "f9e2a4b1",
  provider: "manim",
  renderer: "Manim CE 0.18",
  durationSec: 4.2,
  renderTimeMs: 3362,
  segments: [
    { id: "s1", label: "Intro", startSec: 0, endSec: 0.8, color: "#A7C080" },
    { id: "s2", label: "Main", startSec: 0.8, endSec: 3.0, color: "#7FBBB3" },
    { id: "s3", label: "Outro", startSec: 3.0, endSec: 4.2, color: "#DBBC7F" },
  ],
  sceneIR: {
    id: "root",
    type: "Scene",
    label: "GeneratedScene",
    props: { duration: 4.2, fps: 60, resolution: "1920x1080" },
    children: [
      { id: "c1", type: "Camera", label: "MainCamera", props: { fov: 45 } },
      {
        id: "c2", type: "Group", label: "Content",
        children: [
          { id: "c2a", type: "FunctionGraph", label: "Primary", props: { color: "#A7C080" } },
        ],
      },
    ],
  },
  createdAt: new Date().toISOString(),
};

export default function AppShell() {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState(MOCK_SESSIONS[0].id);
  const [showInspector, setShowInspector] = useState(true);
  const [mode, setMode] = useState<RenderMode>("local");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactData | null>(
    MOCK_SESSIONS[0].messages.find((m) => m.role === "artifact")?.artifact ?? null
  );
  const [provider, setProvider] = useState<Provider>("manim");

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];

  const addMessage = useCallback((sessionId: string, msg: SessionMessage) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, messages: [...s.messages, msg] } : s
      )
    );
  }, []);

  const handleNewSession = () => {
    const id = `sess_new_${Date.now()}`;
    const newSession: Session = {
      id,
      title: "New Session",
      provider,
      mode,
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
    setSelectedArtifact(null);
  };

  const handleSubmitPrompt = async (text: string) => {
    const ts = new Date().toISOString();
    addMessage(activeSessionId, { id: uid(), role: "user", content: text, ts });
    setIsStreaming(true);

    await delay(700);
    addMessage(activeSessionId, {
      id: uid(),
      role: "orchestrator",
      content: `Parsing prompt · selecting renderer · compiling scene IR.\n\n**Provider**: ${provider.charAt(0).toUpperCase() + provider.slice(1)}\n**Mode**: ${mode}\n**Resolution**: 1920×1080 @ 60fps`,
      ts: new Date().toISOString(),
    });

    await delay(900);
    addMessage(activeSessionId, {
      id: uid(),
      role: "pipeline",
      steps: MOCK_PIPELINE.map((s) => ({ ...s, id: `${uid()}_${s.id}` })),
      ts: new Date().toISOString(),
    });

    await delay(2200);
    const artifact = { ...MOCK_ARTIFACT, id: uid(), hash: Math.random().toString(16).slice(2, 10) };
    addMessage(activeSessionId, {
      id: uid(),
      role: "artifact",
      artifact,
      ts: new Date().toISOString(),
    });
    setSelectedArtifact(artifact);
    if (!showInspector) setShowInspector(true);

    setIsStreaming(false);
  };

  const handleSelectArtifact = (artifact: ArtifactData) => {
    setSelectedArtifact(artifact);
    setShowInspector(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-app-black">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        mode={mode}
        onToggleMode={() => setMode((m) => (m === "local" ? "cloud" : "local"))}
      />

      {/* Main orchestration panel */}
      <OrchestrationPanel
        session={activeSession}
        isStreaming={isStreaming}
        showInspector={showInspector}
        onToggleInspector={() => setShowInspector((s) => !s)}
        onSubmitPrompt={handleSubmitPrompt}
        onArtifactExpand={handleSelectArtifact}
        provider={provider}
        onProviderChange={setProvider}
      />

      {/* Right inspector — animated */}
      <AnimatePresence>
        {showInspector && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden flex-shrink-0 border-l border-white/[0.08]"
          >
            <ArtifactInspector
              session={activeSession}
              artifact={selectedArtifact}
              onClose={() => setShowInspector(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
