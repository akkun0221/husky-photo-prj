import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// middleware.ts は常に Edge Runtime で動作する。Node.js 専用API（fs, Buffer 等）は使用禁止。
export async function middleware(request: NextRequest) {
  // Preview環境（stagingブランチ含む）のみ Basic Auth を要求
  if (process.env.VERCEL_ENV === "preview") {
    const basicAuth = request.headers.get("authorization");

    if (!basicAuth || !basicAuth.startsWith("Basic ")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Staging"' },
      });
    }

    const decoded = atob(basicAuth.slice(6));
    const colonIndex = decoded.indexOf(":");
    const username = decoded.slice(0, colonIndex);
    const password = decoded.slice(colonIndex + 1);

    if (
      username !== process.env.BASIC_AUTH_USER ||
      password !== process.env.BASIC_AUTH_PASSWORD
    ) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Staging"' },
      });
    }
  }

  // /admin 以外はここで終了
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
