import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const applyMiddlewareSupabaseClient = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 인증이 필요한 경로 체크
  const isAuthRequired = !request.nextUrl.pathname.startsWith("/auth");

  if (!session?.user && request.nextUrl.pathname === "/") {
    // 인증되지 않은 사용자가 /로 접근할 경우 /auth로 리다이렉트
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (!session?.user && isAuthRequired) {
    // 인증되지 않은 사용자를 /auth로 리다이렉트
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (session?.user && request.nextUrl.pathname.startsWith("/auth")) {
    // 이미 인증된 사용자를 메인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
};

export async function middleware(request: NextRequest) {
  return await applyMiddlewareSupabaseClient(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
