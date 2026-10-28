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

  return (
    <header className="border-b border-[#E1E5DF] bg-[#FFFFFF] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
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
            <span className="font-semibold text-sm tracking-tight text-[#202522] group-hover:text-[#174C3C] transition-colors">
              HIMALKOM IPB
            </span>
            <span className="text-[11px] text-[#737A74] tracking-wide uppercase font-medium">
              Grand Survey 2026
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-sm">
          <Link
            href="/privacy"
            className="text-[#636B65] hover:text-[#174C3C] transition-colors font-medium text-xs sm:text-sm"
          >
            Privasi Data
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-[#D5A85B] bg-[#FAF5EB] border border-[#D5A85B]/30 px-2.5 py-1 rounded text-xs font-semibold hover:bg-[#FAF5EB]/80 transition-colors"
            >
              Panel Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#737A74] hidden md:inline truncate max-w-[160px]">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <Link
                  href="/survey"
                  className="bg-[#174C3C] text-white px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-[#123B2F] transition-colors"
                >
                  Kuesioner
                </Link>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#174C3C] text-white px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-[#123B2F] transition-colors"
            >
              Masuk Akun IPB
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
