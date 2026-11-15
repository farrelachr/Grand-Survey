import { google } from "googleapis";
import { SurveySubmissionPayload } from "./survey-schema";
import { ScoringResult } from "./scoring";

export interface SyncResult {
  success: boolean;
  status: "synced" | "failed" | "not_configured" | "already_synced";
  error?: string;
}

export const SPREADSHEET_HEADERS = [
  "Submission ID",
  "Submitted At",
  "Survey Version",
  // Section 1: Profil
  "Nama Lengkap",
  "NIM",
  "Angkatan",
  "Nomor WhatsApp",
  "Email IPB",
  // Section 2: Pola Penggunaan AI
  "Platform AI Utama",
  "Estimasi Durasi Mingguan",
  "Ragam Aktivitas Akademik",
  "Pemicu Penggunaan AI",
  "Urutan Pencarian Solusi",
  // Section 3: Ketergantungan terhadap AI (Likert 1-4)
  "Dep 1 (Kesulitan tugas tanpa AI)",
  "Dep 2 (AI sebelum coba sendiri)",
  "Dep 3 (Pekerjaan lebih sulit tanpa AI)",
  "Dep 4 (Hampir setiap tugas pakai AI)",
  "Dep 5 (Minta solusi lengkap ke AI)",
  // Section 4: Instrumen Penilaian & Deteksi AI (Case Journal)
  "Kasus Jurnal 1 (Dirgahayu - Real)",
  "Kasus Jurnal 2 (Kobayashi - Real)",
  "Kasus Jurnal 3 (Tsuchiya - Real)",
  "Kasus Jurnal 4 (Kusumawardhani - Fake)",
  "Kasus Jurnal 5 (Watanabe - Fake)",
  "Kasus Jurnal 6 (Nugroho - Fake)",
  "Tingkat Keyakinan Jurnal",
  "Alasan Analisis Jurnal",
  // Section 5: Kemandirian, Verifikasi & Critical Thinking (Likert 1-4)
  "Crit 1 (Coba sendiri dulu baru cek AI)",
  "Crit 2 (Yakin selesaikan tanpa AI)",
  "Crit 3 (Verifikasi dengan materi kuliah)",
  "Crit 4 (Merasa kemampuan berpikir menurun)",
  "Crit 5 (Batasi buka AI hanya saat buntu)",
  "Crit 6 (AI sebagai alat bantu proses bukan hasil akhir)",
  "Crit 7 (Langsung percaya tanpa cek dokumentasi)",
  "Crit 8 (Mampu bedakan jawaban benar vs terlihat benar)",
  "Crit 9 (Pernah kumpul tugas ada error fatal AI)",
  "Crit 10 (Mampu jelaskan alur jawaban saat responsi)",
  // Section 6: Dampak Belajar (Likert 1-4 & Frekuensi)
  "Learn 1 (AI bantu paham materi sulit)",
  "Learn 2 (Bantu konsep programming lewat contoh)",
  "Learn 3 (Paham lewat contoh kehidupan nyata)",
  "Learn 4 (Mengingat kembali materi)",
  "Learn 5 (Paham hubungan antar konsep)",
  "Learn 6 (Orientasi selesai tugas dibanding pemahaman)",
  "Learn 7 (Cenderung lewatkan materi kuliah)",
  "Learn 8 (Cepat selesai tugas tapi belum tentu paham)",
  "Learn 9 (Mendorong eksplorasi topik lain)",
  "Learn 10 (Frekuensi latihan mandiri setelah pakai AI)",
  // Section 7: Persepsi & Batas
  "Batas Jelaskan Materi",
  "Batas Buat Contoh Kode",
  "Batas Debugging",
  "Batas Seluruh Tugas",
  "Titik Kritis Ketergantungan",
  // Section 8: Masa Depan Mahasiswa Ilkom
  "Future 1 (Perubahan kebutuhan tenaga kerja)",
  "Future 2 (Kompetensi manfaatkan AI)",
  "Future 3 (Fondasi programming tetap perlu)",
  "Future 4 (Problem solving kompetensi utama)",
  "Future 5 (Terus tingkatkan kompetensi diri)",
  "Kemampuan Paling Penting",
  "Tantangan Utama",
  "Program Kegiatan Dibutuhkan",
  "Profil Lulusan Ideal",
  // Section 9: Saran (Wajib)
  "Saran Penggunaan Tugas/Praktikum",
  "Saran Berpikir Mandiri",
  "Saran Dosen & Lingkungan Akademik",
  // Evaluasi & Skor
  "Dependency Score (0-100)",
  "Dependency Band",
  "Archetype",
  "Journal Detection Accuracy (0-6)",
  "Debugging Autonomy Score",
  "Critical Verification Score",
  "Scoring Version",
];

export function formatSubmissionRow(
  submissionId: string,
  submittedAt: string,
  surveyVersion: string,
  answers: SurveySubmissionPayload,
  scoringResult: ScoringResult
): (string | number)[] {
  return [
    submissionId,
    submittedAt,
    surveyVersion,
    // Section 1
    answers.respondent_name || "-",
    answers.nim || "-",
    answers.cohort_confirmation ? `Angkatan ${answers.cohort_confirmation}` : "-",
    answers.whatsapp_number || "-",
    answers.ipb_email || "-",
    // Section 2
    answers.primary_ai_tool,
    answers.weekly_ai_duration,
    Array.isArray(answers.academic_activities) ? answers.academic_activities.join("; ") : "",
    Array.isArray(answers.usage_triggers) ? answers.usage_triggers.join("; ") : "",
    answers.problem_solving_sequence,
    // Section 3
    answers.dep_1,
    answers.dep_2,
    answers.dep_3,
    answers.dep_4,
    answers.dep_5,
    // Section 4
    answers.journal_case_1,
    answers.journal_case_2,
    answers.journal_case_3,
    answers.journal_case_4,
    answers.journal_case_5,
    answers.journal_case_6,
    answers.journal_confidence,
    answers.journal_reasoning || "",
    // Section 5
    answers.crit_1,
    answers.crit_2,
    answers.crit_3,
    answers.crit_4,
    answers.crit_5,
    answers.crit_6,
    answers.crit_7,
    answers.crit_8,
    answers.crit_9,
    answers.crit_10,
    // Section 6
    answers.learn_1,
    answers.learn_2,
    answers.learn_3,
    answers.learn_4,
    answers.learn_5,
    answers.learn_6,
    answers.learn_7,
    answers.learn_8,
    answers.learn_9,
    answers.learn_practice_frequency,
    // Section 7
    answers.boundary_explain_material,
    answers.boundary_sample_code,
    answers.boundary_debugging,
    answers.boundary_entire_assignment,
    answers.boundary_threshold_essay || "",
    // Section 8
    answers.future_labor_change,
    answers.future_ai_competence,
    answers.future_core_cs_needed,
    answers.future_problem_solving_key,
    answers.future_continuous_learning,
    Array.isArray(answers.future_most_important_skill) ? answers.future_most_important_skill.join("; ") : "",
    Array.isArray(answers.future_biggest_challenge) ? answers.future_biggest_challenge.join("; ") : "",
    Array.isArray(answers.future_needed_programs) ? answers.future_needed_programs.join("; ") : "",
    answers.future_ideal_graduate_profile || "",
    // Section 9
    answers.feedback_task_practical_usage || "",
    answers.feedback_independent_thinking || "",
    answers.feedback_lecturer_academic_response || "",
    // Scoring
    scoringResult.score,
    scoringResult.band,
    scoringResult.archetype?.name || "-",
    scoringResult.journalDetectionAccuracy?.correctCount ?? scoringResult.archetype?.metrics.journalDetectionScore ?? "-",
    scoringResult.archetype?.metrics.debuggingAutonomy ?? "-",
    scoringResult.archetype?.metrics.criticalVerification ?? "-",
    scoringResult.scoringVersion,
  ];
}

/**
 * Safely parses and normalizes Google Service Account Private Key from environment variables.
 */
export function getGooglePrivateKey(): string | undefined {
  let key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!key) return undefined;

  key = key.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  return key.replace(/\\n/g, "\n").trim();
}

/**
 * Syncs a single survey submission into Google Sheets idempotently.
 */
export async function syncSubmissionToGoogleSheets(
  submissionId: string,
  submittedAt: string,
  surveyVersion: string,
  answers: SurveySubmissionPayload,
  scoringResult: ScoringResult
): Promise<SyncResult> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getGooglePrivateKey();

  if (!spreadsheetId || !clientEmail || !privateKey) {
    return {
      success: false,
      status: "not_configured",
      error: "Google Sheets credentials are not configured in environment variables.",
    };
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 1. Check if header row exists, if not initialize
    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:Z1",
    });

    if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Sheet1!A1",
        valueInputOption: "RAW",
        requestBody: {
          values: [SPREADSHEET_HEADERS],
        },
      });
    }

    // 2. Idempotency check: see if submissionId already exists in Column A
    const existingIdsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:A",
    });

    const existingRows = existingIdsRes.data.values || [];
    const isAlreadyPresent = existingRows.some((row) => row[0] === submissionId);

    if (isAlreadyPresent) {
      return {
        success: true,
        status: "already_synced",
      };
    }

    // 3. Append row
    const rowValues = formatSubmissionRow(
      submissionId,
      submittedAt,
      surveyVersion,
      answers,
      scoringResult
    );

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:A",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues],
      },
    });

    return {
      success: true,
      status: "synced",
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      status: "failed",
      error: errorMessage,
    };
  }
}

/**
 * Generates CSV string for administrative exports.
 */
export function generateSubmissionsCSV(
  submissions: Array<{
    id: string;
    submitted_at: string;
    survey_version?: { version: string };
    answers: SurveySubmissionPayload;
    dependency_score: number;
    dependency_category: string;
    scoring_details: ScoringResult;
  }>
): string {
  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[] = [];
  rows.push(SPREADSHEET_HEADERS.map(escapeCSV).join(","));

  for (const sub of submissions) {
    const row = formatSubmissionRow(
      sub.id,
      sub.submitted_at,
      sub.survey_version?.version || "2026.1",
      sub.answers,
      sub.scoring_details || {
        score: sub.dependency_score,
        band: sub.dependency_category,
        scoringVersion: "2.0.0",
      }
    );
    rows.push(row.map(escapeCSV).join(","));
  }

  return rows.join("\n");
}
