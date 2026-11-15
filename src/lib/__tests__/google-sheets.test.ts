import { describe, it, expect } from "vitest";
import {
  SPREADSHEET_HEADERS,
  formatSubmissionRow,
  generateSubmissionsCSV,
} from "../google-sheets";
import { calculateDependencyScore } from "../scoring";
import { SurveySubmissionPayload } from "../survey-schema";

const mockAnswers: SurveySubmissionPayload = {
  respondent_name: "Farrel Alfachrezi",
  nim: "M0403241015",
  cohort_confirmation: "62",
  whatsapp_number: "wa.me/6281234567890",
  ipb_email: "farrelalfachrezi@apps.ipb.ac.id",
  primary_ai_tool: "ChatGPT",
  weekly_ai_duration: "Kadang-kadang (1–3 jam/hari)",
  academic_activities: ["Minta penjelasan konsep, teori, atau algoritma yang rumit"],
  usage_triggers: ["Ingin mempercepat proses pengerjaan (efisiensi waktu)"],
  problem_solving_sequence: "Tanya AI dulu untuk gambaran awal, baru cek ulang di sumber terpercaya.",
  dep_1: 2,
  dep_2: 2,
  dep_3: 2,
  dep_4: 2,
  dep_5: 2,
  journal_case_1: "Real",
  journal_case_2: "Real",
  journal_case_3: "Real",
  journal_case_4: "Fake",
  journal_case_5: "Fake",
  journal_case_6: "Fake",
  journal_confidence: "Sangat Yakin (100%)",
  journal_reasoning: "DOI terdaftar dan pengarang konsisten dengan institusi afiliasi.",
  crit_1: 3,
  crit_2: 3,
  crit_3: 3,
  crit_4: 3,
  crit_5: 3,
  crit_6: 3,
  crit_7: 2,
  crit_8: 3,
  crit_9: 2,
  crit_10: 3,
  learn_1: 3,
  learn_2: 3,
  learn_3: 3,
  learn_4: 3,
  learn_5: 3,
  learn_6: 2,
  learn_7: 2,
  learn_8: 2,
  learn_9: 3,
  learn_practice_frequency: "Sering",
  boundary_explain_material: "Ya, sangat wajar",
  boundary_sample_code: "Ya, sangat wajar",
  boundary_debugging: "Ya, sangat wajar",
  boundary_entire_assignment: "Tidak wajar",
  boundary_threshold_essay: "Ketika mahasiswa panik saat harus coding mandiri tanpa bantuan AI.",
  future_labor_change: 4,
  future_ai_competence: 4,
  future_core_cs_needed: 4,
  future_problem_solving_key: 4,
  future_continuous_learning: 4,
  future_most_important_skill: ["B. Problem solving dan critical thinking."],
  future_biggest_challenge: ["B. Mempertahankan kemampuan fundamental programming di tengah otomatisasi."],
  future_needed_programs: ["B. Pelatihan fundamental programming dan problem solving di era AI."],
  future_ideal_graduate_profile: "Lulusan yang menguasai fondasi algoritma kuat dan mandiri.",
  feedback_task_practical_usage: "Sangat bermanfaat sebagai pendamping belajar.",
  feedback_independent_thinking: "Tetap luangkan waktu untuk sesi coding mandiri tanpa AI.",
  feedback_lecturer_academic_response: "Dosen diharapkan memberikan evaluasi berbasis pemahaman logika.",
};

describe("Google Sheets Integration - Unit Tests", () => {
  it("formats a survey submission row matching the SPREADSHEET_HEADERS count", () => {
    const scoringResult = calculateDependencyScore(mockAnswers);
    const row = formatSubmissionRow(
      "sub-12345",
      "2026-11-15T00:00:00Z",
      "2026.1",
      mockAnswers,
      scoringResult
    );

    expect(row.length).toBe(SPREADSHEET_HEADERS.length);
    expect(row[0]).toBe("sub-12345");
    expect(row[1]).toBe("2026-11-15T00:00:00Z");
    expect(row[2]).toBe("2026.1");
    expect(row[3]).toBe("Farrel Alfachrezi");
    expect(row[4]).toBe("M0403241015");
    expect(row[5]).toBe("Angkatan 62");
  });

  it("generates a valid CSV with header and data rows", () => {
    const scoringResult = calculateDependencyScore(mockAnswers);
    const csv = generateSubmissionsCSV([
      {
        id: "sub-test-1",
        submitted_at: "2026-11-15T00:00:00Z",
        answers: mockAnswers,
        dependency_score: scoringResult.score,
        dependency_category: scoringResult.band,
        scoring_details: scoringResult,
      },
    ]);

    const lines = csv.trim().split("\n");
    expect(lines.length).toBe(2); // Header + 1 Data row
    expect(lines[0]).toContain("Submission ID");
    expect(lines[0]).toContain("Platform AI Utama");
    expect(lines[1]).toContain("sub-test-1");
  });
});
