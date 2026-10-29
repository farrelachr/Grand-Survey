import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth-validation";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.email ? isAdminEmail(user.email) : false;

  let userSubmissionId: string | null = null;
  if (user) {
    const { data: sub } = await supabase
      .from("survey_submissions")
      .select("id")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (sub) {
      userSubmissionId = sub.id;
    }
  }

  return (
    <header className="border-b border-[#E1E5DF] bg-[#FFFFFF] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex items-center justify-center shrink-0">
            <Image
              src="/himalkom-logo.png"
              alt="Logo HIMALKOM IPB"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-[#202522] group-hover:text-[#174C3C] transition-colors whitespace-nowrap">
              HIMALKOM IPB
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#737A74] tracking-wide uppercase font-medium hidden sm:inline">
              Grand Survey 2026
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 text-sm shrink-0">
          <Link
            href="/privacy"
            className="text-[#636B65] hover:text-[#174C3C] transition-colors font-medium text-xs sm:text-sm hidden sm:inline whitespace-nowrap"
          >
            Privasi Data
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-[#D5A85B] bg-[#FAF5EB] border border-[#D5A85B]/30 px-2 py-1 sm:px-2.5 sm:py-1 rounded text-[11px] sm:text-xs font-semibold hover:bg-[#FAF5EB]/80 transition-colors whitespace-nowrap"
            >
              Panel Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-[#737A74] hidden md:inline truncate max-w-[160px]">
                {user.email}
              </span>
              {userSubmissionId && !isAdmin ? (
                <Link
                  href={`/result/${userSubmissionId}`}
                  className="bg-[#174C3C] text-white px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-[#123B2F] transition-colors whitespace-nowrap shadow-xs"
                >
                  Hasil Saya
                </Link>
              ) : (
                <Link
                  href="/survey"
                  className="bg-[#174C3C] text-white px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-[#123B2F] transition-colors whitespace-nowrap shadow-xs"
                >
                  Kuesioner
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#174C3C] text-white px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-[#123B2F] transition-colors whitespace-nowrap shadow-xs"
            >
              Masuk
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
