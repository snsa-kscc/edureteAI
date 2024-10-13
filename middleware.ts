import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!isPublicRoute(request)) {
    auth().protect();

    if (isDashboardRoute(request)) {
      const { orgRole } = auth();
      if (!orgRole) {
        return NextResponse.rewrite(new URL("/404", request.url));
      }
    }
  }
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(trpc)(.*)"],
};
