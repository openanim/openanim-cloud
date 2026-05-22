export { auth as middleware } from "@/auth";

export const config = {
  // Protect /dashboard routes. Exclude static files and auth endpoints.
  matcher: ["/dashboard/:path*"],
};
