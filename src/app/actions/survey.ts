"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SurveySubmissionSchema, SURVEY_VERSION, SurveySubmissionPayload } from "@/lib/survey-schema";
import { calculateDependencyScore } from "@/lib/scoring";
import { validateStudentEmail } from "@/lib/auth-validation";
import { syncSubmissionToGoogleSheets } from "@/lib/google-sheets";

export interface SubmitSurveyResult {
  success: boolean;
  submissionId?: string;
  error?: string;
  isDuplicate?: boolean;
}

export async function submitSurvey(data: unknown): Promise<SubmitSurveyResult> {
  try {
    // 1. Authenticate user from server session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Sesi Anda telah berakhir atau belum terautentikasi. Silakan masuk kembali.",
      };
    }

    // 2. Validate email domain on server
    const emailValidation = validateStudentEmail(user.email || "");
    if (!emailValidation.isValid) {
      return {
        success: false,
        error: emailValidation.error || "Akses ditolak: Alamat email tidak memenuhi kriteria institusi.",
      };
    }

    // 3. Validate complete payload via Zod
    const parseResult = SurveySubmissionSchema.safeParse(data);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const issuePath = firstIssue.path ? firstIssue.path.join(".") : "data";
      return {
        success: false,
        error: `Validasi gagal pada '${issuePath}': ${firstIssue.message}`,
      };
    }

    const validAnswers: SurveySubmissionPayload = parseResult.data;

    // 4. Check active survey version
    // Use admin client to reliably query survey version and manage records
    const admin = createAdminClient();
    const { data: versionRow, error: versionError } = await admin
      .from("survey_versions")
      .select("id, version")
      .eq("version", SURVEY_VERSION)
      .eq("is_active", true)
      .single();

    if (versionError || !versionRow) {
      return {
        success: false,
        error: "Versi survei aktif tidak ditemukan di sistem database.",
      };
    }

    // 5. Prevent duplicate submission: check if user already submitted for this version
    const { data: existingSub } = await admin
      .from("survey_submissions")
      .select("id")
      .eq("user_id", user.id)
      .eq("survey_version_id", versionRow.id)
      .maybeSingle();

    if (existingSub) {
      return {
        success: true,
        submissionId: existingSub.id,
        isDuplicate: true,
      };
    }

    // 6. Compute primary dependency score server-side
    const scoringResult = calculateDependencyScore(validAnswers);

    // 7. Insert submission with trusted user ID and computed scores
    const { data: newSubmission, error: insertError } = await admin
      .from("survey_submissions")
      .insert({
        user_id: user.id,
        survey_version_id: versionRow.id,
        answers: validAnswers,
        dependency_score: scoringResult.score,
        dependency_category: scoringResult.band,
        scoring_details: scoringResult,
        submitted_at: new Date().toISOString(),
      })
      .select("id, submitted_at")
      .single();

    if (insertError || !newSubmission) {
      // If unique violation occurred concurrently
      if (insertError?.code === "23505") {
        const { data: concurrentSub } = await admin
          .from("survey_submissions")
          .select("id")
          .eq("user_id", user.id)
          .eq("survey_version_id", versionRow.id)
          .single();

        return {
          success: true,
          submissionId: concurrentSub?.id,
          isDuplicate: true,
        };
      }

      return {
        success: false,
        error: "Gagal menyimpan jawaban ke database. Silakan coba kembali.",
      };
    }

    const submissionId = newSubmission.id;

    // 8. Asynchronously sync to Google Sheets without blocking result page
    // Log the sync attempt
    (async () => {
      try {
        const syncRes = await syncSubmissionToGoogleSheets(
          submissionId,
          newSubmission.submitted_at,
          SURVEY_VERSION,
          validAnswers,
          scoringResult
        );

        await admin.from("spreadsheet_sync_logs").insert({
          submission_id: submissionId,
          status: syncRes.status === "synced" || syncRes.status === "already_synced" ? "synced" : "failed",
          attempt_count: 1,
          last_error: syncRes.error || null,
          last_attempt_at: new Date().toISOString(),
          synced_at: syncRes.success ? new Date().toISOString() : null,
        });
      } catch (logErr: unknown) {
        console.error("Non-blocking Google Sheets sync error:", logErr);
      }
    })();

    return {
      success: true,
      submissionId,
    };
  } catch (err: unknown) {
    console.error("Survey submission server error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan internal pada server saat memproses jawaban survei.",
    };
  }
}

export type SubmissionResultResponse =
  | {
      success: true;
      data: {
        id: string;
        submittedAt: string;
        score: number;
        category: string;
        scoringDetails: any;
        version: any;
      };
    }
  | {
      success: false;
      error: string;
      message: string;
      data?: undefined;
    };

/**
 * Retrieves a submission result securely.
 * Regular respondents can only retrieve their own submission.
 */
export async function getSubmissionResult(submissionId: string): Promise<SubmissionResultResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "UNAUTHORIZED", message: "Silakan masuk terlebih dahulu." };
    }

    // Check user profile or admin status
    const admin = createAdminClient();
    const { data: submission, error: subError } = await admin
      .from("survey_submissions")
      .select("id, user_id, submitted_at, dependency_score, dependency_category, scoring_details, answers, survey_versions(version, title)")
      .eq("id", submissionId)
      .single();

    if (subError || !submission) {
      return { success: false, error: "NOT_FOUND", message: "Hasil survei tidak ditemukan." };
    }

    // Authorization check: must be owner or authorized admin
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";
    if (submission.user_id !== user.id && !isAdmin) {
      return {
        success: false,
        error: "FORBIDDEN",
        message: "Anda tidak memiliki otorisasi untuk melihat hasil respons pengguna lain.",
      };
    }

    return {
      success: true,
      data: {
        id: submission.id,
        submittedAt: submission.submitted_at,
        score: submission.dependency_score,
        category: submission.dependency_category,
        scoringDetails: submission.scoring_details,
        version: submission.survey_versions,
      },
    };
  } catch (err) {
    console.error("Error fetching submission result:", err);
    return { success: false, error: "SERVER_ERROR", message: "Gagal memuat hasil evaluasi." };
  }
}
