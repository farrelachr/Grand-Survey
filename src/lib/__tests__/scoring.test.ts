import { describe, it, expect } from "vitest";
import {
  calculateDependencyScore,
  normalizeLikertScore,
  getScoreCategory,
} from "../scoring";
import { SurveySubmissionPayload } from "../survey-schema";

const mockBaseAnswers: SurveySubmissionPayload = {
  respondent_name: "Farrel Alfachrezi",
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
  dep_1: 1,
  dep_2: 1,
  dep_3: 1,
  dep_4: 1,
  dep_5: 1,
  dep_6: 4, // reverse
  dep_7: 4, // reverse
  dep_8: 4, // reverse
  coding_first_action: "Membaca pesan error dan stack trace mandiri terlebih dahulu",
  code_generation_frequency: "Kadang-kadang",
  code_debugging_frequency: "Kadang-kadang",
  code_explanation_frequency: "Sering",
  ability_explain_ai_code: "Sangat mampu",
  use_ununderstood_code: "Tidak pernah",
  test_ai_code_before_use: "Selalu diuji menyeluruh",
  learn_faster_concepts: 3,
  learn_difficult_concepts: 3,
  learn_alternative_approaches: 3,
  learn_reduced_reliance_others: 2,
  learn_prioritize_completion: 2,
  learn_attempt_understand: 4,
  learn_encountered_hallucination: "Cukup sering",
  crit_1: 4,
  crit_2: 4,
  crit_3: 4,
  crit_4: 4,
  crit_5: 4,
  crit_6: 4,
  crit_7: 1,
  boundary_explain_material: "Sangat etis dan dianjurkan",
  boundary_sample_code: "Sangat wajar dan etis",
  boundary_debugging: "Sangat wajar dan efisien",
  boundary_entire_assignment: "Pelanggaran integritas akademik serius",
  boundary_ununderstood_answer: "Sangat tidak dapat dibenarkan",
  boundary_threshold_dependency: "Merasa panik saat harus coding tanpa AI",
  boundary_rules_needed: "Sangat perlu: Aturan tertulis yang tegas",
  future_career_importance: 4,
  future_proficiency_need: 4,
  future_foundational_cs: 4,
  future_problem_solving: 4,
  future_prevent_overdependence: 4,
  future_top_skills: ["Problem Solving & Algorithmic Thinking"],
  future_himalkom_programs: ["Workshop AI Tools & Ethical Engineering"],
  future_ideal_usage: "Co-pilot berpikir setelah ide dan logika dipahami",
  open_biggest_challenge: "Tantangan dalam menjaga ketajaman berpikir mandiri.",
  open_effective_learning_tips: "Membuat batasan waktu mandiri sebelum bertanya.",
  open_himalkom_initiative: "Workshop berkala tentang coding tanpa AI.",
};

describe("Scoring Engine - Unit Tests", () => {
  it("normalizes Likert direct scores correctly", () => {
    expect(normalizeLikertScore(1, false).normalized).toBe(0);
    expect(normalizeLikertScore(2, false).normalized).toBeCloseTo(33.33, 1);
    expect(normalizeLikertScore(3, false).normalized).toBeCloseTo(66.67, 1);
    expect(normalizeLikertScore(4, false).normalized).toBe(100);
  });

  it("normalizes Likert reversed scores correctly", () => {
    // For reversed statements:
    // 1 (Strongly Disagree) -> 5 - 1 = 4 -> normalized = 100
    // 4 (Strongly Agree) -> 5 - 4 = 1 -> normalized = 0
    expect(normalizeLikertScore(1, true).normalized).toBe(100);
    expect(normalizeLikertScore(2, true).normalized).toBeCloseTo(66.67, 1);
    expect(normalizeLikertScore(3, true).normalized).toBeCloseTo(33.33, 1);
    expect(normalizeLikertScore(4, true).normalized).toBe(0);
  });

  it("produces index 0 when all dependency responses are lowest and independence responses are highest", () => {
    const answers: SurveySubmissionPayload = {
      ...mockBaseAnswers,
      dep_1: 1,
      dep_2: 1,
      dep_3: 1,
      dep_4: 1,
      dep_5: 1,
      dep_6: 4, // 5-4 = 1 -> 0
      dep_7: 4, // 5-4 = 1 -> 0
      dep_8: 4, // 5-4 = 1 -> 0
    };

    const result = calculateDependencyScore(answers);
    expect(result.score).toBe(0);
    expect(result.band).toBe("RENDAH");
  });

  it("produces index 100 when all responses indicate maximum dependency", () => {
    const answers: SurveySubmissionPayload = {
      ...mockBaseAnswers,
      dep_1: 4, // 100
      dep_2: 4, // 100
      dep_3: 4, // 100
      dep_4: 4, // 100
      dep_5: 4, // 100
      dep_6: 1, // 5-1 = 4 -> 100
      dep_7: 1, // 5-1 = 4 -> 100
      dep_8: 1, // 5-1 = 4 -> 100
    };

    const result = calculateDependencyScore(answers);
    expect(result.score).toBe(100);
    expect(result.band).toBe("TINGGI");
  });

  it("calculates exact mathematical mean for mixed responses", () => {
    // 4 items with 100, 4 items with 0 -> mean = 50.00
    const answers: SurveySubmissionPayload = {
      ...mockBaseAnswers,
      dep_1: 4, // 100
      dep_2: 4, // 100
      dep_3: 4, // 100
      dep_4: 4, // 100
      dep_5: 1, // 0
      dep_6: 4, // 0
      dep_7: 4, // 0
      dep_8: 4, // 0
    };

    const result = calculateDependencyScore(answers);
    expect(result.score).toBe(50);
    expect(result.band).toBe("SEDANG");
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
      "Missing answer for required dependency statement: dep_3"
    );
  });
});
