import { createClient } from "@/lib/supabase/server";
import { validateStudentEmail } from "@/lib/auth-validation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/survey";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const validation = validateStudentEmail(user.email);
        if (!validation.isValid) {
          // Reject invalid domain immediately, sign out and redirect to unauthorized domain notice page
          await supabase.auth.signOut();
          return NextResponse.redirect(
            new URL(`/unauthorized-domain?email=${encodeURIComponent(user.email)}`, request.url)
          );
        }
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return to login if exchange failed
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent("Gagal memvalidasi sesi autentikasi. Silakan coba lagi.")}`, request.url)
  );
}
