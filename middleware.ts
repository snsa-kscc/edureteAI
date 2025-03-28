import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isRootRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, request) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId;

  if (userId && isRootRoute(request)) {
    const uuid = uuidv4();
    return NextResponse.redirect(new URL(`/c/${uuid}`, request.url));
  }

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
  matcher: ["/((?!_next|api/(?!chat)|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
