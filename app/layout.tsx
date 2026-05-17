import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "OpenAnim — Deterministic Video Generation",
    template: "%s | OpenAnim"
  },
  description:
    "Video generation that doesn't hallucinate. Describe your video and receive deterministic, editable rendering pipelines powered by Manim, Remotion, and programmable visual systems.",
  keywords: ["AI video generation", "Manim", "Remotion", "deterministic rendering", "OpenAnim"],
  openGraph: {
    title: "OpenAnim — Deterministic Video Generation",
    description: "Video generation that doesn't hallucinate.",
    type: "website",
    siteName: "OpenAnim",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenAnim — Deterministic Video Generation",
    description: "Video generation that doesn't hallucinate.",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
