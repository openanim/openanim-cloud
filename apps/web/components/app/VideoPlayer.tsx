"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import type { RenderSegment } from "@/lib/mock-session";

// Module-level constant — computed identically on server and client, eliminating hydration mismatch
const WAVEFORM_BARS = Array.from({ length: 48 }, (_, i) =>
  Math.round((Math.abs(Math.sin(i * 0.4) * 0.6 + Math.sin(i * 0.9) * 0.3) * 100) * 100) / 100
);


interface VideoPlayerProps {
  src?: string;
  segments?: RenderSegment[];
  durationSec: number;
}

export default function VideoPlayer({ src, segments = [], durationSec }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = durationSec > 0 ? (currentTime / durationSec) * 100 : 0;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= durationSec) {
            setIsPlaying(false);
            return 0;
          }
          return t + 0.05;
        });
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, durationSec]);

  const toggle = () => {
    if (src && videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
    setIsPlaying((p) => !p);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const t = ratio * durationSec;
    setCurrentTime(t);
    if (videoRef.current) videoRef.current.currentTime = t;
  };


  return (
    <div className="relative bg-app-black aspect-video rounded-sm overflow-hidden group select-none">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          muted={muted}
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
        />
      ) : (
        /* Placeholder frame */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-app-bg1">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(#D3C6AA 1px, transparent 1px), linear-gradient(90deg, #D3C6AA 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Waveform */}
          <div className="flex items-end gap-[2px] h-12 mb-3 z-10">
            {WAVEFORM_BARS.map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-app-primary/30"
                style={{ height: `${Math.max(h, 8)}%` }}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] text-app-fg2/50 uppercase tracking-widest z-10">
            No Preview
          </span>
        </div>
      )}

      {/* Duration badge top-left */}
      <div className="absolute top-2 left-2 font-mono text-[9px] text-app-fg2 bg-app-black/70 px-2 py-0.5 backdrop-blur-sm rounded-sm border border-white/[0.06]">
        {formatTime(currentTime)} / {formatTime(durationSec)}
      </div>

      {/* Controls overlay — shown on hover */}
      <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-app-black/80 to-transparent pointer-events-none" />

        {/* Segment markers + scrubber */}
        <div className="relative mx-3 mb-1 z-10">
          {/* Segment markers */}
          <div className="relative h-[6px] mb-1">
            {segments.map((seg) => (
              <div
                key={seg.id}
                title={seg.label}
                className="absolute top-0 w-[2px] h-full rounded-full"
                style={{
                  left: `${(seg.startSec / durationSec) * 100}%`,
                  backgroundColor: seg.color,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="relative h-[2px] bg-white/10 cursor-pointer rounded-full overflow-hidden"
            onClick={seek}
          >
            <div
              className="absolute left-0 top-0 h-full bg-app-primary transition-none rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-2 px-3 pb-2 z-10">
          <button onClick={toggle} className="text-app-fg1 hover:text-app-primary transition-colors p-1">
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={() => setMuted((m) => !m)} className="text-app-fg2 hover:text-app-primary transition-colors p-1">
            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <div className="flex-1" />
          <button
            className="text-app-fg2 hover:text-app-primary transition-colors p-1"
            onClick={() => videoRef.current?.requestFullscreen?.()}
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 10);
  return `${m}:${String(s).padStart(2, "0")}.${ms}`;
}
