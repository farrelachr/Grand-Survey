import { checkIsAdmin } from "@/app/actions/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSyncRetry } from "@/components/AdminSyncRetry";
import Link from "next/link";
import {
  Download,
  Users,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  FileText,
} from "lucide-react";
import { SURVEY_VERSION, SCORING_VERSION } from "@/lib/survey-schema";
import { evaluateJournalDetection } from "@/lib/scoring";

export const metadata = {
  title: "Admin Dashboard — Grand Survey HIMALKOM 2026",
  description: "Panel administratif dan analisis data Grand Survey HIMALKOM 2026.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
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
              Akun <span className="font-mono text-[#202522]">{email || "Anda"}</span> tidak terdaftar dalam allowlist administrator sistem survei HIMALKOM IPB.
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

  // Fetch real submission records and sync logs
  let submissions: any[] = [];
  let syncLogs: any[] = [];

  try {
    const admin = createAdminClient();
    const { data: subData } = await admin
      .from("survey_submissions")
      .select("id, submitted_at, answers, dependency_score, dependency_category, scoring_details, survey_versions(version)")
      .order("submitted_at", { ascending: false });

    submissions = subData || [];

    const { data: logsData } = await admin
      .from("spreadsheet_sync_logs")
      .select("submission_id, status, last_error, synced_at")
      .order("created_at", { ascending: false });

    syncLogs = logsData || [];
  } catch (err) {
    console.warn("Could not query admin data:", err);
  }

  const totalSubmissions = submissions.length;
  const hasGoogleSheetsConfig = Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );

  // Real aggregate calculations
  let meanScore = 0;
  let categoryCounts = { RENDAH: 0, SEDANG: 0, TINGGI: 0 };
  let primaryToolCounts: Record<string, number> = {};

  if (totalSubmissions > 0) {
    const sumScores = submissions.reduce((acc, cur) => acc + Number(cur.dependency_score || 0), 0);
    meanScore = Math.round((sumScores / totalSubmissions) * 10) / 10;

    for (const sub of submissions) {
      const cat = (sub.dependency_category || "SEDANG") as keyof typeof categoryCounts;
      if (categoryCounts[cat] !== undefined) {
        categoryCounts[cat]++;
      }

      const tool = sub.answers?.primary_ai_tool;
      if (tool) {
        primaryToolCounts[tool] = (primaryToolCounts[tool] || 0) + 1;
      }
    }
  }

  // Map sync logs by submissionId
  const syncStatusMap = new Map<string, { status: string; error?: string }>();
  for (const log of syncLogs) {
    if (!syncStatusMap.has(log.submission_id)) {
      syncStatusMap.set(log.submission_id, { status: log.status, error: log.last_error });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header & CSV Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E5DF] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#FAF5EB] border border-[#D5A85B]/30 text-[#D5A85B] text-[11px] font-bold uppercase tracking-wider mb-2">
                Hak Akses Admin
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202522]">
                Admin Dashboard
              </h1>
              <p className="text-xs text-[#737A74] mt-1">
                Kuesioner v{SURVEY_VERSION} • Formula Penilaian v{SCORING_VERSION}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://docs.google.com/spreadsheets/d/1tnYjIVB3J004OpTJSn4dBOL-13h0pkis47GvXf6ky_I/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#EBF2EE] text-[#174C3C] border border-[#174C3C]/30 px-3.5 py-2.5 rounded text-sm font-semibold hover:bg-[#DCEAE1] transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#174C3C]" />
                <span>Buka Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <Link
                href="/admin/report"
                className="inline-flex items-center gap-2 bg-[#FAF5EB] text-[#B88728] border border-[#D5A85B]/40 px-3.5 py-2.5 rounded text-sm font-semibold hover:bg-[#F3EAD3] transition-colors shadow-2xs"
              >
                <BarChart3 className="w-4 h-4 text-[#D5A85B]" />
                <span>Laporan 50 Pertanyaan</span>
              </Link>
              <a
                href="/api/admin/export"
                download
                className="inline-flex items-center gap-2 bg-[#174C3C] text-white px-3.5 py-2.5 rounded text-sm font-semibold hover:bg-[#123B2F] transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh CSV Lengkap</span>
              </a>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#737A74]">
                  Total Responden Selesai
                </span>
                <Users className="w-4 h-4 text-[#174C3C]" />
              </div>
              <p className="text-3xl font-black text-[#202522] mt-3">
                {totalSubmissions}
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#737A74]">
                  Rata-rata Indeks AI
                </span>
                <TrendingUp className="w-4 h-4 text-[#D5A85B]" />
              </div>
              <p className="text-3xl font-black text-[#202522] mt-3">
                {totalSubmissions > 0 ? meanScore.toFixed(1) : "—"}
                <span className="text-sm font-semibold text-[#737A74] ml-1">/ 100</span>
              </p>
              <span className="text-[11px] text-[#737A74] mt-1 block">
                {totalSubmissions > 0
                  ? meanScore <= 33.33
                    ? "Rendah (Mandiri)"
                    : meanScore <= 66.67
                    ? "Sedang (Moderat)"
                    : "Tinggi"
                  : "Menunggu respon"}
              </span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#737A74]">
                    Sinkronisasi Sheets
                  </span>
                  <FileSpreadsheet className="w-4 h-4 text-[#174C3C]" />
                </div>
                <p className="text-3xl font-black text-[#202522] mt-3">
                  {syncLogs.filter((l) => l.status === "synced").length}
                  <span className="text-sm font-normal text-[#737A74] ml-1.5">
                    / {totalSubmissions}
                  </span>
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E1E5DF] flex items-center justify-between">
                <span className="text-[11px] text-[#737A74]">
                  {hasGoogleSheetsConfig
                    ? "Tersinkron otomatis"
                    : "Belum dikonfigurasi"}
                </span>
                <a
                  href="https://docs.google.com/spreadsheets/d/1tnYjIVB3J004OpTJSn4dBOL-13h0pkis47GvXf6ky_I/edit?gid=0#gid=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#174C3C] hover:underline"
                >
                  <span>Buka Spreadsheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Comprehensive Report Banner */}
          <div className="bg-[#FFFFFF] border border-[#D5A85B]/40 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-[#202522] pt-1">
                Charts Pertanyaan Skala
              </h2>
            </div>
            <div>
              <Link
                href="/admin/report"
                className="inline-flex items-center gap-2 bg-[#174C3C] text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-[#123B2F] transition-colors shadow-2xs shrink-0"
              >
                <span>Buka Laporan Grafik</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Submissions Table with Pseudonymous IDs */}
          <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#202522]">
                  Daftar Submission
                </h2>
              </div>
            </div>

            {totalSubmissions > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E1E5DF] bg-[#F7F7F2] text-[#737A74]">
                      <th className="py-2.5 px-3 font-semibold">ID Submisi</th>
                      <th className="py-2.5 px-2 font-semibold">Waktu Pengisian</th>
                      <th className="py-2.5 px-2 font-semibold">Peminatan</th>
                      <th className="py-2.5 px-2 text-right font-semibold">Skor</th>
                      <th className="py-2.5 px-2 text-center font-semibold">Kategori</th>
                      <th className="py-2.5 px-2 text-center font-semibold">Uji Jurnal</th>
                      <th className="py-2.5 px-2 font-semibold">Alat Utama</th>
                      <th className="py-2.5 px-2 font-semibold">Status Sheets</th>
                      <th className="py-2.5 px-2 text-right font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E5DF]">
                    {submissions.map((sub) => {
                      const syncInfo = syncStatusMap.get(sub.id);
                      const journalEval =
                        sub.scoring_details?.journalDetectionAccuracy?.correctCount !== undefined
                          ? {
                              correctCount: sub.scoring_details.journalDetectionAccuracy.correctCount,
                              scorePercentage: sub.scoring_details.journalDetectionAccuracy.scorePercentage,
                            }
                          : evaluateJournalDetection(sub.answers || {});

                      return (
                        <tr key={sub.id} className="hover:bg-[#F7F7F2]/50">
                          <td className="py-3 px-3 font-mono font-medium text-[#202522]">
                            {sub.id.slice(0, 8)}...
                          </td>
                          <td className="py-3 px-2 text-[#636B65]">
                            {new Date(sub.submitted_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-2 text-[#202522] max-w-[150px] truncate">
                            {sub.answers?.cs_interest || "—"}
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-[#202522]">
                            {Number(sub.dependency_score).toFixed(1)}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                sub.dependency_category === "RENDAH"
                                  ? "bg-[#EBF2EE] text-[#174C3C]"
                                  : sub.dependency_category === "SEDANG"
                                  ? "bg-[#FAF5EB] text-[#B88728]"
                                  : "bg-[#FEE4E2] text-[#B42318]"
                              }`}
                            >
                              {sub.dependency_category}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-semibold text-[#174C3C]">
                            {journalEval.correctCount} / 6
                          </td>
                          <td className="py-3 px-2 text-[#636B65] max-w-[120px] truncate">
                            {sub.answers?.primary_ai_tool || "—"}
                          </td>
                          <td className="py-3 px-2">
                            {syncInfo?.status === "synced" ? (
                              <span className="text-[11px] text-[#174C3C] font-semibold bg-[#EBF2EE] px-2 py-0.5 rounded">
                                Tersinkron
                              </span>
                            ) : syncInfo?.error?.includes("not configured") ? (
                              <span
                                className="text-[11px] text-[#737A74] bg-[#F7F7F2] border border-[#E1E5DF] px-2 py-0.5 rounded"
                                title="Kredensial Service Account Google Sheets belum diisi di .env.local"
                              >
                                Belum Dikonfigurasi
                              </span>
                            ) : syncInfo?.status === "failed" ? (
                              <span
                                className="text-[11px] text-[#B42318] bg-[#FEE4E2] px-2 py-0.5 rounded font-medium cursor-help"
                                title={syncInfo.error}
                              >
                                Gagal Sinkron
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#737A74] bg-[#F7F7F2] px-2 py-0.5 rounded">
                                Belum Dikonfigurasi
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/result/${sub.id}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#174C3C] bg-[#EBF2EE] hover:bg-[#D8E8DF] px-2 py-1 rounded transition-colors"
                                title="Buka Dokumen Hasil Evaluasi Responden"
                              >
                                <span>Hasil</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                              <AdminSyncRetry submissionId={sub.id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#737A74]">
                Belum ada data respons yang masuk ke database.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
