import { SCORING_VERSION, SurveySubmissionPayload } from "./survey-schema";

export type DependencyBand = "RENDAH" | "SEDANG" | "TINGGI";

export interface CardMetrics {
  debuggingAutonomy: number;
  criticalVerification: number;
  dependencyScore: number;
  journalDetectionScore?: number; // 0 - 6 correct
}

export interface PersonalizedSolution {
  id: string;
  title: string;
  iconName: "terminal" | "timer" | "shield" | "file-text" | "code" | "compass";
  advice: string;
}

export interface ArchetypeProfile {
  id: string;
  name: string;
  subtitle: string;
  editionNo: string;
  tagline: string;
  description: string;
  insigniaType: "dialectic" | "prism" | "pulse" | "automaton" | "terminal" | "compass";
  characteristics: string[];
  metrics: CardMetrics;
  badgeTheme: {
    bg: string;
    text: string;
    border: string;
    accent: string;
  };
}

export interface SuperpowerInsight {
  id: string;
  title: string;
  tag: string;
  description: string;
}

export interface BlindSpotInsight {
  id: string;
  title: string;
  tag: string;
  riskDescription: string;
  microAction: string;
}

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
  archetype?: ArchetypeProfile;
  personalizedSolutions?: PersonalizedSolution[];
  superpowers?: SuperpowerInsight[];
  blindspots?: BlindSpotInsight[];
  journalDetectionAccuracy?: {
    correctCount: number;
    totalCases: number;
    scorePercentage: number;
  };
}

// 5 Statements from Bagian 3: Ketergantungan terhadap AI
export const DEPENDENCY_STATEMENTS = [
  {
    id: "dep_1",
    statement: "Saya merasa kesulitan mengerjakan tugas tanpa AI.",
    isReversed: false,
  },
  {
    id: "dep_2",
    statement: "Saya menggunakan AI sebelum mencoba menyelesaikan masalah sendiri.",
    isReversed: false,
  },
  {
    id: "dep_3",
    statement: "Saya merasa pekerjaan menjadi lebih sulit tanpa AI.",
    isReversed: false,
  },
  {
    id: "dep_4",
    statement: "Saya menggunakan AI dalam hampir setiap tugas akademik.",
    isReversed: false,
  },
  {
    id: "dep_5",
    statement: "Saya meminta AI memberikan solusi lengkap untuk tugas saya.",
    isReversed: false,
  },
] as const;

/**
 * Journal Ground Truth (3 Real, 3 Fake) from Bagian 4
 */
export const JOURNAL_GROUND_TRUTH: Record<string, "Real" | "Fake"> = {
  journal_case_1: "Real", // Dirgahayu & Parsa 2019
  journal_case_2: "Real", // Kobayashi & Ide 2022
  journal_case_3: "Real", // Tsuchiya & Sonobe 2025
  journal_case_4: "Fake", // Kusumawardhani & Prasetyo 2023 (Fake)
  journal_case_5: "Fake", // Watanabe, Takahashi, Sato 2024 (Fake)
  journal_case_6: "Fake", // Nugroho, Wijaya, Darmawan 2025 (Fake)
};

/**
 * Normalizes a 1–4 Likert rating into a 0–100 scale.
 * 1 -> 0
 * 2 -> 33.33
 * 3 -> 66.67
 * 4 -> 100
 */
export function normalizeLikertScore(
  rawLikert: number,
  isReversed: boolean
): { effectiveScore: number; normalized: number } {
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
      label: "Ketergantungan Rendah",
      description:
        "Kemandirian nalar Anda sangat kokoh! Anda memposisikan AI seperlunya dan tetap mengutamakan penalaran logika sendiri dalam memecahkan problem akademik.",
    };
  }

  if (score <= 66.67) {
    return {
      band: "SEDANG",
      label: "Ketergantungan Sedang",
      description:
        "Pola penggunaan AI Anda tergolong proporsional. Anda aktif memanfaatkan AI untuk efisiensi, namun alur konseptual dan kendali pemahaman tetap berada di tangan Anda.",
    };
  }

  return {
    band: "TINGGI",
    label: "Ketergantungan Tinggi",
    description:
      "Tingkat ketergantungan Anda terhadap AI cukup signifikan. Berhati-hatilah agar insting dasar problem-solving dan intuisi teknis tidak menurun saat menghadapi ujian luring atau sesi responsi.",
  };
}

/**
 * Evaluates Case Journal detection accuracy.
 */
export function evaluateJournalDetection(answers: Record<string, any>) {
  let correctCount = 0;
  const totalCases = 6;

  for (const [key, correctVal] of Object.entries(JOURNAL_GROUND_TRUTH)) {
    if (answers[key] === correctVal) {
      correctCount++;
    }
  }

  const scorePercentage = Math.round((correctCount / totalCases) * 100);
  return { correctCount, totalCases, scorePercentage };
}

/**
 * Generates descriptive observations based on submitted answers.
 */
function generateObservations(answers: SurveySubmissionPayload): string[] {
  const observations: string[] = [];

  // Problem solving sequence
  const seq = answers.problem_solving_sequence || "";
  if (seq.includes("Langsung tanya AI sebagai langkah pertama")) {
    observations.push(
      "Refleks pertama Anda saat menemui kendala adalah langsung menanyakan ke AI tanpa mencari di sumber lain, yang berpotensi mengurangi latihan analisis stack trace mandiri."
    );
  } else if (seq.includes("Tanya AI dulu untuk gambaran awal, baru cek ulang")) {
    observations.push(
      "Anda menerapkan strategi eksplorasi awal dengan AI yang kemudian diverifikasi silang ke sumber terpercaya."
    );
  } else if (seq.includes("Jarang pakai AI")) {
    observations.push(
      "Anda mempertahankan disiplin problem-solving mandiri dengan mengutamakan dokumentasi resmi dan diskusi sejawat."
    );
  }

  // Critical thinking & hallucination incident
  if (Number(answers.crit_9) >= 3) {
    observations.push(
      "Anda pernah mengumpulkan tugas berbasis AI yang memuat kekeliruan logika tanpa disadari sebelumnya, menandakan perlunya pengetesan eksekusi yang lebih teliti."
    );
  }

  // Responsi readiness
  if (Number(answers.crit_10) >= 3) {
    observations.push(
      "Anda memiliki kesiapan akuntabilitas akademik yang baik karena mampu menguraikan kembali alur logika jawaban buatan AI di hadapan dosen atau asisten praktikum."
    );
  } else {
    observations.push(
      "Tingkat kepercayaan diri Anda dalam menjelaskan alur logika kode/jawaban AI pada sesi responsi masih berpeluang diperkuat."
    );
  }

  // Learning impact
  if (Number(answers.learn_6) >= 3 || Number(answers.learn_8) >= 3) {
    observations.push(
      "Tekanan efisiensi penyelesaian tugas cenderung mendominasi proses belajar Anda dibandingkan pendalaman pemahaman materi konseptual."
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
    "Terapkan Kebiasaan '2-Minute Self Debug': Luangkan 2 menit pertama untuk membaca nomor baris dan pesan error sebelum meminta bantuan AI agar intuisi debugging Anda tetap tajam."
  );

  recommendations.push(
    "Prompt Sokrates (Tutor Berpikir): Alih-alih meminta solusi utuh, gunakan prompt: 'Berikan saya petunjuk konsep atau pertanyaan penuntun tanpa memberikan kode lengkap'."
  );

  if (Number(answers.crit_10) < 3 || Number(answers.crit_7) >= 3) {
    recommendations.push(
      "Simulasi Uji Responsi: Setelah menerima kode dari AI, cobalah jelaskan alur logika program tersebut kepada diri sendiri secara lisan dalam 2-3 kalimat sebelum mengumpulkannya."
    );
  }

  recommendations.push(
    "Verifikasi Halusinasi & Dokumentasi: Selalu uji silang library atau sintaks yang disarankan AI ke dokumentasi resmi bahasa pemrograman untuk memastikan kaidah yang digunakan mutakhir dan valid."
  );

  return recommendations;
}

/**
 * Calculates 3 key card metrics for the personality collector card.
 */
export function calculateCardMetrics(score: number, answers: Record<string, any>): CardMetrics {
  const seq = typeof answers.problem_solving_sequence === "string" ? answers.problem_solving_sequence : "";
  const crit1 = Number(answers.crit_1) || 2;
  const crit2 = Number(answers.crit_2) || 2;
  const crit5 = Number(answers.crit_5) || 2;

  // Autonomy calculation
  let baseAutonomy = 60;
  if (seq.includes("Jarang pakai AI")) baseAutonomy = 95;
  else if (seq.includes("Tanya AI dulu untuk gambaran awal, baru cek ulang")) baseAutonomy = 80;
  else if (seq.includes("Buka AI dan sumber terpercaya bersamaan")) baseAutonomy = 70;
  else if (seq.includes("Langsung tanya AI sebagai langkah pertama")) baseAutonomy = 35;

  const autonomyScore = Math.min(
    98,
    Math.max(25, Math.round((baseAutonomy + (crit1 - 1) * 8 + (crit2 - 1) * 8 + (crit5 - 1) * 6) / 1.25))
  );

  // Critical verification calculation
  const journalEval = evaluateJournalDetection(answers);
  const journalScore = journalEval.scorePercentage; // 0 to 100

  const crit3 = Number(answers.crit_3) || 2;
  const crit7 = Number(answers.crit_7) || 2; // reversed
  const crit8 = Number(answers.crit_8) || 2;
  const crit10 = Number(answers.crit_10) || 2;

  const critNorm = ((crit3 + (5 - crit7) + crit8 + crit10 - 4) / 12) * 100;
  const verificationScore = Math.min(98, Math.max(20, Math.round(journalScore * 0.45 + critNorm * 0.55)));

  return {
    debuggingAutonomy: autonomyScore,
    criticalVerification: verificationScore,
    dependencyScore: score,
    journalDetectionScore: journalEval.correctCount,
  };
}

/**
 * Generates 2 targeted personalized solutions based on submitted answers.
 */
export function getPersonalizedSolutions(
  answers: Record<string, any>,
  score: number
): PersonalizedSolution[] {
  const solutions: PersonalizedSolution[] = [];
  const seq = typeof answers.problem_solving_sequence === "string" ? answers.problem_solving_sequence : "";
  const triggers: string[] = Array.isArray(answers.usage_triggers) ? answers.usage_triggers : [];
  const crit7 = Number(answers.crit_7) || 2;
  const crit9 = Number(answers.crit_9) || 2;
  const crit10 = Number(answers.crit_10) || 2;
  const learnPractice = typeof answers.learn_practice_frequency === "string" ? answers.learn_practice_frequency : "";

  // 1. Terminal Error habit
  if (seq.includes("Langsung tanya AI sebagai langkah pertama")) {
    solutions.push({
      id: "terminal_rule",
      title: "Aturan 2 Menit Error Terminal",
      iconName: "terminal",
      advice:
        "Tahan diri selama 2 menit untuk membaca nomor baris dan tipe exception sendiri sebelum membuka AI. Ini melatih insting debugging kamu agar tidak kagok saat ujian offline.",
    });
  }

  // 2. Deadline rush
  if (triggers.some((t) => t.includes("deadline") || t.includes("tenggat"))) {
    solutions.push({
      id: "deadline_timebox",
      title: "Timeboxing 30/10 Praktikum",
      iconName: "timer",
      advice:
        "Alokasikan 30 menit awal untuk menyusun kerangka logika secara mandiri. Baru gunakan AI di 10 menit terakhir untuk review edge-case, bukan mengambil solusi instan sejak awal.",
    });
  }

  // 3. Responsi readiness / logic gap
  if (crit9 >= 3 || crit10 < 3) {
    solutions.push({
      id: "feynman_check",
      title: "Uji Pemahaman Feynman 1 Paragraf",
      iconName: "shield",
      advice:
        "Sebelum submit tugas praktikum, coba jelaskan alur logika program tersebut ke diri sendiri dalam 2 kalimat santai agar kamu percaya diri saat sesi responsi tatap muka dengan dosen/asprak.",
    });
  }

  // 4. Blind trust / Documentation verification
  if (crit7 >= 3) {
    solutions.push({
      id: "docs_check",
      title: "Uji Silang Dokumentasi Resmi",
      iconName: "file-text",
      advice:
        "Selalu periksa fungsi atau library yang disarankan AI ke dokumentasi resmi bahasa pemrograman untuk memastikan kodenya tidak fiktif atau memakai kaidah lama (deprecated).",
    });
  }

  // 5. Practice frequency
  if (learnPractice === "Jarang" || learnPractice === "Tidak Pernah") {
    solutions.push({
      id: "sandbox_session",
      title: "Sesi 'Offline Sandbox' Mingguan",
      iconName: "code",
      advice:
        "Sisihkan 1 jam per minggu untuk mencoba mengerjakan satu soal algoritma murni di editor teks tanpa bantuan AI sama sekali untuk memelihara ketajaman nalar komputasi Anda.",
    });
  }

  // Fallback: Socratic prompt
  if (solutions.length < 2) {
    solutions.push({
      id: "socratic_prompting",
      title: "Jadikan AI Mentor, Bukan Joki",
      iconName: "compass",
      advice:
        "Ubah cara bertanya ke AI dari 'Buatkan solusi untuk...' menjadi 'Berikan saya petunjuk konsep atau pertanyaan pemantik tanpa memberikan kode lengkap' agar nalar Anda terus terasah.",
    });
  }

  return solutions.slice(0, 2);
}

/**
 * Determines an overarching learning archetype based on dependency score and behavior patterns.
 */
export function determineArchetype(score: number, answers: Record<string, any>): ArchetypeProfile {
  const metrics = calculateCardMetrics(score, answers);
  const triggers: string[] = Array.isArray(answers.usage_triggers) ? answers.usage_triggers : [];
  const seq = typeof answers.problem_solving_sequence === "string" ? answers.problem_solving_sequence : "";
  const crit1 = Number(answers.crit_1) || 2;
  const crit2 = Number(answers.crit_2) || 2;
  const crit7 = Number(answers.crit_7) || 2;
  const crit8 = Number(answers.crit_8) || 2;
  const crit10 = Number(answers.crit_10) || 2;
  const learn6 = Number(answers.learn_6) || 2;
  const learn8 = Number(answers.learn_8) || 2;
  const weekly = typeof answers.weekly_ai_duration === "string" ? answers.weekly_ai_duration : "";
  const journalCorrect = metrics.journalDetectionScore ?? 3;

  // 1. The Skeptical Auditor (High Verification & Good Journal Detection)
  if ((crit8 >= 3 || journalCorrect >= 4) && crit7 <= 2 && score <= 66.67) {
    return {
      id: "skeptical_auditor",
      name: "THE SKEPTICAL AUDITOR",
      subtitle: "Sang Kurator Kritis",
      editionNo: "EDITION #01/06",
      insigniaType: "prism",
      tagline: "Kritis, teliti, dan tidak mudah terbuai oleh keluaran AI.",
      description:
        "Anda selalu bersikap waspada terhadap output AI. Anda menyadari potensi halusinasi dan fabrikasi data AI, sehingga selalu melakukan uji silang dan pengujian mandiri sebelum menerapkan solusi dalam tugas.",
      characteristics: [
        "Cermat memeriksa keabsahan sitasi dan dokumentasi",
        "Peka terhadap anomali logika atau kode fiktif",
        "Mengutamakan verifikasi fakta di atas kepraktisan instan",
      ],
      metrics,
      badgeTheme: {
        bg: "bg-[#EBF2EE]",
        text: "text-[#174C3C]",
        border: "border-[#174C3C]/30",
        accent: "bg-[#174C3C]",
      },
    };
  }

  // 2. The Socratic Co-Pilot (High Autonomy & Conceptual Partner)
  if (
    crit10 >= 3 &&
    (seq.includes("Tanya AI dulu untuk gambaran awal") || seq.includes("Buka AI dan sumber terpercaya bersamaan")) &&
    score <= 66.67
  ) {
    return {
      id: "socratic_copilot",
      name: "THE SOCRATIC CO-PILOT",
      subtitle: "Sang Mitra Dialektika",
      editionNo: "EDITION #02/06",
      insigniaType: "dialectic",
      tagline: "Menjadikan AI rekan diskusi konseptual, bukan pengganti proses berpikir.",
      description:
        "Pola belajar Anda sangat sehat dan konstruktif! Anda menggunakan AI layaknya teman bertukar pikiran untuk memperdalam konsep, namun kendali logika dan pemahaman tetap Anda kuasai secara mandiri.",
      characteristics: [
        "Fokus memahami alur, bukan sekadar menyalin jawaban",
        "Mampu menjelaskan kembali logika program saat responsi",
        "Menggunakan prompt penuntun untuk memperdalam wawasan",
      ],
      metrics,
      badgeTheme: {
        bg: "bg-[#EFF8FF]",
        text: "text-[#175CD3]",
        border: "border-[#175CD3]/30",
        accent: "bg-[#175CD3]",
      },
    };
  }

  // 3. The Deadline Sprinter (Triggered by Deadlines)
  if (
    triggers.some((t) => t.includes("deadline") || t.includes("tenggat")) &&
    (learn6 >= 3 || learn8 >= 3 || score > 45)
  ) {
    return {
      id: "deadline_sprinter",
      name: "THE DEADLINE SPRINTER",
      subtitle: "Sang Pelari Tenggat Waktu",
      editionNo: "EDITION #03/06",
      insigniaType: "pulse",
      tagline: "Mandiri saat luang, namun berkompromi saat tenggat waktu mengepung.",
      description:
        "Sebenarnya Anda memiliki daya nalar mandiri yang baik. Namun saat tugas menumpuk dan tenggat waktu praktikum kian dekat, godaan untuk mengandalkan jalan pintas AI menjadi sulit dihindari.",
      characteristics: [
        "Mampu bernalar mandiri saat beban tugas moderat",
        "Rentan mengorbankan pemahaman demi kecepatan selesai tugas",
        "Sangat terbantu jika memulai pengerjaan tugas lebih awal",
      ],
      metrics,
      badgeTheme: {
        bg: "bg-[#FAF5EB]",
        text: "text-[#B88728]",
        border: "border-[#D5A85B]/40",
        accent: "bg-[#D5A85B]",
      },
    };
  }

  // 4. The Autopilot Builder (High Dependency)
  if (
    score > 66.67 ||
    (seq.includes("Langsung tanya AI sebagai langkah pertama") && Number(answers.dep_5) >= 3)
  ) {
    return {
      id: "autopilot_builder",
      name: "THE AUTOPILOT BUILDER",
      subtitle: "Sang Arsitek Otomatis",
      editionNo: "EDITION #04/06",
      insigniaType: "automaton",
      tagline: "Penyelesaian tugas secepat kilat, namun fondasi dasar perlu dijaga.",
      description:
        "Tugas kuliah Anda terselesaikan dengan sangat cepat berkat bantuan otomatisasi AI. Namun waspadalah, ketergantungan yang tinggi berisiko menumpulkan intuisi algoritma saat menghadapi ujian tanpa internet.",
      characteristics: [
        "Kerap meminta solusi lengkap tanpa menyusun kerangka mandiri",
        "Refleks pertama saat menjumpai kendala adalah bertanya ke AI",
        "Perlu mulai menyisihkan waktu untuk coding mandiri tanpa AI",
      ],
      metrics,
      badgeTheme: {
        bg: "bg-[#FEE4E2]",
        text: "text-[#B42318]",
        border: "border-[#B42318]/30",
        accent: "bg-[#B42318]",
      },
    };
  }

  // 5. The Digital Artisan (Low AI Use, High Pure Craftsmanship)
  if (score <= 33.33 || weekly.includes("Jarang") || (crit1 >= 3 && crit2 >= 3)) {
    return {
      id: "digital_artisan",
      name: "THE DIGITAL ARTISAN",
      subtitle: "Sang Pengrajin Logika",
      editionNo: "EDITION #05/06",
      insigniaType: "terminal",
      tagline: "Setia pada kemurnian nalar mandiri dan eksplorasi dokumentasi resmi.",
      description:
        "Anda lebih menikmati proses memecahkan masalah dari nol, mencoret-coret logika, dan menelaah dokumentasi resmi secara langsung. Kemandirian dan ketangguhan nalar Anda patut diapresiasi!",
      characteristics: [
        "Daya analisis problem-solving sangat terlatih",
        "Percaya diri menghadapi ujian luring tanpa alat bantu",
        "Dapat mulai menjajaki AI untuk otomatisasi tugas repetitif",
      ],
      metrics,
      badgeTheme: {
        bg: "bg-[#F4F3FF]",
        text: "text-[#5925DC]",
        border: "border-[#5925DC]/30",
        accent: "bg-[#5925DC]",
      },
    };
  }

  // 6. Fallback: The Pragmatic Optimizer
  return {
    id: "pragmatic_optimizer",
    name: "THE PRAGMATIC OPTIMIZER",
    subtitle: "Sang Praktisi Seimbang",
    editionNo: "EDITION #06/06",
    insigniaType: "compass",
    tagline: "Memanfaatkan AI secara proporsional demi efisiensi tanpa kehilangan esensi.",
    description:
      "Anda memanfaatkan teknologi AI secara terukur: mempercepat tugas mekanis saat menemui jalan buntu, namun tetap menjaga alur pemikiran dan tanggung jawab atas pekerjaan yang dihasilkan.",
    characteristics: [
      "Keseimbangan yang baik antara efisiensi dan pemahaman",
      "Menggunakan AI sebagai akselerator kerja",
      "Menjaga integritas dan akuntabilitas hasil kerja sendiri",
    ],
    metrics,
    badgeTheme: {
      bg: "bg-[#F0FDF9]",
      text: "text-[#115E59]",
      border: "border-[#115E59]/30",
      accent: "bg-[#115E59]",
    },
  };
}

/**
 * Calculates the complete dependency score and comprehensive results.
 */
export function calculateDependencyScore(answers: SurveySubmissionPayload): ScoringResult {
  const itemDetails: ItemScoreDetail[] = [];
  let totalEffectiveScore = 0;

  for (const item of DEPENDENCY_STATEMENTS) {
    const rawVal = Number(answers[item.id as keyof SurveySubmissionPayload]);
    if (isNaN(rawVal) || rawVal < 1 || rawVal > 4) {
      throw new Error(`Data kuesioner tidak lengkap: nilai '${item.id}' tidak valid atau belum diisi.`);
    }

    const { effectiveScore, normalized } = normalizeLikertScore(rawVal, item.isReversed);
    totalEffectiveScore += effectiveScore;

    itemDetails.push({
      id: item.id,
      statement: item.statement,
      rawLikert: rawVal,
      isReversed: item.isReversed,
      effectiveScore,
      normalizedScore: Math.round(normalized * 100) / 100,
    });
  }

  // 5 items, effective score range: 5 to 20
  // Normalized score (0 to 100): ((total - 5) / (20 - 5)) * 100
  const normalizedPrimaryScore = ((totalEffectiveScore - 5) / 15) * 100;
  const roundedScore = Math.round(normalizedPrimaryScore * 100) / 100;

  const { band, label: bandLabel, description: bandDescription } = getScoreCategory(roundedScore);
  const observations = generateObservations(answers);
  const recommendations = generateRecommendations(roundedScore, answers);

  const archetype = determineArchetype(roundedScore, answers);
  const personalizedSolutions = getPersonalizedSolutions(answers, roundedScore);
  const journalDetectionAccuracy = evaluateJournalDetection(answers);

  return {
    scoringVersion: SCORING_VERSION,
    score: roundedScore,
    band,
    bandLabel,
    bandDescription,
    itemDetails,
    observations,
    recommendations,
    calculatedAt: new Date().toISOString(),
    archetype,
    personalizedSolutions,
    journalDetectionAccuracy,
  };
}
