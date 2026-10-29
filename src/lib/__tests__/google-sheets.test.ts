import { describe, it, expect } from "vitest";
import {
  SPREADSHEET_HEADERS,
  formatSubmissionRow,
  generateSubmissionsCSV,
} from "../google-sheets";
import { calculateDependencyScore } from "../scoring";
import { SurveySubmissionPayload } from "../survey-schema";

const mockAnswers: SurveySubmissionPayload = {
  cohort_confirmation: "Angkatan 62 (2025)",
  cs_interest: "Software Engineering & Web/Mobile Dev",
  ai_usage_frequency: "Setiap hari (beberapa kali sehari)",
  ai_tools_used: ["ChatGPT (OpenAI)", "Claude (Anthropic)"],
  primary_ai_tool: "ChatGPT",
  weekly_ai_frequency: "6 - 10 jam per minggu",
  academic_activities: ["Mengerjakan tugas coding / praktikum"],
  usage_triggers: ["Menghadapi error / bug yang sulit dipecahkan"],
  session_duration: "30 - 60 menit",
  ai_vs_traditional: "Seimbang antara AI dan sumber lain",
  dep_1: 2,
  dep_2: 2,
  dep_3: 2,
  dep_4: 2,
  dep_5: 2,
  dep_6: 3,
  dep_7: 3,
  dep_8: 3,
  coding_first_action: "Membaca pesan error mandiri",
  code_generation_frequency: "Kadang-kadang",
  code_debugging_frequency: "Kadang-kadang",
  code_explanation_frequency: "Sering",
  ability_explain_ai_code: "Cukup mampu",
  use_ununderstood_code: "Pernah satu atau dua kali",
  test_ai_code_before_use: "Selalu diuji menyeluruh",
  learn_faster_concepts: 3,
  learn_difficult_concepts: 3,
  learn_alternative_approaches: 3,
  learn_reduced_reliance_others: 2,
  learn_prioritize_completion: 2,
  learn_attempt_understand: 3,
  learn_encountered_hallucination: "Cukup sering",
  crit_1: 3,
  crit_2: 3,
  crit_3: 3,
  crit_4: 3,
  crit_5: 3,
  crit_6: 3,
  crit_7: 2,
  boundary_explain_material: "Sangat etis",
  boundary_sample_code: "Sangat wajar",
  boundary_debugging: "Sangat wajar",
  boundary_entire_assignment: "Pelanggaran integritas",
  boundary_ununderstood_answer: "Sangat tidak dapat dibenarkan",
  boundary_threshold_dependency: "Merasa panik saat harus coding tanpa AI",
  boundary_rules_needed: "Sangat perlu: Aturan tertulis yang tegas",
  future_career_importance: 4,
  future_proficiency_need: 4,
  future_foundational_cs: 4,
  future_problem_solving: 4,
  future_prevent_overdependence: 4,
  future_top_skills: ["Problem Solving & Algorithmic Thinking"],
  future_himalkom_programs: ["Workshop AI Tools"],
  future_ideal_usage: "Co-pilot berpikir setelah ide dipahami",
  open_biggest_challenge: "Tantangan menjaga kemandirian.",
  open_effective_learning_tips: "Beri batasan waktu sebelum tanya AI.",
  open_himalkom_initiative: "Sesi coding tanpa AI.",
};

describe("Google Sheets & CSV Export Tests", () => {
  it("formats row with exact matching length to headers", () => {
    const scoreResult = calculateDependencyScore(mockAnswers);
    const row = formatSubmissionRow(
      "test-sub-123",
      "2026-10-28T12:00:00Z",
      "2026.1",
      mockAnswers,
      scoreResult
    );

    expect(row.length).toBe(SPREADSHEET_HEADERS.length);
    expect(row[0]).toBe("test-sub-123");
    expect(row[row.length - 2]).toBe(scoreResult.band);
    expect(row[row.length - 3]).toBe(scoreResult.score);
  });

  it("generates valid escaped CSV string", () => {
    const scoreResult = calculateDependencyScore(mockAnswers);
    const submissions = [
      {
        id: "sub-1",
        submitted_at: "2026-10-28T12:00:00Z",
        survey_version: { version: "2026.1" },
        answers: mockAnswers,
        dependency_score: scoreResult.score,
        dependency_category: scoreResult.band,
        scoring_details: scoreResult,
      },
    ];

    const csv = generateSubmissionsCSV(submissions);
    expect(csv).toContain("Submission ID");
    expect(csv).toContain("sub-1");
    expect(csv).toContain("Angkatan 62 (2025)");
  });

  it("safely normalizes Google private key with escaped newlines and wrapping quotes", async () => {
    const { getGooglePrivateKey } = await import("../google-sheets");

    const originalKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    try {
      // Test with escaped \n and surrounding double quotes
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = '"-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"';
      const parsed1 = getGooglePrivateKey();
      expect(parsed1?.startsWith('"')).toBe(false);
      expect(parsed1?.endsWith('"')).toBe(false);
      expect(parsed1).toContain("\n");

      // Test with single quotes
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = "'-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n'";
      const parsed2 = getGooglePrivateKey();
      expect(parsed2?.startsWith("'")).toBe(false);
      expect(parsed2?.endsWith("'")).toBe(false);
      expect(parsed2).toContain("\n");
    } finally {
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = originalKey;
    }
  });
});
