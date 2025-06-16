import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Store current request url in a custom header, which you can read later
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  const cookieStore = request.cookies;
  const loggedIn = cookieStore.has("session");

  const path = request.nextUrl.pathname;

  // if not loggedin
  if (!loggedIn) {
    if (path.startsWith("/account")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (path.startsWith("/auth/create") && path !== "/auth/action") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  } else {
    if (path.startsWith("/auth") && !path.startsWith("/auth/create")) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // Always add the path header to the response
  const response = NextResponse.next({
    request: {
      headers: headers,
    },
  });
  response.headers.set("x-current-path", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
