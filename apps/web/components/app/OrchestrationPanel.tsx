"use client";

import { useEffect, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Message from "./Message";
import PromptInput from "./PromptInput";
import type { Session } from "@/lib/mock-session";

interface OrchestrationPanelProps {
  session: Session;
  isStreaming: boolean;
  onSubmitPrompt: (text: string) => void;
}

export default function OrchestrationPanel({
  session,
  isStreaming,
  onSubmitPrompt,
}: OrchestrationPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isStreaming]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      overflow: "hidden",
      background: "var(--black)",
      minWidth: 0,
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 1.5rem",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.8rem",
          color: "var(--fg-1)",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {session.title}
        </span>
      </div>

      {/* Message stream */}
      <ScrollArea.Root style={{ flex: 1, overflow: "hidden" }}>
        <ScrollArea.Viewport style={{ height: "100%", width: "100%" }}>
          <div style={{
            maxWidth: "48rem",
            margin: "0 auto",
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}>
            {session.messages.length === 0 ? (
              <EmptyState />
            ) : (
              session.messages.map((msg) => (
                <Message key={msg.id} message={msg} />
              ))
            )}

            {isStreaming && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.25rem 0" }}>
                <StreamingDots />
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: "rgba(157,169,160,0.45)",
                  letterSpacing: "0.05em",
                }}>
                  Compiling…
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          style={{ display: "flex", width: "5px", padding: "1px", background: "transparent", transition: "background 0.2s" }}
        >
          <ScrollArea.Thumb style={{ flex: 1, borderRadius: "9999px", background: "rgba(255,255,255,0.08)" }} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Prompt input */}
      <PromptInput onSubmit={onSubmitPrompt} isStreaming={isStreaming} />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: "0.75rem",
    }}>
      <div style={{
        width: "2.25rem",
        height: "2.25rem",
        borderRadius: "3px",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-1)",
      }}>
        <span style={{ color: "#A7C080", fontSize: "1rem", fontFamily: "var(--font-mono)" }}>▶</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--fg-2)", marginBottom: "0.3rem" }}>
          Ready to compile
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(157,169,160,0.4)" }}>
          Describe a scene · e.g. "Fourier transform animation"
        </p>
      </div>
    </div>
  );
}

function StreamingDots() {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(167,192,128,0.5)",
            display: "block",
            animation: "pulse 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}
