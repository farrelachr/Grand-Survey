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
                <div>
                  <h3 className="text-sm font-bold text-[#202522]">
                    Rekomendasi berdasarkan hasil
                  </h3>
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
