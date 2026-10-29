import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { MailWarning, ArrowRight, Home, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Gunakan Akun IPB University — Grand Survey HIMALKOM 2026",
  description: "Pemberitahuan penggunaan akun email resmi IPB University (@apps.ipb.ac.id) untuk mengisi Grand Survey HIMALKOM 2026.",
};

export const dynamic = "force-dynamic";

export default async function UnauthorizedDomainPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-lg w-full bg-[#FFFFFF] border border-[#E1E5DF] rounded p-8 sm:p-10 shadow-sm text-center">
          {/* Logo & Warning Icon */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 relative shrink-0">
              <Image
                src="/himalkom-logo.png"
                alt="Logo HIMALKOM IPB"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FAF5EB] border border-[#D5A85B]/30 text-[#D5A85B] flex items-center justify-center shrink-0">
              <MailWarning className="w-6 h-6" />
            </div>
          </div>

          <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#B88728] bg-[#FAF5EB] border border-[#D5A85B]/30 px-3 py-1 rounded-full mb-3">
            Akses Terbatas Mahasiswa IPB
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202522]">
            Gunakan Akun Email IPB University
          </h1>

          <p className="mt-3 text-sm text-[#636B65] leading-relaxed">
            Survei ini diselenggarakan secara eksklusif untuk mahasiswa Departemen Ilmu Komputer IPB University. Sistem mendeteksi Anda mencoba masuk menggunakan akun email di luar domain resmi IPB:
          </p>

          {/* Detected Email Display */}
          {email && (
            <div className="mt-4 p-3 rounded bg-[#FEE4E2]/50 border border-[#B42318]/20 text-xs font-mono text-[#B42318] break-all">
              {email}
            </div>
          )}

          {/* Allowed Domain Info */}
          <div className="mt-6 text-left bg-[#F7F7F2] border border-[#E1E5DF] rounded p-4 text-xs space-y-2">
            <p className="font-semibold text-[#202522]">
              Domain yang diizinkan untuk masuk ke sistem survei:
            </p>
            <div className="space-y-1.5 text-[#636B65]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174C3C] shrink-0" />
                <span>
                  <strong className="text-[#202522]">@apps.ipb.ac.id</strong> — Akun Google resmi mahasiswa IPB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174C3C] shrink-0" />
                <span>
                  <strong className="text-[#202522]">@ipb.ac.id</strong> — Akun institusi staf/dosen IPB
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#174C3C] text-white px-5 py-3 rounded text-sm font-semibold hover:bg-[#123B2F] transition-all shadow-sm"
            >
              <span>Ganti Akun & Masuk Ulang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded text-sm font-semibold text-[#202522] border border-[#E1E5DF] bg-[#FFFFFF] hover:bg-[#F7F7F2] transition-colors"
            >
              <Home className="w-4 h-4 text-[#737A74]" />
              <span>Beranda</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
