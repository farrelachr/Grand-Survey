import { describe, it, expect } from "vitest";
import {
  calculateDependencyScore,
  normalizeLikertScore,
  getScoreCategory,
  evaluateJournalDetection,
} from "../scoring";
import { SurveySubmissionPayload } from "../survey-schema";

const mockBaseAnswers: SurveySubmissionPayload = {
  respondent_name: "Farrel Alfachrezi",
  nim: "G6401221001",
  cohort_confirmation: "62",
  whatsapp_number: "081234567890",
  ipb_email: "farrelalfachrezi@apps.ipb.ac.id",
  primary_ai_tool: "ChatGPT",
  weekly_ai_duration: "Kadang-kadang (1–3 jam/hari)",
  academic_activities: ["Minta penjelasan konsep, teori, atau algoritma yang rumit"],
  usage_triggers: ["Ingin mempercepat proses pengerjaan (efisiensi waktu)"],
  problem_solving_sequence: "Tanya AI dulu untuk gambaran awal, baru cek ulang di sumber terpercaya.",
  dep_1: 1,
  dep_2: 1,
  dep_3: 1,
  dep_4: 1,
  dep_5: 1,
  journal_case_1: "Real",
  journal_case_2: "Real",
  journal_case_3: "Real",
  journal_case_4: "Fake",
  journal_case_5: "Fake",
  journal_case_6: "Fake",
  journal_confidence: "Sangat Yakin (100%)",
  journal_reasoning: "DOI terdaftar dan pengarang konsisten dengan institusi afiliasi.",
  crit_1: 4,
  crit_2: 4,
  crit_3: 4,
  crit_4: 2,
  crit_5: 4,
  crit_6: 4,
  crit_7: 1,
  crit_8: 4,
  crit_9: 1,
  crit_10: 4,
  learn_1: 3,
  learn_2: 3,
  learn_3: 3,
  learn_4: 3,
  learn_5: 3,
  learn_6: 2,
  learn_7: 1,
  learn_8: 2,
  learn_9: 3,
  learn_practice_frequency: "Sering",
  boundary_explain_material: "Ya, sangat wajar",
  boundary_sample_code: "Ya, sangat wajar",
  boundary_debugging: "Ya, sangat wajar",
  boundary_entire_assignment: "Tidak wajar",
  boundary_threshold_essay: "Ketika mahasiswa tidak lagi mampu bernalar atau mencari solusi tanpa bantuan AI.",
  future_labor_change: 4,
  future_ai_competence: 4,
  future_core_cs_needed: 4,
  future_problem_solving_key: 4,
  future_continuous_learning: 4,
  future_most_important_skill: ["B. Problem solving dan critical thinking."],
  future_biggest_challenge: ["B. Mempertahankan kemampuan fundamental programming di tengah otomatisasi."],
  future_needed_programs: ["B. Pelatihan fundamental programming dan problem solving di era AI."],
  future_ideal_graduate_profile: "Lulusan yang menguasai fondasi algoritma kuat dan bijak mengorkestrasi AI.",
  feedback_task_practical_usage: "AI sangat bermanfaat sebagai akselerator jika pemahaman dasar tetap diprioritaskan.",
  feedback_independent_thinking: "Rutin melatih coding mandiri tanpa bantuan AI dan verifikasi dokumentasi.",
  feedback_lecturer_academic_response: "Dosen sebaiknya mengintegrasikan studi kasus evaluasi kritis AI dan responsi tatap muka.",
};

describe("Scoring Engine - Unit Tests", () => {
  it("normalizes Likert direct scores correctly", () => {
    expect(normalizeLikertScore(1, false).normalized).toBe(0);
    expect(normalizeLikertScore(2, false).normalized).toBeCloseTo(33.33, 1);
    expect(normalizeLikertScore(3, false).normalized).toBeCloseTo(66.67, 1);
    expect(normalizeLikertScore(4, false).normalized).toBe(100);
  });

  it("produces index 0 when all 5 dependency responses are 1 (lowest)", () => {
    const answers: SurveySubmissionPayload = {
      ...mockBaseAnswers,
      dep_1: 1,
      dep_2: 1,
      dep_3: 1,
      dep_4: 1,
      dep_5: 1,
    };

    const result = calculateDependencyScore(answers);
    expect(result.score).toBe(0);
    expect(result.band).toBe("RENDAH");
  });

  it("produces index 100 when all 5 dependency responses are 4 (maximum)", () => {
    const answers: SurveySubmissionPayload = {
      ...mockBaseAnswers,
      dep_1: 4,
      dep_2: 4,
      dep_3: 4,
      dep_4: 4,
      dep_5: 4,
    };

    const result = calculateDependencyScore(answers);
    expect(result.score).toBe(100);
    expect(result.band).toBe("TINGGI");
  });

  it("calculates exact mathematical score for intermediate responses", () => {
    // raw values: 3, 2, 3, 2, 3 -> sum = 13.
    // Normalized: ((13 - 5) / 15) * 100 = (8/15)*100 = 53.33
    const answers: SurveySubmissionPayload = {
      ...mockBaseAnswers,
      dep_1: 3,
      dep_2: 2,
      dep_3: 3,
      dep_4: 2,
      dep_5: 3,
    };

    const result = calculateDependencyScore(answers);
    expect(result.score).toBeCloseTo(53.33, 1);
    expect(result.band).toBe("SEDANG");
  });

  it("correctly evaluates Case Journal detection accuracy", () => {
    const answers = {
      journal_case_1: "Real",
      journal_case_2: "Real",
      journal_case_3: "Real",
      journal_case_4: "Fake",
      journal_case_5: "Fake",
      journal_case_6: "Fake",
    };
    const evalResult = evaluateJournalDetection(answers);
    expect(evalResult.correctCount).toBe(6);
    expect(evalResult.scorePercentage).toBe(100);

    const partialAnswers = {
      journal_case_1: "Real",
      journal_case_2: "Fake", // wrong
      journal_case_3: "Real",
      journal_case_4: "Real", // wrong
      journal_case_5: "Fake",
      journal_case_6: "Fake",
    };
    const partialResult = evaluateJournalDetection(partialAnswers);
    expect(partialResult.correctCount).toBe(4);
    expect(partialResult.scorePercentage).toBe(67);
  });

  it("correctly handles score category boundaries", () => {
    expect(getScoreCategory(0).band).toBe("RENDAH");
    expect(getScoreCategory(33.33).band).toBe("RENDAH");
    expect(getScoreCategory(33.34).band).toBe("SEDANG");
    expect(getScoreCategory(66.66).band).toBe("SEDANG");
    expect(getScoreCategory(66.67).band).toBe("SEDANG");
    expect(getScoreCategory(66.68).band).toBe("TINGGI");
    expect(getScoreCategory(100).band).toBe("TINGGI");
  });

  it("throws an error when a required dependency answer is missing", () => {
    const incompleteAnswers = { ...mockBaseAnswers } as Partial<SurveySubmissionPayload>;
    delete incompleteAnswers.dep_3;

    expect(() => calculateDependencyScore(incompleteAnswers as SurveySubmissionPayload)).toThrow(
      "Data kuesioner tidak lengkap: nilai 'dep_3' tidak valid atau belum diisi."
    );
  });
});
