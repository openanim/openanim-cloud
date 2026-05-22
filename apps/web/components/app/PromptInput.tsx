"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Provider } from "@/lib/mock-session";

interface PromptInputProps {
  onSubmit: (text: string) => void;
  isStreaming: boolean;
  provider: Provider;
  onProviderChange: (p: Provider) => void;
}

const PROVIDERS: { value: Provider; label: string }[] = [
  { value: "manim", label: "Manim" },
  { value: "remotion", label: "Remotion" },
  { value: "ffmpeg", label: "FFmpeg" },
  { value: "custom", label: "Custom" },
];

export default function PromptInput({
  onSubmit,
  isStreaming,
  provider,
  onProviderChange,
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSubmit(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="border-t border-white/[0.08] bg-app-black px-4 py-4 flex-shrink-0">
      <div className="flex flex-col gap-2 max-w-3xl mx-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          {/* Provider selector */}
          <div className="flex items-center gap-1 bg-app-bg1 border border-white/[0.08] rounded-sm p-0.5">
            {PROVIDERS.map((p) => (
              <button
                key={p.value}
                onClick={() => onProviderChange(p.value)}
                className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-[2px] transition-all ${
                  provider === p.value
                    ? "bg-app-bg3 text-app-fg1 border border-white/20"
                    : "text-app-fg3 hover:text-app-fg2"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {/* Mode indicator */}
          <span className="font-mono text-[9px] text-app-fg3/60 bg-app-bg1 border border-white/[0.08] px-2 py-1 rounded-sm">
            LOCAL
          </span>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder="Describe a scene to compile…"
            className={`
              w-full min-h-[72px] max-h-[200px] resize-none
              bg-app-bg1 border border-white/[0.08] focus:border-white/20
              rounded-sm p-3 pr-4
              font-sans text-sm text-app-fg1 placeholder:text-app-fg3/50
              outline-none transition-colors leading-relaxed
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            rows={3}
          />
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-app-fg3/40">
            ↵ Enter to render · Shift + ↵ for newline
          </span>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={submit}
            disabled={isStreaming || !value.trim()}
            className={`
              font-mono text-xs px-4 py-1.5 rounded-sm transition-all
              ${isStreaming || !value.trim()
                ? "bg-app-primary/30 text-app-black/50 cursor-not-allowed"
                : "bg-app-primary text-app-black hover:bg-app-primary/90 cursor-pointer"
              }
            `}
          >
            {isStreaming ? "◼ Running…" : "▶ Render"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
