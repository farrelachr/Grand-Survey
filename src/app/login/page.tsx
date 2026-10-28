"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendOtpOrMagicLink, verifyOtp } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [step, setStep] = useState<"enter_email" | "enter_otp">("enter_email");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(initialError || "");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await sendOtpOrMagicLink(email);
      if (!res.success) {
        setErrorMsg(res.error || "Gagal memproses email.");
      } else {
        setSuccessMsg(res.message || "Tautan dan kode verifikasi telah dikirimkan!");
        setStep("enter_otp");
      }
    } catch {
      setErrorMsg("Terjadi gangguan jaringan. Silakan periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await verifyOtp(email, otpToken);
      if (!res.success) {
        setErrorMsg(res.error || "Verifikasi kode gagal.");
      } else {
        router.push("/survey");
        router.refresh();
      }
    } catch {
      setErrorMsg("Gagal melakukan verifikasi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E1E5DF] rounded p-8 sm:p-10 shadow-sm">
      {/* Editorial Eyebrow & Brand */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-3">
          <span className="w-9 h-9 rounded bg-[#174C3C] text-white flex items-center justify-center font-bold text-base mx-auto">
            H
          </span>
        </Link>
        <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#737A74]">
          Grand Survey HIMALKOM 2026
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#202522] mt-1">
          Autentikasi Mahasiswa
        </h1>
        <p className="text-sm text-[#636B65] mt-2">
          Gunakan email resmi IPB University Anda (<span className="font-mono text-xs text-[#174C3C]">@apps.ipb.ac.id</span> atau <span className="font-mono text-xs text-[#174C3C]">@ipb.ac.id</span>) untuk memulai.
        </p>
      </div>

      {/* Status Alerts */}
      {errorMsg && (
        <div className="mb-6 p-3.5 rounded bg-[#FEE4E2] border border-[#B42318]/20 flex items-start gap-2.5 text-xs text-[#B42318]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3.5 rounded bg-[#EBF2EE] border border-[#174C3C]/20 flex items-start gap-2.5 text-xs text-[#174C3C]">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {step === "enter_email" ? (
        <div>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#202522] uppercase tracking-wide mb-1.5">
                Email Mahasiswa IPB
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737A74]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="nama_mhs@apps.ipb.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FFFFFF] border border-[#E1E5DF] rounded text-sm text-[#202522] placeholder:text-[#737A74]/60 focus:border-[#174C3C] transition-colors"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#737A74]">
                Tautan sekali pakai atau kode OTP akan dikirimkan langsung ke email Anda.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#174C3C] text-white py-2.5 px-4 rounded text-sm font-semibold hover:bg-[#123B2F] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi domain...</span>
                </>
              ) : (
                <>
                  <span>Kirim Tautan / Kode OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E1E5DF]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FFFFFF] px-2 text-[#737A74]">atau</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-[#E1E5DF] bg-[#FFFFFF] text-[#202522] py-2.5 px-4 rounded text-sm font-medium hover:bg-[#F7F7F2] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60"
          >
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
          </button>
        </div>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-xs font-semibold text-[#202522] uppercase tracking-wide mb-1.5">
              Masukkan 6 Digit Kode OTP
            </label>
            <input
              id="token"
              type="text"
              required
              maxLength={6}
              placeholder="123456"
              value={otpToken}
              onChange={(e) => setOtpToken(e.target.value)}
              className="w-full text-center tracking-widest font-mono text-lg py-2.5 bg-[#FFFFFF] border border-[#E1E5DF] rounded text-[#202522] focus:border-[#174C3C]"
            />
            <p className="mt-1 text-[11px] text-[#737A74]">
              Kode dikirimkan ke <span className="font-semibold text-[#202522]">{email}</span>. Anda juga dapat langsung mengklik tautan di dalam email.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otpToken.length < 6}
            className="w-full bg-[#174C3C] text-white py-2.5 px-4 rounded text-sm font-semibold hover:bg-[#123B2F] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi kode...</span>
              </>
            ) : (
              <span>Konfirmasi & Mulai Survei</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("enter_email");
              setErrorMsg("");
            }}
            className="w-full text-center text-xs text-[#737A74] hover:text-[#174C3C] pt-2"
          >
            Ganti alamat email
          </button>
        </form>
      )}

      {/* Security badge note */}
      <div className="mt-8 pt-6 border-t border-[#E1E5DF] flex items-start gap-2.5 text-[11px] text-[#737A74] leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-[#174C3C] shrink-0 mt-0.5" />
        <span>
          Verifikasi email diperlukan semata-mata untuk mencegah spam dan respon ganda. Alamat email tidak pernah dipublikasikan.
        </span>
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
