import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();

    if (isDashboardRoute(request)) {
      const { sessionClaims } = await auth();
      if (sessionClaims?.membership && Object.keys(sessionClaims.membership).length === 0) {
        return NextResponse.rewrite(new URL("/404", request.url));
      }
    }
  }
});

export const config = {
  matcher: ["/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
