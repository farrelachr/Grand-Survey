import { SCORING_VERSION, SurveySubmissionPayload } from "./survey-schema";

export type DependencyBand = "RENDAH" | "SEDANG" | "TINGGI";

export interface ItemScoreDetail {
  id: string;
  statement: string;
  rawLikert: number;
  isReversed: boolean;
  effectiveScore: number;
  normalizedScore: number; // 0 to 100
}

export interface ScoringResult {
  scoringVersion: string;
  score: number; // 0.00 to 100.00
  band: DependencyBand;
  bandLabel: string;
  bandDescription: string;
  itemDetails: ItemScoreDetail[];
  observations: string[];
  recommendations: string[];
  calculatedAt: string;
}

export const DEPENDENCY_STATEMENTS = [
  {
    id: "dep_1",
    statement: "Saya merasa kesulitan menyelesaikan tugas akademik tanpa bantuan AI.",
    isReversed: false,
  },
  {
    id: "dep_2",
    statement: "Saya cenderung langsung menggunakan AI sebelum mencoba memikirkan solusi sendiri.",
    isReversed: false,
  },
  {
    id: "dep_3",
    statement: "Pekerjaan akademik saya terasa jauh lebih berat apabila tidak ada AI.",
    isReversed: false,
  },
  {
    id: "dep_4",
    statement: "Saya menggunakan AI untuk hampir setiap tugas akademik yang saya kerjakan.",
    isReversed: false,
  },
  {
    id: "dep_5",
    statement: "Saya meminta AI untuk memberikan solusi lengkap tugas saya.",
    isReversed: false,
  },
  {
    id: "dep_6",
    statement: "Saya tetap mampu menyelesaikan tugas akademik dengan baik meskipun tanpa AI.",
    isReversed: true,
  },
  {
    id: "dep_7",
    statement: "Saya selalu berusaha menyelesaikan masalah secara mandiri terlebih dahulu sebelum bertanya ke AI.",
    isReversed: true,
  },
  {
    id: "dep_8",
    statement: "Saya memperlakukan AI sebagai alat bantu berpikir, bukan pengganti proses berpikir saya.",
    isReversed: true,
  },
] as const;

/**
 * Normalizes a 1–4 Likert rating into a 0–100 scale.
 * 1 -> 0
 * 2 -> 33.333333333333336
 * 3 -> 66.66666666666667
 * 4 -> 100
 */
export function normalizeLikertScore(rawLikert: number, isReversed: boolean): { effectiveScore: number; normalized: number } {
  if (rawLikert < 1 || rawLikert > 4) {
    throw new Error(`Invalid Likert value: ${rawLikert}. Must be between 1 and 4.`);
  }

  const effectiveScore = isReversed ? 5 - rawLikert : rawLikert;
  const normalized = ((effectiveScore - 1) / 3) * 100;
  return { effectiveScore, normalized };
}

/**
 * Assigns category band based on score:
 * 0.00 – 33.33: Rendah
 * >33.33 – 66.67: Sedang
 * >66.67 – 100.00: Tinggi
 */
export function getScoreCategory(score: number): { band: DependencyBand; label: string; description: string } {
  if (score < 0 || score > 100) {
    throw new Error(`Score out of range: ${score}`);
  }

  if (score <= 33.33) {
    return {
      band: "RENDAH",
      label: "Kecenderungan Ketergantungan Rendah",
      description:
        "Pola respons Anda mencerminkan kemandirian akademik yang kuat. Anda memperlakukan AI sebagai alat bantu opsional dan mempertahankan proses bernalar mandiri dalam memecahkan masalah komputasi.",
    };
  }

  if (score <= 66.67) {
    return {
      band: "SEDANG",
      label: "Kecenderungan Ketergantungan Sedang",
      description:
        "Pola respons Anda menunjukkan integrasi AI yang cukup aktif dalam rutinitas akademik. Terdapat keseimbangan antara efisiensi bantuan AI dan upaya mandiri, namun perlu menjaga kewaspadaan agar tidak terjadi degradasi inisiatif berpikir kritis.",
    };
  }

  return {
    band: "TINGGI",
    label: "Kecenderungan Ketergantungan Tinggi",
    description:
      "Pola respons Anda mengindikasikan ketergantungan yang signifikan terhadap AI dalam menyelesaikan aktivitas akademik. Anda cenderung mengalihkan beban penalaran (cognitive offloading) ke AI, yang berpotensi menurunkan ketajaman pemecahan masalah mandiri.",
  };
}

/**
 * Generates descriptive observations based on submitted answers.
 */
function generateObservations(answers: SurveySubmissionPayload): string[] {
  const observations: string[] = [];

  // Coding observation
  if (answers.coding_first_action?.includes("Langsung copy-paste")) {
    observations.push(
      "Refleks pertama Anda saat menemui error coding adalah langsung menyerahkannya ke AI, yang dapat mengurangi kesempatan melatih intuisi pembacaan stack trace."
    );
  } else if (answers.coding_first_action?.includes("Membaca pesan error")) {
    observations.push(
      "Anda mempertahankan disiplin diagnosis mandiri dengan membaca stack trace terlebih dahulu sebelum mencari bantuan eksternal."
    );
  }

  // Code comprehension
  if (answers.use_ununderstood_code?.includes("Sering") || answers.use_ununderstood_code?.includes("beberapa kali")) {
    observations.push(
      "Anda teridentifikasi pernah memanfaatkan kode dari AI tanpa memahami logikanya secara tuntas, umumnya dipicu oleh tekanan tenggat waktu tugas."
    );
  } else {
    observations.push(
      "Anda memiliki komitmen yang konsisten untuk selalu memahami logika kode buatan AI sebelum mengadopsinya dalam tugas praktikum."
    );
  }

  // Verification & Critical Thinking
  if (answers.crit_4 >= 3 && answers.crit_6 >= 3) {
    observations.push(
      "Sikap kritis Anda dalam memverifikasi dan menganalisis penalaran di balik output AI tergolong matang dan berorientasi validasi."
    );
  } else {
    observations.push(
      "Tingkat verifikasi mandiri terhadap keluaran AI masih berpeluang ditingkatkan, khususnya dalam melakukan uji silang dengan dokumentasi resmi."
    );
  }

  // Learning vs Completion Priority
  if (answers.learn_prioritize_completion >= 3) {
    observations.push(
      "Dorongan efisiensi dan penyelesaian tugas cepat kadang menggeser prioritas pemahaman konseptual yang mendalam."
    );
  }

  return observations;
}

/**
 * Generates actionable practical recommendations for computer science students.
 */
function generateRecommendations(score: number, answers: SurveySubmissionPayload): string[] {
  const recommendations: string[] = [];

  recommendations.push(
    "Lakukan sesi 'AI-Free Coding': Sisihkan 1–2 jam per minggu untuk memecahkan problem algoritma atau debugging murni menggunakan debugger bawaan IDE dan dokumentasi resmi."
  );

  recommendations.push(
    "Posisikan AI sebagai Socrates (Tutor Berpikir): Alih-alih meminta solusi jadi, instruksikan AI dengan prompt 'Berikan saya petunjuk konsep atau pertanyaan penuntun tanpa memberikan kode lengkap'."
  );

  if (answers.ability_explain_ai_code?.includes("Kurang") || answers.ability_explain_ai_code?.includes("Tidak")) {
    recommendations.push(
      "Uji Diri dengan Metode Feynman: Setiap kali menerima penjelasan atau sintaks dari AI, cobalah jelaskan kembali alur logika kode tersebut dengan kata-kata sendiri tanpa melihat layar."
    );
  }

  recommendations.push(
    "Verifikasi Halusinasi: Biasakan memeriksa keberadaan fungsi atau library yang disarankan AI di dokumentasi resmi bahasa pemrograman untuk memastikan akurasi dan 'best practices'."
  );

  return recommendations;
}

/**
 * Pure calculation function for the Primary Dependency Index.
 */
export function calculateDependencyScore(answers: SurveySubmissionPayload): ScoringResult {
  const itemDetails: ItemScoreDetail[] = [];
  let totalNormalized = 0;

  for (const item of DEPENDENCY_STATEMENTS) {
    const rawVal = answers[item.id as keyof SurveySubmissionPayload] as number | undefined;

    if (rawVal === undefined || rawVal === null) {
      throw new Error(`Missing answer for required dependency statement: ${item.id}`);
    }

    const { effectiveScore, normalized } = normalizeLikertScore(rawVal, item.isReversed);

    itemDetails.push({
      id: item.id,
      statement: item.statement,
      rawLikert: rawVal,
      isReversed: item.isReversed,
      effectiveScore,
      normalizedScore: Math.round(normalized * 100) / 100,
    });

    totalNormalized += normalized;
  }

  const rawMean = totalNormalized / DEPENDENCY_STATEMENTS.length;
  // Round to 2 decimal places
  const score = Math.round(rawMean * 100) / 100;

  const { band, label, description } = getScoreCategory(score);
  const observations = generateObservations(answers);
  const recommendations = generateRecommendations(score, answers);

  return {
    scoringVersion: SCORING_VERSION,
    score,
    band,
    bandLabel: label,
    bandDescription: description,
    itemDetails,
    observations,
    recommendations,
    calculatedAt: new Date().toISOString(),
  };
}
