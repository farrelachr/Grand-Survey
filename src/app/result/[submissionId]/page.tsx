import { getSubmissionResult } from "@/app/actions/survey";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { ItemScoreDetail, ScoringResult } from "@/lib/scoring";

export const metadata = {
  title: "Hasil Evaluasi Ketergantungan AI — Grand Survey HIMALKOM 2026",
  description: "Hasil indeks evaluasi ketergantungan akademik mahasiswa Ilmu Komputer IPB terhadap AI.",
};

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ submissionId: string }>;
  searchParams: Promise<{ already_submitted?: string }>;
}) {
  const { submissionId } = await params;
  const { already_submitted } = await searchParams;

  const result = await getSubmissionResult(submissionId);

  if (!result.success || !result.data) {
    if (result.error === "UNAUTHORIZED") {
      redirect(`/login?error=${encodeURIComponent("Silakan masuk untuk melihat hasil Anda.")}`);
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E1E5DF] rounded p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded bg-[#FEE4E2] text-[#B42318] flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#202522]">Akses Ditolak / Tidak Ditemukan</h1>
            <p className="mt-2 text-sm text-[#636B65]">
              {result.message || "Data hasil evaluasi tidak dapat dimuat atau Anda tidak memiliki hak akses untuk URL ini."}
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#174C3C] rounded hover:bg-[#123B2F]"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { score, category, scoringDetails, submittedAt } = result.data;
  const details = scoringDetails as ScoringResult;

  // Visual meter color determination
  const getBadgeStyle = () => {
    switch (category) {
      case "RENDAH":
        return {
          bg: "bg-[#EBF2EE]",
          border: "border-[#174C3C]/30",
          text: "text-[#174C3C]",
          meterColor: "bg-[#174C3C]",
        };
      case "SEDANG":
        return {
          bg: "bg-[#FAF5EB]",
          border: "border-[#D5A85B]/40",
          text: "text-[#B88728]",
          meterColor: "bg-[#D5A85B]",
        };
      case "TINGGI":
      default:
        return {
          bg: "bg-[#FEE4E2]",
          border: "border-[#B42318]/30",
          text: "text-[#B42318]",
          meterColor: "bg-[#B42318]",
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {already_submitted && (
            <div className="p-4 rounded bg-[#EBF2EE] border border-[#174C3C]/20 flex items-start gap-3 text-xs text-[#174C3C]">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Anda sebelumnya telah menyelesaikan kuesioner ini. Berikut adalah hasil evaluasi resmi yang tersimpan di sistem.
              </span>
            </div>
          )}

          {/* Editorial Score Banner */}
          <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E5DF] pb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#737A74]">
                  Hasil Evaluasi Mandiri Responden
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202522] mt-1">
                  Indeks Ketergantungan AI
                </h1>
                <p className="text-xs text-[#737A74] mt-1">
                  ID Respon: <span className="font-mono text-[#202522]">{submissionId.slice(0, 8)}...</span> • Disubmit pada{" "}
                  {new Date(submittedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-md border text-center self-start sm:self-auto ${badgeStyle.bg} ${badgeStyle.border}`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-80">
                  Kategori
                </span>
                <span className={`text-sm font-bold ${badgeStyle.text}`}>
                  {details.bandLabel}
                </span>
              </div>
            </div>

            {/* Score Visual Gauge */}
            <div className="py-8">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-semibold text-[#737A74] uppercase tracking-wider">
                  Skor Indeks Primer (0–100)
                </span>
                <div className="text-right">
                  <span className="text-4xl sm:text-5xl font-black text-[#202522] tracking-tight">
                    {score.toFixed(1)}
                  </span>
                  <span className="text-sm font-semibold text-[#737A74] ml-1">/ 100</span>
                </div>
              </div>

              {/* Multi-segment Indicator */}
              <div className="relative w-full h-4 bg-[#E1E5DF] rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full transition-all duration-700 ease-out ${badgeStyle.meterColor}`}
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>

              {/* Scale Labels */}
              <div className="flex justify-between text-[11px] text-[#737A74] mt-2 font-medium">
                <span>0 (Kemandirian Penuh)</span>
                <span>33.3</span>
                <span>66.7</span>
                <span>100 (Ketergantungan Tinggi)</span>
              </div>
            </div>

            {/* Non-judgmental Editorial Interpretation */}
            <div className="p-5 rounded bg-[#F7F7F2] border border-[#E1E5DF]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#202522] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#174C3C]" />
                Interpretasi Akademik
              </h2>
              <p className="text-sm text-[#636B65] leading-relaxed">
                {details.bandDescription}
              </p>
            </div>
          </div>

          {/* Observations Based On Actual Answers */}
          {details.observations && details.observations.length > 0 && (
            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
              <h2 className="text-base font-bold text-[#202522] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D5A85B]" />
                Observasi Khusus Pola Belajar Anda
              </h2>
              <ul className="space-y-3">
                {details.observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#202522] leading-relaxed">
                    <span className="w-5 h-5 rounded bg-[#EBF2EE] text-[#174C3C] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Actionable Recommendations */}
          {details.recommendations && details.recommendations.length > 0 && (
            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
              <h2 className="text-base font-bold text-[#202522] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174C3C]" />
                Rekomendasi Penguatan Kompetensi
              </h2>
              <div className="space-y-3">
                {details.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded bg-[#F7F7F2] border border-[#E1E5DF] text-xs sm:text-sm text-[#636B65] leading-relaxed"
                  >
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Scoring Methodology Breakdown */}
          <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-[#202522] mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#737A74]" />
              Transparansi Metodologi Penilaian (Scoring v{details.scoringVersion})
            </h2>
            <p className="text-xs text-[#636B65] leading-relaxed mb-4">
              Indeks ketergantungan dihitung dari rata-rata aritmatika 8 butir pernyataan sikap pada Bagian 3. Setiap skala 1–4 dinormalisasi ke rentang 0–100. Butir bernada positif/mandiri (butir 6, 7, 8) dibalik nilainya (reverse scoring: <code className="text-[11px] font-mono bg-[#F7F7F2] px-1 py-0.5 rounded">reverseScore = 5 - Likert</code>) sehingga skor tinggi secara konsisten mencerminkan kecenderungan ketergantungan.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E1E5DF] bg-[#F7F7F2] text-[#737A74]">
                    <th className="py-2.5 px-3 font-semibold">Indikator</th>
                    <th className="py-2.5 px-2 text-center font-semibold">Jawaban (1-4)</th>
                    <th className="py-2.5 px-2 text-center font-semibold">Tipe</th>
                    <th className="py-2.5 px-2 text-right font-semibold">Skor Normalisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E5DF]">
                  {details.itemDetails?.map((item: ItemScoreDetail) => (
                    <tr key={item.id} className="hover:bg-[#F7F7F2]/50">
                      <td className="py-2.5 px-3 text-[#202522]">{item.statement}</td>
                      <td className="py-2.5 px-2 text-center font-medium text-[#202522]">{item.rawLikert}</td>
                      <td className="py-2.5 px-2 text-center text-[#737A74]">
                        {item.isReversed ? (
                          <span className="text-[10px] bg-[#FAF5EB] text-[#D5A85B] px-1.5 py-0.5 rounded font-medium">
                            Reverse
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#EBF2EE] text-[#174C3C] px-1.5 py-0.5 rounded font-medium">
                            Direct
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-semibold text-[#202522]">
                        {item.normalizedScore.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-start pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174C3C] bg-[#FFFFFF] border border-[#E1E5DF] px-4 py-2.5 rounded hover:bg-[#F7F7F2] transition-colors"
            >
              &larr; Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
