import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, ShieldCheck, Clock, Award, Users, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1">
        {/* Editorial Hero Section */}
        <section className="border-b border-[#E1E5DF] bg-[#FFFFFF] py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#174C3C]/20 bg-[#EBF2EE] text-[#174C3C] text-xs font-semibold tracking-wider uppercase mb-6">
              Grand Survey HIMALKOM 2026
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#202522] leading-[1.2] max-w-3xl">
              Seberapa mandiri kamu ketika belajar dengan AI?
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#636B65] leading-relaxed max-w-2xl">
              Survei mengenai pola penggunaan AI, proses belajar, kemampuan problem solving, dan kemandirian akademik mahasiswa Ilmu Komputer IPB University.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={user ? "/survey" : "/login"}
                className="inline-flex items-center justify-center gap-2 bg-[#174C3C] text-white px-6 py-3.5 rounded text-sm sm:text-base font-semibold hover:bg-[#123B2F] transition-all shadow-sm group"
              >
                <span>Mulai Survei</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="#tentang"
                className="inline-flex items-center justify-center px-5 py-3.5 rounded text-sm sm:text-base font-medium text-[#202522] hover:text-[#174C3C] hover:bg-[#F7F7F2] transition-colors border border-[#E1E5DF]"
              >
                Tentang Survei
              </Link>
            </div>

            {/* Quick Context Bar */}
            <div className="mt-12 pt-8 border-t border-[#E1E5DF] grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#737A74] font-medium">Penyelenggara</span>
                <span className="mt-1 block font-semibold text-sm text-[#202522]">HIMALKOM IPB</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#737A74] font-medium">Target Populasi</span>
                <span className="mt-1 block font-semibold text-sm text-[#202522]">Ilkom IPB Angkatan 62</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#737A74] font-medium">Estimasi Waktu</span>
                <span className="mt-1 block font-semibold text-sm text-[#202522]">7–10 Menit</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#737A74] font-medium">Hasil Langsung</span>
                <span className="mt-1 block font-semibold text-sm text-[#202522]">Indeks Ketergantungan AI</span>
              </div>
            </div>
          </div>
        </section>

        {/* Value & Output Explanation */}
        <section id="tentang" className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D5A85B]">Manfaat Bagi Responden</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202522] mt-1 tracking-tight">
              Apa yang akan Anda dapatkan setelah mengisi kuesioner?
            </h2>
            <p className="mt-3 text-base text-[#636B65] leading-relaxed">
              Setelah menyelesaikan survei, sistem akan secara instan menghitung evaluasi mandiri berbasis algoritma penilaian objektif tanpa menunggu pengumuman publik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] p-6 rounded border border-[#E1E5DF]">
              <div className="w-10 h-10 rounded bg-[#EBF2EE] text-[#174C3C] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#202522]">Skor Indeks Personal</h3>
              <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                Skor 0–100 yang memetakan kecenderungan ketergantungan Anda (Rendah, Sedang, atau Tinggi) berdasarkan 8 indikator sikap akademik.
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-6 rounded border border-[#E1E5DF]">
              <div className="w-10 h-10 rounded bg-[#FAF5EB] text-[#D5A85B] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#202522]">Observasi Perilaku Belajar</h3>
              <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                Ulasan deskriptif non-penghakiman mengenai kebiasaan Anda dalam coding, pemecahan error, dan verifikasi fakta keluaran AI.
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-6 rounded border border-[#E1E5DF]">
              <div className="w-10 h-10 rounded bg-[#EBF2EE] text-[#174C3C] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#202522]">Refleksi Praktis</h3>
              <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                Rekomendasi metode latihan mandiri agar Anda tetap kompetitif sebagai mahasiswa Ilmu Komputer tanpa kehilangan ketajaman problem-solving.
              </p>
            </div>
          </div>

          {/* Privacy & Research Context */}
          <div className="mt-12 bg-[#FFFFFF] rounded border border-[#E1E5DF] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded bg-[#EBF2EE] text-[#174C3C] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#202522]">
                  Komitmen Kerahasiaan Data & Integritas Riset
                </h3>
                <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                  Survei ini diselenggarakan oleh Departemen Kajian dan Aksi Strategis / Riset HIMALKOM IPB. Alamat email IPB University Anda digunakan murni untuk validasi kelayakan responden (mencegah duplikasi data) dan diamankan dengan Row Level Security di database. Laporan agregat dan analisis statistik akan disajikan secara anonim/pseudonim tanpa pernah menampilkan identitas pribadi ke publik.
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs font-medium">
                  <Link href="/privacy" className="text-[#174C3C] hover:underline">
                    Baca Kebijakan Privasi Lengkap &rarr;
                  </Link>
                  <Link href="/methodology" className="text-[#174C3C] hover:underline">
                    Pelajari Instrumen & Metodologi &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
