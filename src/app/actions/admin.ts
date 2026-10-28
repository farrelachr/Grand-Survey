"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth-validation";
import { syncSubmissionToGoogleSheets } from "@/lib/google-sheets";

export async function checkIsAdmin(): Promise<{ isAdmin: boolean; email?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return { isAdmin: false };

  // Check email allowlist
  if (isAdminEmail(user.email)) return { isAdmin: true, email: user.email };

  // Check database role in profiles
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      return { isAdmin: true, email: user.email };
    }
  } catch (err) {
    console.warn("Error checking admin profile:", err);
  }

  return { isAdmin: false, email: user.email };
}

export async function retryFailedSpreadsheetSync(submissionId: string) {
  const { isAdmin } = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Akses ditolak: Hanya admin yang dapat memicu sinkronisasi ulang." };
  }

  try {
    const admin = createAdminClient();
    const { data: sub, error } = await admin
      .from("survey_submissions")
      .select("id, submitted_at, answers, dependency_score, dependency_category, scoring_details, survey_versions(version)")
      .eq("id", submissionId)
      .single();

    if (error || !sub) {
      return { success: false, error: "Submisi tidak ditemukan." };
    }

    const versionStr = (sub.survey_versions as any)?.version || "2026.1";

    const syncRes = await syncSubmissionToGoogleSheets(
      sub.id,
      sub.submitted_at,
      versionStr,
      sub.answers,
      sub.scoring_details
    );

    // Update sync log
    await admin.from("spreadsheet_sync_logs").insert({
      submission_id: sub.id,
      status: syncRes.success ? "synced" : "failed",
      attempt_count: 2,
      last_error: syncRes.error || null,
      last_attempt_at: new Date().toISOString(),
      synced_at: syncRes.success ? new Date().toISOString() : null,
    });

    if (syncRes.success) {
      return { success: true, message: "Sinkronisasi ke Google Sheets berhasil!" };
    } else {
      return { success: false, error: syncRes.error || "Gagal melakukan sinkronisasi." };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
