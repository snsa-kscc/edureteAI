import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId;

  if (!userId && !isPublicRoute(request)) {
    return (await auth()).redirectToSignIn();
  }

  if (!isPublicRoute(request)) {
    await auth.protect();

    if (isDashboardRoute(request)) {
      if (sessionClaims?.membership && Object.keys(sessionClaims.membership).length === 0) {
        return NextResponse.rewrite(new URL("/404", request.url));
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|api/(?!chat|process-referral)|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
