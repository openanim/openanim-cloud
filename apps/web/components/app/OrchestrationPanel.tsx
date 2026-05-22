"use client";

import { useEffect, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { PanelRight } from "lucide-react";
import Message from "./Message";
import PromptInput from "./PromptInput";
import type { Session, ArtifactData, Provider } from "@/lib/mock-session";

interface OrchestrationPanelProps {
  session: Session;
  isStreaming: boolean;
  showInspector: boolean;
  onToggleInspector: () => void;
  onSubmitPrompt: (text: string) => void;
  onArtifactExpand: (a: ArtifactData) => void;
  provider: Provider;
  onProviderChange: (p: Provider) => void;
}

export default function OrchestrationPanel({
  session,
  isStreaming,
  showInspector,
  onToggleInspector,
  onSubmitPrompt,
  onArtifactExpand,
  provider,
  onProviderChange,
}: OrchestrationPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isStreaming]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-app-black min-w-0">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-sans text-sm text-app-fg1 font-medium truncate">
            {session.title}
          </span>
          <span className="font-mono text-[9px] text-app-fg3/60 bg-app-bg1 border border-white/[0.08] px-2 py-0.5 rounded-sm uppercase flex-shrink-0">
            {session.provider}
          </span>
        </div>
        <button
          onClick={onToggleInspector}
          title="Toggle Inspector"
          className={`p-1.5 rounded-sm transition-colors hover:bg-app-bg2 ${
            showInspector ? "text-app-primary" : "text-app-fg3 hover:text-app-fg1"
          }`}
        >
          <PanelRight size={14} />
        </button>
      </div>

      {/* Message stream */}
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">
          <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
            {session.messages.length === 0 ? (
              <EmptyState />
            ) : (
              session.messages.map((msg) => (
                <Message
                  key={msg.id}
                  message={msg}
                  onArtifactExpand={onArtifactExpand}
                />
              ))
            )}

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="flex items-center gap-2.5 py-1">
                <StreamingDots />
                <span className="font-mono text-[10px] text-app-fg3/60">Compiling…</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex w-[5px] touch-none select-none p-[1px] bg-transparent transition-colors hover:bg-app-bg2 mr-0.5"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-white/10" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Prompt input */}
      <PromptInput
        onSubmit={onSubmitPrompt}
        isStreaming={isStreaming}
        provider={provider}
        onProviderChange={onProviderChange}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3">
      <div className="w-10 h-10 rounded-sm border border-white/[0.08] flex items-center justify-center bg-app-bg1">
        <span className="text-app-primary text-lg font-mono">▶</span>
      </div>
      <div className="text-center">
        <p className="font-mono text-xs text-app-fg2 mb-1">Ready to compile</p>
        <p className="font-mono text-[10px] text-app-fg3/60">
          Describe a scene to render · e.g. "Fourier transform using Manim"
        </p>
      </div>
    </div>
  );
}

function StreamingDots() {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-app-primary/60 animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );
}
