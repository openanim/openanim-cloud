"use client";

import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import OrchestrationPanel from "./OrchestrationPanel";
import {
  MOCK_SESSIONS,
  type Session,
  type RenderMode,
  type SessionMessage,
  type PipelineStep,
} from "@/lib/mock-session";

let _idCounter = 100;
const uid = () => `msg_${++_idCounter}`;

const MOCK_PIPELINE: PipelineStep[] = [
  { id: "p1", label: "Prompt Parsing", status: "done", durationMs: 18, log: '{"intent":"animation"}' },
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
  { id: "p4", label: "FFmpeg Composition", status: "done", durationMs: 890, log: "Merged 4 segments · 1920×1080" },
  { id: "p5", label: "Artifact Assembly", status: "done", durationMs: 42, log: "Hash: a3f2c1d9 · Stored" },
];

const MOCK_ARTIFACT = {
  id: "art_gen_001",
  name: "generated_scene_v1",
  version: "1",
  hash: "f9e2a4b1",
  provider: "manim" as const,
  renderer: "Manim CE 0.18",
  durationSec: 4.2,
  renderTimeMs: 3362,
  segments: [
    { id: "s1", label: "Intro", startSec: 0, endSec: 0.8, color: "#A7C080" },
    { id: "s2", label: "Main", startSec: 0.8, endSec: 3.0, color: "#7FBBB3" },
    { id: "s3", label: "Outro", startSec: 3.0, endSec: 4.2, color: "#DBBC7F" },
  ],
  sceneIR: { id: "root", type: "Scene", label: "GeneratedScene", props: { duration: 4.2 } },
  createdAt: new Date().toISOString(),
};

export default function AppShell() {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState(MOCK_SESSIONS[0].id);
  const [mode, setMode] = useState<RenderMode>("local");
  const [isStreaming, setIsStreaming] = useState(false);

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
      provider: "manim",
      mode,
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
  };

  const handleSubmitPrompt = async (text: string) => {
    const ts = new Date().toISOString();
    addMessage(activeSessionId, { id: uid(), role: "user", content: text, ts });
    setIsStreaming(true);

    await delay(700);
    addMessage(activeSessionId, {
      id: uid(),
      role: "orchestrator",
      content: `Parsing prompt · selecting renderer · compiling scene IR.\n\n**Mode**: ${mode}\n**Resolution**: 1920×1080 @ 60fps`,
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

    setIsStreaming(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--black)" }}>
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        mode={mode}
        onToggleMode={() => setMode((m) => (m === "local" ? "cloud" : "local"))}
      />
      <OrchestrationPanel
        session={activeSession}
        isStreaming={isStreaming}
        onSubmitPrompt={handleSubmitPrompt}
      />
    </div>
  );
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
