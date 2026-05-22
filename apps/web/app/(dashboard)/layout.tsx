import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  // AppShell provides its own full-screen layout — no wrapper here
  return <>{children}</>;
}
