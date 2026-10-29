import { checkIsAdmin } from "@/app/actions/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReportViewer } from "@/components/ReportViewer";
import { generateQuestionAnalytics } from "@/lib/question-analytics";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Laporan Grafik Lengkap per Pertanyaan — Grand Survey HIMALKOM 2026",
  description: "Laporan komprehensif visualisasi grafik per butir pertanyaan Grand Survey HIMALKOM 2026.",
};

export const dynamic = "force-dynamic";

export default async function AdminReportPage() {
  const { isAdmin, email } = await checkIsAdmin();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E1E5DF] rounded p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded bg-[#FEE4E2] text-[#B42318] flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#202522]">Akses Terbatas: Administrator</h1>
            <p className="mt-2 text-sm text-[#636B65]">
              Akun <span className="font-mono text-[#202522]">{email || "Anda"}</span> tidak memiliki akses untuk membuka laporan riset ini.
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

  // Fetch all submissions from Supabase
  let submissions: any[] = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("survey_submissions")
      .select("id, answers, dependency_score, dependency_category, submitted_at")
      .order("submitted_at", { ascending: false });

    submissions = data || [];
  } catch (err) {
    console.error("Error loading submissions for report:", err);
  }

  // Generate analytics items for all 54 non-essay questions
  const analyzedItems = generateQuestionAnalytics(submissions);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <ReportViewer items={analyzedItems} totalRespondents={submissions.length} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
