"use client";

import { motion } from "framer-motion";
import { Settings, Plus } from "lucide-react";
import type { Session, RenderMode } from "@/lib/mock-session";

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  mode: RenderMode;
  onToggleMode: () => void;
}

const PROVIDER_COLORS: Record<string, string> = {
  manim: "#A7C080",
  remotion: "#7FBBB3",
  ffmpeg: "#DBBC7F",
  custom: "#9DA9A0",
};

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  mode,
  onToggleMode,
}: SidebarProps) {
  return (
    <div className="flex flex-col w-[220px] flex-shrink-0 h-full bg-app-bg1 border-r border-white/[0.08]">
      {/* Top — Logo + Mode */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-fg1">
            OpenAnim
          </span>
          <button
            onClick={onToggleMode}
            className={`font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-sm border transition-all ${
              mode === "local"
                ? "bg-app-primary/10 text-app-primary border-app-primary/25"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}
          >
            {mode}
          </button>
        </div>

        {/* New session */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-1.5 font-mono text-[10px] text-app-fg2 hover:text-app-fg1 border border-white/[0.08] hover:border-white/20 rounded-sm py-1.5 transition-all hover:bg-app-bg2"
        >
          <Plus size={10} />
          New Session
        </motion.button>
      </div>

      {/* Middle — Sessions list */}
      <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
        <SectionHeader>Sessions</SectionHeader>
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            onSelect={() => onSelectSession(session.id)}
          />
        ))}

        <SectionHeader>Renders</SectionHeader>
        <PlaceholderItem label="fourier_v1.mp4" />
        <PlaceholderItem label="backprop_draft.mp4" />

        <SectionHeader>Artifacts</SectionHeader>
        <PlaceholderItem label="fourier_transform_v1" />
        <PlaceholderItem label="sorting_viz_v2" />
      </div>

      {/* Bottom — Provider pills + Settings */}
      <div className="border-t border-white/[0.08] p-3 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1">
          {["MANIM", "REMOTION", "CUSTOM"].map((p) => (
            <button
              key={p}
              className="font-mono text-[8px] uppercase tracking-wider bg-app-bg2 hover:bg-app-bg3 border border-white/[0.08] rounded-sm px-2 py-0.5 text-app-fg3 hover:text-app-fg2 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-app-fg3 hover:text-app-fg2 transition-colors">
          <Settings size={11} />
          <span className="font-mono text-[9px]">Settings</span>
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[8px] uppercase tracking-[0.15em] text-app-fg3/50 px-4 pt-4 pb-1.5">
      {children}
    </div>
  );
}

function SessionItem({
  session,
  isActive,
  onSelect,
}: {
  session: Session;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      onClick={onSelect}
      className={`
        w-full text-left px-4 py-2 transition-colors relative
        ${isActive
          ? "bg-app-bg3 border-l-2 border-app-primary"
          : "hover:bg-app-bg2 border-l-2 border-transparent"
        }
      `}
    >
      <p className={`font-sans text-[11px] truncate ${isActive ? "text-app-fg1" : "text-app-fg2"}`}>
        {session.title}
      </p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span
          className="font-mono text-[8px] uppercase"
          style={{ color: PROVIDER_COLORS[session.provider] ?? "#9DA9A0" }}
        >
          {session.provider}
        </span>
        <span className="text-app-fg3/40 text-[8px]">·</span>
        <span className="font-mono text-[8px] text-app-fg3/50">{session.mode}</span>
      </div>
    </motion.button>
  );
}

function PlaceholderItem({ label }: { label: string }) {
  return (
    <div className="px-4 py-1.5">
      <p className="font-mono text-[10px] text-app-fg3/40 truncate">{label}</p>
    </div>
  );
}
