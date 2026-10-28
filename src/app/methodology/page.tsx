import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { BookOpen, Scale, CheckCircle2, AlertCircle } from "lucide-react";
import { SECTIONS, SURVEY_VERSION, SCORING_VERSION } from "@/lib/survey-schema";
import { DEPENDENCY_STATEMENTS } from "@/lib/scoring";

export const metadata = {
  title: "Metodologi & Kerangka Riset — Grand Survey HIMALKOM 2026",
  description: "Dokumentasi metodologi, operasionalisasi variabel, dan formula penilaian Indeks Ketergantungan AI.",
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#FAF5EB] border border-[#D5A85B]/30 text-[#D5A85B] text-[11px] font-bold uppercase tracking-wider mb-3">
              Instrumen & Konstruk Ilmiah
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202522]">
              Metodologi & Formula Penilaian
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#636B65] leading-relaxed">
              Grand Survey HIMALKOM 2026 disusun untuk mengamati pergeseran pola belajar, integritas pemecahan masalah, dan interaksi mahasiswa Ilmu Komputer IPB dengan teknologi kecerdasan buatan generatif.
            </p>
          </div>

          {/* Academic Disclaimer Alert */}
          <div className="p-5 rounded bg-[#FAF5EB] border border-[#D5A85B]/40 flex items-start gap-3.5 text-xs text-[#202522]">
            <AlertCircle className="w-5 h-5 text-[#D5A85B] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Catatan Penting Sifat Instrumen:</span>
              Indeks Ketergantungan AI ini merupakan <em>instrumen eksploratif berbasis self-report</em> yang dirancang khusus untuk survei internal mahasiswa Ilmu Komputer IPB University. Indeks ini <strong>bukan</strong> diagnosis klinis psikologis, bukan alat ukur kecanduan patologis, dan tidak boleh ditafsirkan sebagai vonis deterministik atas kompetensi teknis individu.
            </div>
          </div>

          {/* Section Breakdown Table */}
          <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-[#202522] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#174C3C]" />
              Struktur dan Cakupan 9 Bagian Kuesioner (57 Indikator)
            </h2>
            <p className="text-xs text-[#636B65] mb-5">
              Kuesioner v{SURVEY_VERSION} terdiri dari 54 butir pertanyaan terstruktur ditambah 3 pertanyaan reflektif kualitatif:
            </p>

            <div className="space-y-3">
              {SECTIONS.map((sec) => (
                <div
                  key={sec.id}
                  className="p-3.5 rounded bg-[#F7F7F2] border border-[#E1E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-xs text-[#202522]">
                      Bagian {sec.number}: {sec.title}
                    </span>
                    <p className="text-[11px] text-[#737A74] mt-0.5">{sec.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-[#174C3C] bg-[#EBF2EE] px-2 py-0.5 rounded self-start sm:self-auto shrink-0">
                    {sec.itemCount} Indikator
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Engine Details */}
          <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#202522] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#174C3C]" />
                Formula Indeks Ketergantungan AI (Scoring Engine v{SCORING_VERSION})
              </h2>
              <p className="mt-2 text-xs text-[#636B65] leading-relaxed">
                Indeks primer diturunkan secara eksklusif dari 8 butir pernyataan sikap pada Bagian 3 untuk menjaga validitas konstruk tanpa mencampurkan faktor demografi atau frekuensi umum.
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#202522]">
              <div className="p-4 rounded bg-[#F7F7F2] border border-[#E1E5DF] font-mono">
                <p className="font-bold text-[#174C3C] mb-1">1. Normalisasi Skala Likert 1–4 ke 0–100:</p>
                <p>Skor Langsung: Normalized = ((Likert - 1) / 3) * 100</p>
                <p className="mt-1 text-[#737A74]">• 1 (Sangat Tidak Setuju) = 0.00</p>
                <p className="text-[#737A74]">• 2 (Tidak Setuju) = 33.33</p>
                <p className="text-[#737A74]">• 3 (Setuju) = 66.67</p>
                <p className="text-[#737A74]">• 4 (Sangat Setuju) = 100.00</p>
              </div>

              <div className="p-4 rounded bg-[#F7F7F2] border border-[#E1E5DF] font-mono">
                <p className="font-bold text-[#D5A85B] mb-1">2. Pembalikan Nilai (Reverse Scoring) Butir Mandiri:</p>
                <p>ReverseScore = 5 - Likert</p>
                <p className="mt-1 text-[#737A74]">
                  Diterapkan pada butir 6, 7, dan 8 yang bernada positif/mandiri. Jawaban &ldquo;Sangat Setuju&rdquo; (4) menjadi 1 (Normalized: 0), mencerminkan ketergantungan minimal.
                </p>
              </div>

              <div className="p-4 rounded bg-[#F7F7F2] border border-[#E1E5DF] font-mono">
                <p className="font-bold text-[#174C3C] mb-1">3. Rata-rata Aritmatika Indeks Primer:</p>
                <p>Primary Dependency Index = (&Sigma; NormalizedScore_1..8) / 8</p>
              </div>
            </div>

            {/* 8 Statements List */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737A74] mb-3">
                8 Indikator Indeks Primer
              </h3>
              <div className="space-y-2">
                {DEPENDENCY_STATEMENTS.map((st, idx) => (
                  <div
                    key={st.id}
                    className="flex items-start justify-between gap-3 text-xs p-2.5 rounded bg-[#F7F7F2]"
                  >
                    <span className="text-[#202522]">
                      {idx + 1}. {st.statement}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                        st.isReversed
                          ? "bg-[#FAF5EB] text-[#D5A85B]"
                          : "bg-[#EBF2EE] text-[#174C3C]"
                      }`}
                    >
                      {st.isReversed ? "Reverse Scored" : "Direct Scored"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Threshold Bands */}
            <div className="pt-2 border-t border-[#E1E5DF]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737A74] mb-3">
                Batas Kategori (Bands)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-[#EBF2EE] border border-[#174C3C]/20">
                  <span className="font-bold text-[#174C3C] block">Rendah</span>
                  <span className="text-[11px] text-[#737A74]">0.00 – 33.33</span>
                  <p className="mt-1 text-[11px] text-[#202522]">Kemandirian akademik tinggi.</p>
                </div>
                <div className="p-3 rounded bg-[#FAF5EB] border border-[#D5A85B]/30">
                  <span className="font-bold text-[#B88728] block">Sedang</span>
                  <span className="text-[11px] text-[#737A74]">&gt;33.33 – 66.67</span>
                  <p className="mt-1 text-[11px] text-[#202522]">Pemanfaatan moderat & aktif.</p>
                </div>
                <div className="p-3 rounded bg-[#FEE4E2] border border-[#B42318]/20">
                  <span className="font-bold text-[#B42318] block">Tinggi</span>
                  <span className="text-[11px] text-[#737A74]">&gt;66.67 – 100.00</span>
                  <p className="mt-1 text-[11px] text-[#202522]">Kecenderungan ketergantungan kuat.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="text-xs font-semibold text-[#174C3C] hover:underline"
            >
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
