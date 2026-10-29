import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { validateStudentEmail, isAdminEmail } from "@/lib/auth-validation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SurveyWizard } from "@/components/SurveyWizard";
import { createAdminClient } from "@/lib/supabase/admin";
import { SURVEY_VERSION } from "@/lib/survey-schema";

export const metadata = {
  title: "Kuesioner — Grand Survey HIMALKOM 2026",
  description: "Formulir survei ketergantungan AI mahasiswa Ilmu Komputer IPB Angkatan 62.",
};

export const dynamic = "force-dynamic";

export default async function SurveyPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Verify email domain
  const validation = validateStudentEmail(user.email || "");
  if (!validation.isValid) {
    redirect(`/login?error=${encodeURIComponent("Akses ditolak: Gunakan email resmi IPB University.")}`);
  }

  // Check if respondent already submitted (non-admin can only submit once)
  const isAdmin = isAdminEmail(user.email);
  let existingSubmissionId: string | null = null;

  if (!isAdmin) {
    try {
      const admin = createAdminClient();
      const { data: versionRow } = await admin
        .from("survey_versions")
        .select("id")
        .eq("version", SURVEY_VERSION)
        .maybeSingle();

      if (versionRow) {
        const { data: existingSubmission } = await admin
          .from("survey_submissions")
          .select("id")
          .eq("user_id", user.id)
          .eq("survey_version_id", versionRow.id)
          .maybeSingle();

        if (existingSubmission) {
          existingSubmissionId = existingSubmission.id;
        }
      }
    } catch (checkErr) {
      console.warn("Could not check prior submission:", checkErr);
    }

    if (existingSubmissionId) {
      redirect(`/result/${existingSubmissionId}?already_submitted=1`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <SurveyWizard userEmail={user.email || ""} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
