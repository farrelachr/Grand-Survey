import { describe, it, expect } from "vitest";
import { generateQuestionAnalytics } from "../question-analytics";

describe("Question Analytics Engine Tests", () => {
  it("extracts all 54 non-essay items accurately across sections 1 to 8", () => {
    const mockSubs = [
      {
        id: "sub-1",
        answers: {
          cohort_confirmation: "Angkatan 62 (2025)",
          cs_interest: "Software Engineering & Web/Mobile Dev",
          ai_usage_frequency: "Setiap hari (beberapa kali sehari)",
          ai_tools_used: ["ChatGPT (OpenAI)", "Claude (Anthropic)"],
          dep_1: 3,
          dep_2: 2,
        },
      },
    ];

    const analytics = generateQuestionAnalytics(mockSubs);

    // 54 non-essay items:
    // S1: 4
    // S2: 6
    // S3: 8 Likert statements
    // S4: 7
    // S5: 6 Likert + 1 single = 7
    // S6: 7 Likert statements
    // S7: 7
    // S8: 5 Likert + 2 multi + 1 single = 8
    // Total = 4 + 6 + 8 + 7 + 7 + 7 + 7 + 8 = 54
    expect(analytics.length).toBe(54);

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
