"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const initialError = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(initialError || "");

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/survey`,
          queryParams: {
            hd: "apps.ipb.ac.id",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setErrorMsg("Gagal membuka jendela Google Auth: " + error.message);
        setLoading(false);
      }
    } catch {
      setErrorMsg("Terjadi kegagalan memulai autentikasi Google.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E1E5DF] rounded p-8 sm:p-10 shadow-sm text-center">
      {/* Editorial Eyebrow & Brand */}
      <Link href="/" className="inline-block mb-3">
        <Image
          src="/himalkom-logo.png"
          alt="Logo HIMALKOM IPB"
          width={56}
          height={56}
          className="mx-auto object-contain"
          priority
        />
      </Link>
      <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#737A74]">
        Grand Survey HIMALKOM 2026
      </span>
      <h1 className="text-2xl font-bold tracking-tight text-[#202522] mt-1">
        Autentikasi Mahasiswa
      </h1>
      <p className="text-xs sm:text-sm text-[#636B65] mt-2 leading-relaxed">
        Masuk menggunakan akun Google resmi IPB University (<span className="font-mono text-xs text-[#174C3C]">@apps.ipb.ac.id</span> atau <span className="font-mono text-xs text-[#174C3C]">@ipb.ac.id</span>) untuk melanjutkan ke kuesioner.
      </p>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mt-6 p-3.5 rounded bg-[#FEE4E2] border border-[#B42318]/20 flex items-start gap-2.5 text-xs text-[#B42318] text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Primary Google OAuth Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-[#C4CCC1] bg-[#FFFFFF] text-[#202522] py-3.5 px-4 rounded text-sm font-semibold hover:bg-[#F7F7F2] hover:border-[#174C3C] transition-all flex items-center justify-center gap-3 shadow-xs disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#174C3C]" />
              <span>Menghubungkan ke Google...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Google (Akun IPB)</span>
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-8 pt-6 border-t border-[#E1E5DF] flex items-start gap-2.5 text-[11px] text-[#737A74] text-left leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-[#174C3C] shrink-0 mt-0.5" />
        <span>
          Akses dibatasi khusus akun Google IPB University. Email digunakan untuk validasi eligibility dan mencegah respon ganda.
        </span>
      </div>

      <div className="mt-4">
        <Link href="/" className="text-xs text-[#174C3C] hover:underline font-medium">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#F7F7F2]">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E1E5DF] rounded p-8 text-center text-xs text-[#737A74]">
            Memuat formulir autentikasi...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
