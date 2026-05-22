
// Re-enable auth: uncomment the line below and remove the bypass function
export { auth as proxy } from "@/auth";

// Remove this bypass block once credentials are set:
// export function proxy(_request: NextRequest) {
//   return NextResponse.next();
// }


export const config = {
  matcher: ["/dashboard/:path*"],
};
