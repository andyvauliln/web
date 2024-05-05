// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

//const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// export default clerkMiddleware((auth, request) => {
//   if (isProtectedRoute(request)) auth().protect();
// });

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default clerkMiddleware();

// export const config = {
//   matcher: ["/api/*", "/dashboard/*"],  // Protect specific routes
// };