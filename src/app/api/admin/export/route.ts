import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth-validation";
import { generateSubmissionsCSV } from "@/lib/google-sheets";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Check admin authorization
  let isAuthorized = isAdminEmail(user.email);
  if (!isAuthorized) {
    try {
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role === "admin") {
        isAuthorized = true;
      }
    } catch {
      // Ignore
    }
  }

  if (!isAuthorized) {
    return new NextResponse("Forbidden: Admin access required", { status: 403 });
  }

  try {
    const admin = createAdminClient();
    const { data: submissions, error } = await admin
      .from("survey_submissions")
      .select("id, submitted_at, answers, dependency_score, dependency_category, scoring_details, survey_versions(version)")
      .order("submitted_at", { ascending: false });

    if (error) {
      return new NextResponse("Database error fetching submissions", { status: 500 });
    }

    const csvContent = generateSubmissionsCSV((submissions as any) || []);

    const dateStr = new Date().toISOString().split("T")[0];
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="grand-survey-himalkom-2026-export-${dateStr}.csv"`,
      },
    });
  } catch (err: unknown) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
