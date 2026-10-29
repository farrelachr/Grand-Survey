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
  "Nama Lengkap",
  "Cohort",
  "CS Interest",
  "AI Usage Frequency",
  "AI Tools Used",
  "Primary AI Tool",
  "Weekly AI Frequency",
  "Academic Activities",
  "Usage Triggers",
  "Session Duration",
  "AI vs Traditional",
  // Section 3 Likert Statements
  "Dep 1 (Sulit tanpa AI)",
  "Dep 2 (Langsung ke AI sebelum coba sendiri)",
  "Dep 3 (Tugas jauh lebih berat tanpa AI)",
  "Dep 4 (Pakai AI hampir di setiap tugas)",
  "Dep 5 (Minta AI solusi lengkap)",
  "Dep 6 (Mampu tanpa AI - R)",
  "Dep 7 (Coba mandiri dulu - R)",
  "Dep 8 (Alat bantu bukan pengganti - R)",
  // Section 4 Coding
  "Coding First Action",
  "Code Generation Freq",
  "Code Debugging Freq",
  "Code Explanation Freq",
  "Ability Explain AI Code",
  "Use Ununderstood Code",
  "Test AI Code Before Use",
  // Section 5 Learning
  "Learn Faster Concepts (1-4)",
  "Learn Difficult Concepts (1-4)",
  "Learn Alternative Approaches (1-4)",
  "Learn Reduced Reliance Others (1-4)",
  "Learn Prioritize Completion (1-4)",
  "Learn Attempt Understand (1-4)",
  "Learn Encountered Hallucination",
  // Section 6 Independence & Critical
  "Crit 1 (Yakin tanpa AI)",
  "Crit 2 (Cari rujukan mandiri)",
  "Crit 3 (Evaluasi kebenaran AI)",
  "Crit 4 (Verifikasi sebelum pakai)",
  "Crit 5 (Bandingkan sumber lain)",
  "Crit 6 (Paham alur logika)",
  "Crit 7 (Terlewat deep thinking)",
  // Section 7 Perceptions
  "Boundary Explain Material",
  "Boundary Sample Code",
  "Boundary Debugging",
  "Boundary Entire Assignment",
  "Boundary Ununderstood Answer",
  "Boundary Threshold Dependency",
  "Boundary Rules Needed",
  // Section 8 Future
  "Future Career Importance (1-4)",
  "Future Proficiency Need (1-4)",
  "Future Foundational CS (1-4)",
  "Future Problem Solving (1-4)",
  "Future Prevent Overdependence (1-4)",
  "Future Top Skills",
  "Future HIMALKOM Programs",
  "Future Ideal Usage",
  // Section 9 Open
  "Open Biggest Challenge",
  "Open Effective Learning Tips",
  "Open HIMALKOM Initiative",
  // Scoring
  "Dependency Score (0-100)",
  "Dependency Band",
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
    answers.respondent_name || "-",
    answers.cohort_confirmation,
    answers.cs_interest,
    answers.ai_usage_frequency,
    Array.isArray(answers.ai_tools_used) ? answers.ai_tools_used.join("; ") : "",
    answers.primary_ai_tool,
    answers.weekly_ai_frequency,
    Array.isArray(answers.academic_activities) ? answers.academic_activities.join("; ") : "",
    Array.isArray(answers.usage_triggers) ? answers.usage_triggers.join("; ") : "",
    answers.session_duration,
    answers.ai_vs_traditional,
    // S3 Likert
    answers.dep_1,
    answers.dep_2,
    answers.dep_3,
    answers.dep_4,
    answers.dep_5,
    answers.dep_6,
    answers.dep_7,
    answers.dep_8,
    // S4 Coding
    answers.coding_first_action,
    answers.code_generation_frequency,
    answers.code_debugging_frequency,
    answers.code_explanation_frequency,
    answers.ability_explain_ai_code,
    answers.use_ununderstood_code,
    answers.test_ai_code_before_use,
    // S5 Learning
    answers.learn_faster_concepts,
    answers.learn_difficult_concepts,
    answers.learn_alternative_approaches,
    answers.learn_reduced_reliance_others,
    answers.learn_prioritize_completion,
    answers.learn_attempt_understand,
    answers.learn_encountered_hallucination,
    // S6 Critical
    answers.crit_1,
    answers.crit_2,
    answers.crit_3,
    answers.crit_4,
    answers.crit_5,
    answers.crit_6,
    answers.crit_7,
    // S7 Boundaries
    answers.boundary_explain_material,
    answers.boundary_sample_code,
    answers.boundary_debugging,
    answers.boundary_entire_assignment,
    answers.boundary_ununderstood_answer,
    answers.boundary_threshold_dependency,
    answers.boundary_rules_needed,
    // S8 Future
    answers.future_career_importance,
    answers.future_proficiency_need,
    answers.future_foundational_cs,
    answers.future_problem_solving,
    answers.future_prevent_overdependence,
    Array.isArray(answers.future_top_skills) ? answers.future_top_skills.join("; ") : "",
    Array.isArray(answers.future_himalkom_programs) ? answers.future_himalkom_programs.join("; ") : "",
    answers.future_ideal_usage,
    // S9 Open
    answers.open_biggest_challenge || "",
    answers.open_effective_learning_tips || "",
    answers.open_himalkom_initiative || "",
    // Scoring
    scoringResult.score,
    scoringResult.band,
    scoringResult.scoringVersion,
  ];
}

/**
 * Syncs a single survey submission into Google Sheets idempotently.
 */
/**
 * Safely parses and normalizes Google Service Account Private Key from environment variables.
 * Handles escaped newlines (\n), real newlines, and surrounding quotes from UI inputs.
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
        scoringVersion: "1.0.0",
      }
    );
    rows.push(row.map(escapeCSV).join(","));
  }

  return rows.join("\n");
}
