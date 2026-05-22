"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2, XCircle, ChevronRight, ChevronDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStep } from "@/lib/mock-session";

interface PipelineVizProps {
  steps: PipelineStep[];
}

export default function PipelineViz({ steps }: PipelineVizProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleLog = (id: string) =>
    setExpandedLogs((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const totalMs = steps.reduce((a, s) => a + (s.durationMs ?? 0), 0);
  const doneCount = countDone(steps);
  const totalCount = countAll(steps);

  return (
    <div className="bg-app-bg1 border border-white/[0.08] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Activity size={10} className="text-app-primary" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-app-fg2/70">
            Render Pipeline
          </span>
        </div>
        <span className="font-mono text-[9px] text-app-fg3 bg-app-bg2 border border-white/[0.08] px-2 py-0.5 rounded-sm">
          {(totalMs / 1000).toFixed(2)}s
        </span>
      </div>

      {/* Steps */}
      <div className="py-1">
        {steps.map((step) => (
          <StepRow
            key={step.id}
            step={step}
            depth={0}
            expanded={expanded}
            expandedLogs={expandedLogs}
            onToggle={toggle}
            onToggleLog={toggleLog}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-app-bg3">
        <div
          className="h-full bg-app-primary transition-all duration-700"
          style={{ width: `${(doneCount / Math.max(totalCount, 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function StepRow({
  step,
  depth,
  expanded,
  expandedLogs,
  onToggle,
  onToggleLog,
}: {
  step: PipelineStep;
  depth: number;
  expanded: Set<string>;
  expandedLogs: Set<string>;
  onToggle: (id: string) => void;
  onToggleLog: (id: string) => void;
}) {
  const hasChildren = (step.children?.length ?? 0) > 0;
  const hasLog = !!step.log;
  const isExpanded = expanded.has(step.id);
  const isLogExpanded = expandedLogs.has(step.id);

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-app-bg2 transition-colors"
        style={{ paddingLeft: depth * 16 + 16, paddingRight: 16 }}
        onClick={() => {
          if (hasChildren) onToggle(step.id);
          else if (hasLog) onToggleLog(step.id);
        }}
      >
        {/* Connector */}
        {depth > 0 && (
          <span className="font-mono text-app-fg3/30 text-xs select-none -ml-2 mr-0">╰─</span>
        )}

        {/* Status icon */}
        <StatusIcon status={step.status} />

        {/* Label */}
        <span className={cn(
          "font-mono text-xs flex-1",
          step.status === "done" ? "text-app-fg1" :
          step.status === "running" ? "text-app-fg1" :
          step.status === "error" ? "text-app-red" : "text-app-fg3"
        )}>
          {step.label}
        </span>

        {/* Duration */}
        {step.durationMs !== undefined && (
          <span className="font-mono text-[9px] text-app-fg3 bg-app-bg2 border border-white/[0.08] px-1.5 py-0.5 rounded-sm">
            {step.durationMs >= 1000
              ? `${(step.durationMs / 1000).toFixed(1)}s`
              : `${step.durationMs}ms`}
          </span>
        )}

        {/* Chevron */}
        {hasChildren && (
          <span className="text-app-fg3 ml-1">
            {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </span>
        )}
        {!hasChildren && hasLog && (
          <span className="text-app-fg3 ml-1">
            {isLogExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </span>
        )}
      </div>

      {/* Log expansion */}
      <AnimatePresence>
        {isLogExpanded && hasLog && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <pre
              className="font-mono text-[10px] text-app-fg2 bg-app-black p-3 border-t border-white/[0.08] overflow-x-auto leading-relaxed"
              style={{ marginLeft: depth * 16 + 16 }}
            >
              {step.log}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {step.children!.map((child) => (
              <StepRow
                key={child.id}
                step={child}
                depth={depth + 1}
                expanded={expanded}
                expandedLogs={expandedLogs}
                onToggle={onToggle}
                onToggleLog={onToggleLog}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusIcon({ status }: { status: PipelineStep["status"] }) {
  if (status === "done") return <CheckCircle2 size={12} className="text-app-primary flex-shrink-0" />;
  if (status === "running") return <Loader2 size={12} className="text-app-blue animate-spin flex-shrink-0" />;
  if (status === "error") return <XCircle size={12} className="text-app-red flex-shrink-0" />;
  return <Circle size={12} className="text-app-fg3/30 flex-shrink-0" />;
}

function countDone(steps: PipelineStep[]): number {
  return steps.reduce((acc, s) => {
    const me = s.status === "done" ? 1 : 0;
    const kids = s.children ? countDone(s.children) : 0;
    return acc + me + kids;
  }, 0);
}

function countAll(steps: PipelineStep[]): number {
  return steps.reduce((acc, s) => {
    return acc + 1 + (s.children ? countAll(s.children) : 0);
  }, 0);
}
