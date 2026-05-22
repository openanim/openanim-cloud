"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { X } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import SceneIRPanel from "./SceneIRPanel";
import type { ArtifactData, Session, SceneNode } from "@/lib/mock-session";

interface ArtifactInspectorProps {
  session: Session | null;
  artifact: ArtifactData | null;
  onClose: () => void;
}

export default function ArtifactInspector({ session, artifact, onClose }: ArtifactInspectorProps) {
  return (
    <div className="flex flex-col h-full w-[360px] bg-app-bg1 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] flex-shrink-0">
        <span className="font-mono text-[9px] uppercase tracking-widest text-app-fg3/60">
          Inspector
        </span>
        <button
          onClick={onClose}
          className="text-app-fg3 hover:text-app-fg1 transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {!artifact ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-[10px] text-app-fg3/50 text-center leading-relaxed px-6">
            Select an artifact<br />to inspect
          </p>
        </div>
      ) : (
        <>
          {/* Artifact identity */}
          <div className="px-4 py-2.5 border-b border-white/[0.08] flex-shrink-0">
            <p className="font-mono text-xs text-app-fg1 truncate">{artifact.name}</p>
            <p className="font-mono text-[9px] text-app-fg3 mt-0.5">
              {artifact.provider.toUpperCase()} · v{artifact.version} · #{artifact.hash}
            </p>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue="graph" className="flex flex-col flex-1 overflow-hidden">
            <Tabs.List className="flex border-b border-white/[0.08] bg-transparent px-2 gap-0 flex-shrink-0">
              {["graph", "timeline", "assets", "json"].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="
                    font-mono text-[9px] uppercase tracking-wider px-3 py-2.5
                    text-app-fg3 data-[state=active]:text-app-fg1
                    border-b-2 border-transparent data-[state=active]:border-app-primary
                    -mb-[1px] transition-colors cursor-pointer outline-none
                  "
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* GRAPH */}
            <Tabs.Content value="graph" className="flex-1 overflow-hidden">
              <ScrollArea.Root className="h-full">
                <ScrollArea.Viewport className="h-full w-full">
                  <div className="p-2">
                    <SceneIRPanel node={artifact.sceneIR} />
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" className="flex w-[4px] p-[1px]">
                  <ScrollArea.Thumb className="flex-1 rounded-full bg-white/10" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </Tabs.Content>

            {/* TIMELINE */}
            <Tabs.Content value="timeline" className="flex-1 overflow-auto p-4">
              <p className="font-mono text-[9px] text-app-fg3 uppercase tracking-widest mb-3">
                Render Timeline · {artifact.durationSec}s
              </p>
              {/* Timeline bar */}
              <div className="relative h-8 bg-app-bg2 border border-white/[0.08] rounded-sm overflow-hidden mb-4">
                {artifact.segments.map((seg) => (
                  <div
                    key={seg.id}
                    title={seg.label}
                    className="absolute top-0 h-full border-r border-white/[0.08]"
                    style={{
                      left: `${(seg.startSec / artifact.durationSec) * 100}%`,
                      width: `${((seg.endSec - seg.startSec) / artifact.durationSec) * 100}%`,
                      backgroundColor: seg.color + "40",
                    }}
                  />
                ))}
              </div>
              {/* Segment legend */}
              <div className="flex flex-col gap-2">
                {artifact.segments.map((seg) => (
                  <div key={seg.id} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="font-mono text-[10px] text-app-fg2 flex-1">{seg.label}</span>
                    <span className="font-mono text-[9px] text-app-fg3">
                      {seg.startSec.toFixed(1)}s → {seg.endSec.toFixed(1)}s
                    </span>
                  </div>
                ))}
              </div>
            </Tabs.Content>

            {/* ASSETS */}
            <Tabs.Content value="assets" className="flex-1 overflow-auto p-4">
              <p className="font-mono text-[9px] text-app-fg3 uppercase tracking-widest mb-3">
                Scene Nodes
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {flattenNodes(artifact.sceneIR).map((node) => (
                  <div key={node.id} className="flex items-start gap-2">
                    <span className="font-mono text-[9px] bg-app-bg2 border border-white/[0.08] px-1.5 py-0.5 text-app-fg3 rounded-sm flex-shrink-0 mt-0.5">
                      {node.type}
                    </span>
                    <div>
                      <p className="font-mono text-[10px] text-app-fg1">{node.label}</p>
                      {node.props && (
                        <p className="font-mono text-[9px] text-app-fg3 truncate max-w-[220px]">
                          {Object.entries(node.props)
                            .slice(0, 2)
                            .map(([k, v]) => `${k}: ${String(v)}`)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[9px] text-app-fg3 uppercase tracking-widest mb-3">
                Render Metadata
              </p>
              <div className="flex flex-col gap-2">
                {[
                  ["Provider", artifact.provider.toUpperCase()],
                  ["Renderer", artifact.renderer],
                  ["Resolution", "1920×1080"],
                  ["FPS", "60"],
                  ["Duration", `${artifact.durationSec}s`],
                  ["Render Time", `${(artifact.renderTimeMs / 1000).toFixed(2)}s`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="font-mono text-[9px] text-app-fg3">{k}</span>
                    <span className="font-mono text-[9px] text-app-fg1">{v}</span>
                  </div>
                ))}
              </div>
            </Tabs.Content>

            {/* JSON */}
            <Tabs.Content value="json" className="flex-1 overflow-hidden">
              <ScrollArea.Root className="h-full">
                <ScrollArea.Viewport className="h-full w-full">
                  <pre
                    className="font-mono text-[10px] text-app-fg2 p-4 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlight(
                        JSON.stringify({ ...artifact, src: undefined }, null, 2)
                      ),
                    }}
                  />
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" className="flex w-[4px] p-[1px]">
                  <ScrollArea.Thumb className="flex-1 rounded-full bg-white/10" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </Tabs.Content>
          </Tabs.Root>
        </>
      )}
    </div>
  );
}

function flattenNodes(node: SceneNode): SceneNode[] {
  return [node, ...(node.children?.flatMap(flattenNodes) ?? [])];
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"([^"]+)":/g, `<span style="color:#7FBBB3">"$1"</span>:`)
    .replace(/: "([^"]*)"/g, `: <span style="color:#A7C080">"$1"</span>`)
    .replace(/: (\d+\.?\d*)/g, `: <span style="color:#DBBC7F">$1</span>`)
    .replace(/: (true|false|null)/g, `: <span style="color:#E67E80">$1</span>`);
}
