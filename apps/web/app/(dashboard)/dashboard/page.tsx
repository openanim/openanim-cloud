import AppShell from "@/components/app/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenAnim — Studio",
  description: "Deterministic animation rendering orchestration",
};

export default function DashboardPage() {
  return <AppShell />;
}
