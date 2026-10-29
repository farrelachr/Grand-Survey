import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";
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
        <section className="border-b border-[#E1E5DF] bg-[#FFFFFF] py-10 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">

            <h1 className="text-2xl sm:text-5xl font-bold tracking-tight text-[#202522] leading-[1.25] sm:leading-[1.2] max-w-3xl">
              Seberapa mandiri kamu ketika belajar dengan AI?
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-[#636B65] leading-relaxed max-w-2xl">
              Survei mengenai pola penggunaan AI, proses belajar, kemampuan problem solving, dan kemandirian akademik mahasiswa Ilmu Komputer IPB University.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={user ? "/survey" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#174C3C] text-white px-6 py-3.5 rounded text-sm sm:text-base font-semibold hover:bg-[#123B2F] transition-all shadow-sm group"
              >
                <span>Mulai Survei</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Quick Context Bar */}
            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E1E5DF] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
              <div>
                <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#737A74] font-medium">Penyelenggara</span>
                <span className="mt-1 block font-semibold text-xs sm:text-sm text-[#202522]">Research And Technology HIMALKOM IPB</span>
              </div>
              <div>
                <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#737A74] font-medium">Target Populasi</span>
                <span className="mt-1 block font-semibold text-xs sm:text-sm text-[#202522]">Ilkom IPB Angkatan 60 61 62 63</span>
              </div>
              <div>
                <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#737A74] font-medium">Estimasi Waktu</span>
                <span className="mt-1 block font-semibold text-xs sm:text-sm text-[#202522]">7–10 Menit</span>
              </div>
              <div>
                <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#737A74] font-medium">Hasil Langsung</span>
                <span className="mt-1 block font-semibold text-xs sm:text-sm text-[#202522]">Indeks Ketergantungan AI</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
