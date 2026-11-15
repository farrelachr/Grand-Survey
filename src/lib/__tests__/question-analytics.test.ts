import { describe, it, expect } from "vitest";
import { generateQuestionAnalytics } from "../question-analytics";

describe("Question Analytics Engine Tests", () => {
  it("extracts all 50 non-essay items accurately across sections 1 to 8", () => {
    const mockSubs = [
      {
        id: "sub-1",
        answers: {
          cohort_confirmation: "62",
          primary_ai_tool: "ChatGPT",
          weekly_ai_duration: "Kadang-kadang (1–3 jam/hari)",
          dep_1: 3,
          dep_2: 2,
        },
      },
    ];

    const analytics = generateQuestionAnalytics(mockSubs);

    // 50 non-essay items:
    // S1: 1 (cohort_confirmation)
    // S2: 5 (primary_ai_tool, weekly_ai_duration, academic_activities, usage_triggers, problem_solving_sequence)
    // S3: 5 Likert statements (dep_1 to dep_5)
    // S4: 7 (6 journal cases + journal_confidence)
    // S5: 10 Likert statements (crit_1 to crit_10)
    // S6: 10 (9 Likert statements + learn_practice_frequency)
    // S7: 4 (boundary_explain_material, boundary_sample_code, boundary_debugging, boundary_entire_assignment)
    // S8: 8 (5 Likert statements + 3 multiple choices)
    // Total = 1 + 5 + 5 + 7 + 10 + 10 + 4 + 8 = 50
    expect(analytics.length).toBe(50);

    const first = analytics[0];
    expect(first.id).toBe("cohort_confirmation");
    expect(first.sectionNumber).toBe(1);
    expect(first.chartData.length).toBeGreaterThan(0);

    const likertItem = analytics.find((item) => item.id === "dep_1");
    expect(likertItem).toBeDefined();
    expect(likertItem?.type).toBe("likert");
    expect(likertItem?.chartData.length).toBe(4);
    expect(likertItem?.mean).toBe(3);
  });
});
