import { getSubmissionResult } from "@/app/actions/survey";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert, Info, ArrowLeft, Zap } from "lucide-react";
import { ScoringResult, calculateDependencyScore } from "@/lib/scoring";
import { AcademicEvaluationReport } from "@/components/AcademicEvaluationReport";
import { RespondentAnswersViewer } from "@/components/RespondentAnswersViewer";
import { getMockSurveyAnswers, MockPreset, MOCK_PRESETS } from "@/lib/mock-survey-answers";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth-validation";

export const metadata = {
  title: "Laporan Evaluasi Ketergantungan AI — Grand Survey HIMALKOM 2026",
  description: "Rangkuman hasil asesmen evaluasi ketergantungan akademik mahasiswa Ilmu Komputer IPB terhadap AI.",
};

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ submissionId: string }>;
  searchParams: Promise<{ already_submitted?: string; preset?: string }>;
}) {
  const { submissionId } = await params;
  const { already_submitted, preset } = await searchParams;

  const isDemo = submissionId === "demo" || submissionId === "test" || submissionId === "preview";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = user?.email ? isAdminEmail(user.email) : false;

  // Non-admin is strictly forbidden from accessing demo simulations
  if (isDemo && !isAdmin) {
    redirect("/survey");
  }

  let score = 0;
  let category = "SEDANG";
  let details: ScoringResult;
  let submittedAt = new Date().toISOString();
  let respondentAnswers: Record<string, any> = {};

  if (isDemo) {
    const activePreset: MockPreset =
      preset === "rendah" || preset === "tinggi" ? preset : "sedang";
    const mock = getMockSurveyAnswers(activePreset);
    respondentAnswers = mock;
    details = calculateDependencyScore(mock);
    score = details.score;
    category = details.band;
  } else {
    const result = await getSubmissionResult(submissionId);

    if (!result.success || !result.data) {
      if (result.error === "UNAUTHORIZED") {
        redirect(`/login?error=${encodeURIComponent("Silakan masuk untuk melihat hasil Anda.")}`);
      }

      return (
        <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
          <Header />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E1E5DF] rounded-xl p-8 text-center shadow-sm">
              <div className="w-12 h-12 rounded bg-[#FEE4E2] text-[#B42318] flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-[#202522]">Akses Ditolak / Tidak Ditemukan</h1>
              <p className="mt-2 text-sm text-[#636B65]">
                {result.message || "Data hasil evaluasi tidak dapat dimuat atau Anda tidak memiliki hak akses untuk URL ini."}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#174C3C] rounded-lg hover:bg-[#123B2F]"
                >
                  Kembali ke Beranda
                </Link>
                {isAdmin && (
                  <Link
                    href="/result/demo"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#174C3C] bg-[#EBF2EE] rounded-lg hover:bg-[#DCEAE1]"
                  >
                    Buka Simulasi Demo
                  </Link>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    score = result.data.score;
    category = result.data.category;
    details = result.data.scoringDetails as ScoringResult;
    submittedAt = result.data.submittedAt;
    respondentAnswers = result.data.answers || {};
  }

  const currentPreset = preset === "rendah" || preset === "tinggi" ? preset : "sedang";

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-4">
          {/* Demo / Testing Toolbar (Admin only) */}
          {isDemo && isAdmin && (
            <div className="p-3.5 rounded-xl bg-[#FAFDFB] border border-[#174C3C]/30 text-xs text-[#202522] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#174C3C] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Mode Pengujian Hasil Langsung (Tanpa Isi Form)
                </span>
                <span className="text-[10px] bg-[#EBF2EE] text-[#174C3C] px-2 py-0.5 rounded font-mono font-bold">
                  SIMULASI
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[#737A74] text-[11px]">Ubah Profil:</span>
                {(["rendah", "sedang", "tinggi"] as MockPreset[]).map((p) => (
                  <Link
                    key={p}
                    href={`/result/demo?preset=${p}`}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                      currentPreset === p
                        ? "bg-[#174C3C] text-white"
                        : "bg-[#FFFFFF] border border-[#E1E5DF] text-[#636B65] hover:bg-[#F7F7F2]"
                    }`}
                  >
                    {MOCK_PRESETS[p].label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {already_submitted && (
            <div className="p-3.5 rounded-xl bg-[#EBF2EE] border border-[#174C3C]/20 flex items-start gap-2.5 text-xs text-[#174C3C]">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Anda sebelumnya telah menyelesaikan kuesioner ini. Berikut adalah rangkuman resmi yang tersimpan di sistem.
              </span>
            </div>
          )}

          {/* Satu Kotak Rangkuman Tunggal */}
          <AcademicEvaluationReport
            submissionId={submissionId}
            submittedAt={submittedAt}
            score={score}
            category={category}
            scoringDetails={details}
            answers={respondentAnswers}
          />

          {/* Details toggle / Viewer */}
          <div className="pt-1">
            <RespondentAnswersViewer answers={respondentAnswers} />
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-semibold text-[#174C3C] bg-[#FFFFFF] border border-[#E1E5DF] px-3.5 py-2 rounded-lg hover:bg-[#F7F7F2] transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>

            {isAdmin && !isDemo && (
              <Link
                href="/result/demo"
                className="text-[#737A74] hover:text-[#174C3C] transition-colors"
              >
                Uji Simulasi Profil Lain →
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
