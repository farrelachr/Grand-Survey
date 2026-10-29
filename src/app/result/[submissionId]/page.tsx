import { getSubmissionResult } from "@/app/actions/survey";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Info,
  Terminal,
  Timer,
  ShieldCheck,
  FileCode,
  Code2,
  Compass,
  Lightbulb,
} from "lucide-react";
import {
  ItemScoreDetail,
  ScoringResult,
  determineArchetype,
  getPersonalizedSolutions,
  PersonalizedSolution,
} from "@/lib/scoring";
import { PersonalityCard } from "@/components/PersonalityCard";
import { RespondentAnswersViewer } from "@/components/RespondentAnswersViewer";

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

  const { score, category, scoringDetails, submittedAt, answers } = result.data;
  const details = scoringDetails as ScoringResult;
  const respondentAnswers = answers || {};
  const archetype = details.archetype || determineArchetype(score, respondentAnswers);
  const personalizedSolutions: PersonalizedSolution[] =
    details.personalizedSolutions || getPersonalizedSolutions(respondentAnswers, score);

  const renderSolutionIcon = (iconName: string) => {
    switch (iconName) {
      case "terminal":
        return <Terminal className="w-4 h-4 text-[#174C3C]" />;
      case "timer":
        return <Timer className="w-4 h-4 text-[#B88728]" />;
      case "shield":
        return <ShieldCheck className="w-4 h-4 text-[#175CD3]" />;
      case "file-text":
        return <FileCode className="w-4 h-4 text-[#5925DC]" />;
      case "code":
        return <Code2 className="w-4 h-4 text-[#B42318]" />;
      case "compass":
      default:
        return <Compass className="w-4 h-4 text-[#115E59]" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {already_submitted && (
            <div className="p-3.5 rounded-xl bg-[#EBF2EE] border border-[#174C3C]/20 flex items-start gap-2.5 text-xs text-[#174C3C]">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Anda sebelumnya telah menyelesaikan kuesioner ini. Berikut adalah hasil evaluasi resmi yang tersimpan di sistem.
              </span>
            </div>
          )}

          {/* Top Context Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#FFFFFF] border border-[#E1E5DF] rounded-xl px-5 py-3 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737A74]">
                Hasil Kuesioner Grand Survey HIMALKOM
              </span>
              <p className="text-xs text-[#737A74] mt-0.5">
                ID Respon: <span className="font-mono text-[#202522]">{submissionId.slice(0, 8)}...</span> • Disubmit pada{" "}
                {new Date(submittedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full border text-xs font-bold self-start sm:self-auto ${
                category === "RENDAH"
                  ? "bg-[#EBF2EE] border-[#174C3C]/30 text-[#174C3C]"
                  : category === "SEDANG"
                  ? "bg-[#FAF5EB] border-[#D5A85B]/40 text-[#B88728]"
                  : "bg-[#FEE4E2] border-[#B42318]/30 text-[#B42318]"
              }`}
            >
              {details.bandLabel}
            </div>
          </div>

          {/* Modern Cyber-Academic Personality Collector Card */}
          {archetype && (
            <PersonalityCard
              archetype={archetype}
              score={score}
              category={category}
            />
          )}

          {/* Personalized Short Actionable Solutions */}
          {personalizedSolutions && personalizedSolutions.length > 0 && (
            <div className="w-full max-w-md mx-auto bg-[#FFFFFF] border border-[#E1E5DF] rounded-2xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E1E5DF]">
                <div className="w-7 h-7 rounded-full bg-[#FAF5EB] text-[#B88728] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-[#D5A85B]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#202522]">
                    Rekomendasi Aksi Khusus Kamu
                  </h3>
                  <p className="text-[11px] text-[#737A74]">
                    Langkah praktis yang disesuaikan dengan pola koding kamu:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {personalizedSolutions.map((sol, idx) => (
                  <div
                    key={sol.id || idx}
                    className="p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E1E5DF] space-y-1.5 transition-colors hover:bg-[#FAFDFB] hover:border-[#D1E3D8]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#FFFFFF] border border-[#E1E5DF] flex items-center justify-center shrink-0">
                        {renderSolutionIcon(sol.iconName)}
                      </div>
                      <span className="text-xs font-bold text-[#202522]">
                        {sol.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#525B54] leading-relaxed pl-8">
                      {sol.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible Methodology Accordion */}
          <details className="group bg-[#FFFFFF] border border-[#E1E5DF] rounded p-5 shadow-sm transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs sm:text-sm font-bold text-[#202522]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#737A74]" />
                <span>Ingin tahu bagaimana skor ketergantungan dihitung?</span>
              </div>
              <span className="text-xs text-[#174C3C] font-semibold group-open:hidden">
                + Lihat Rincian
              </span>
              <span className="text-xs text-[#737A74] font-semibold hidden group-open:inline">
                − Tutup
              </span>
            </summary>

            <div className="mt-4 pt-4 border-t border-[#E1E5DF] space-y-3">
              <p className="text-xs text-[#636B65] leading-relaxed">
                Skor dihitung dari rata-rata 8 butir pernyataan sikap pada Bagian 3 (skala 1–4 dinormalisasi ke rentang 0–100). Khusus butir bernada positif/mandiri, nilainya dibalik agar skor tinggi konsisten menunjukkan ketergantungan yang lebih tinggi.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E1E5DF] bg-[#F7F7F2] text-[#737A74]">
                      <th className="py-2.5 px-3 font-semibold">Pernyataan</th>
                      <th className="py-2.5 px-2 text-center font-semibold">Jawaban Kamu</th>
                      <th className="py-2.5 px-2 text-right font-semibold">Skor (0-100)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E5DF]">
                    {details.itemDetails?.map((item: ItemScoreDetail) => (
                      <tr key={item.id} className="hover:bg-[#F7F7F2]/50">
                        <td className="py-2.5 px-3 text-[#202522]">{item.statement}</td>
                        <td className="py-2.5 px-2 text-center font-medium text-[#202522]">{item.rawLikert} / 4</td>
                        <td className="py-2.5 px-2 text-right font-mono font-semibold text-[#202522]">
                          {item.normalizedScore.toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          {/* Complete Respondent Answers Breakdown */}
          <RespondentAnswersViewer answers={answers} />

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
