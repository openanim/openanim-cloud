import type { Metadata } from "next";
import SettingsShell from "@/components/app/SettingsShell";

export const metadata: Metadata = {
  title: "Settings | OpenAnim",
};

export default function SettingsPage() {
  return <SettingsShell />;
}
