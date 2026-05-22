"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown,
  Layers, Camera, Type, Zap, Activity, Box
} from "lucide-react";
import type { SceneNode } from "@/lib/mock-session";

interface SceneIRPanelProps {
  node: SceneNode;
  depth?: number;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  Scene: Layers,
  Camera,
  Group: Layers,
  FunctionGraph: Activity,
  Text: Type,
  Transition: Zap,
};

export default function SceneIRPanel({ node, depth = 0 }: SceneIRPanelProps) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const hasProps = node.props && Object.keys(node.props).length > 0;
  const Icon = TYPE_ICONS[node.type] ?? Box;

  return (
    <div>
      {/* Node row */}
      <div
        className="flex items-center gap-1.5 py-1 px-2 hover:bg-app-bg2 rounded-sm cursor-pointer transition-colors"
        style={{ paddingLeft: depth * 14 + 8 }}
        onClick={() => setIsExpanded((e) => !e)}
      >
        {/* Expand toggle */}
        <span className="text-app-fg3 flex-shrink-0 w-3">
          {(hasChildren || hasProps) ? (
            isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />
          ) : null}
        </span>

        {/* Type icon */}
        <Icon
          size={11}
          className={isExpanded ? "text-app-primary" : "text-app-fg3"}
        />

        {/* Type badge */}
        <span className="font-mono text-[9px] bg-app-bg2 border border-white/[0.08] px-1 py-0.5 text-app-fg3 rounded-sm">
          {node.type}
        </span>

        {/* Label */}
        <span className="font-mono text-[10px] text-app-fg1">{node.label}</span>
      </div>

      {/* Expanded props + children */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Props */}
            {hasProps && (
              <div
                className="pb-1"
                style={{ paddingLeft: depth * 14 + 26 }}
              >
                {Object.entries(node.props!).map(([k, v]) => (
                  <div key={k} className="flex gap-2 py-0.5">
                    <span className="font-mono text-[9px] text-app-fg3">{k}:</span>
                    <span className="font-mono text-[9px] text-app-fg2 truncate max-w-[140px]">
                      {Array.isArray(v) ? `[${(v as unknown[]).join(", ")}]` : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Children */}
            {hasChildren &&
              node.children!.map((child) => (
                <SceneIRPanel key={child.id} node={child} depth={depth + 1} />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
