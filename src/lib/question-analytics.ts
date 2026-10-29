import { SURVEY_SECTIONS_DATA } from "./survey-questions";
import { LIKERT_OPTIONS } from "./survey-schema";

export interface AnalyzedQuestionItem {
  id: string;
  sectionNumber: number;
  sectionTitle: string;
  index: number;
  title: string;
  description?: string;
  type: "single_choice" | "multiple_choice" | "likert";
  chartData: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  totalAnswered: number;
  mean?: number; // For likert items (1.0 to 4.0)
}

/**
 * Extracts and computes visual analytics for all 54 non-essay survey questions.
 */
export function generateQuestionAnalytics(
  submissions: Array<{
    id: string;
    answers: Record<string, any>;
  }>
): AnalyzedQuestionItem[] {
  const result: AnalyzedQuestionItem[] = [];
  const totalSubmissions = submissions.length;
  let globalIndex = 1;

  for (const section of SURVEY_SECTIONS_DATA) {
    // Skip Section 9 (Essay items)
    if (section.sectionNumber === 9) continue;

    for (const q of section.questions) {
      if (q.type === "likert_matrix" && q.statements) {
        // Each Likert statement is a non-essay question item
        for (const st of q.statements) {
          const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
          let answeredCount = 0;
          let sumScore = 0;

          for (const sub of submissions) {
            const rawVal = sub.answers?.[st.id];
            if (rawVal !== undefined && rawVal !== null && rawVal >= 1 && rawVal <= 4) {
              const valNum = Number(rawVal);
              counts[valNum] = (counts[valNum] || 0) + 1;
              answeredCount++;
              sumScore += valNum;
            }
          }

          const chartData = LIKERT_OPTIONS.map((lo) => {
            const count = counts[lo.value] || 0;
            const percentage = answeredCount > 0 ? Math.round((count / answeredCount) * 100) : 0;
            return {
              name: `${lo.value}. ${lo.label}`,
              count,
              percentage,
            };
          });

          const mean = answeredCount > 0 ? Math.round((sumScore / answeredCount) * 100) / 100 : undefined;

          result.push({
            id: st.id,
            sectionNumber: section.sectionNumber,
            sectionTitle: section.title,
            index: globalIndex++,
            title: st.statement,
            description: q.description,
            type: "likert",
            chartData,
            totalAnswered: answeredCount,
            mean,
          });
        }
      } else if (q.type === "single_choice" && q.options) {
        const counts: Record<string, number> = {};
        for (const opt of q.options) {
          counts[opt.value] = 0;
        }

        let answeredCount = 0;
        for (const sub of submissions) {
          const val = sub.answers?.[q.id];
          if (val) {
            counts[val] = (counts[val] || 0) + 1;
            answeredCount++;
          }
        }

        const chartData = q.options.map((opt) => {
          const count = counts[opt.value] || 0;
          const percentage = answeredCount > 0 ? Math.round((count / answeredCount) * 100) : 0;
          return {
            name: opt.label || opt.value,
            count,
            percentage,
          };
        });

        result.push({
          id: q.id,
          sectionNumber: section.sectionNumber,
          sectionTitle: section.title,
          index: globalIndex++,
          title: q.title,
          description: q.description,
          type: "single_choice",
          chartData,
          totalAnswered: answeredCount,
        });
      } else if (q.type === "multiple_choice" && q.options) {
        const counts: Record<string, number> = {};
        for (const opt of q.options) {
          counts[opt.value] = 0;
        }

        let totalRespondentsAnswered = 0;
        for (const sub of submissions) {
          const valList = sub.answers?.[q.id];
          if (Array.isArray(valList) && valList.length > 0) {
            totalRespondentsAnswered++;
            for (const item of valList) {
              counts[item] = (counts[item] || 0) + 1;
            }
          }
        }

        const chartData = q.options
          .map((opt) => {
            const count = counts[opt.value] || 0;
            const percentage =
              totalRespondentsAnswered > 0
                ? Math.round((count / totalRespondentsAnswered) * 100)
                : 0;
            return {
              name: opt.label || opt.value,
              count,
              percentage,
            };
          })
          .sort((a, b) => b.count - a.count);

        result.push({
          id: q.id,
          sectionNumber: section.sectionNumber,
          sectionTitle: section.title,
          index: globalIndex++,
          title: q.title,
          description: `${q.description || ""} (Pilihan Ganda — Total responden memilih: ${totalRespondentsAnswered})`,
          type: "multiple_choice",
          chartData,
          totalAnswered: totalRespondentsAnswered,
        });
      }
    }
  }

  return result;
}
