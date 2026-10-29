import { SCORING_VERSION, SurveySubmissionPayload } from "./survey-schema";

export type DependencyBand = "RENDAH" | "SEDANG" | "TINGGI";

export interface CardMetrics {
  debuggingAutonomy: number;
  criticalVerification: number;
  dependencyScore: number;
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
      label: "Ketergantungan Rendah",
      description:
        "Kemandirian kamu jempolan! Kamu pakai AI seperlunya aja dan tetap mengutamakan logika sendiri buat mecahin problem koding.",
    };
  }

  if (score <= 66.67) {
    return {
      band: "SEDANG",
      label: "Ketergantungan Sedang",
      description:
        "Penggunaan AI kamu cukup seimbang. Kamu aktif memanfaatkan AI buat bantu tugas, tapi jalan ceritanya tetap kamu yang pegang dan pahami.",
    };
  }

  return {
    band: "TINGGI",
    label: "Ketergantungan Tinggi",
    description:
      "Kamu kelihatan sangat bergantung sama AI buat tugas kuliah. Hati-hati, nalar koding dasar kamu bisa kagok pas ujian luring tanpa internet atau sesi responsi.",
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
 * Calculates 3 key card metrics for the personality collector card.
 */
export function calculateCardMetrics(score: number, answers: Record<string, any>): CardMetrics {
  const firstAction = typeof answers.coding_first_action === "string" ? answers.coding_first_action : "";
  const dep7 = Number(answers.dep_7) || 2;
  const dep8 = Number(answers.dep_8) || 2;

  // Debugging autonomy calculation
  let debugScore = 60;
  if (firstAction.includes("Membaca pesan error")) debugScore = 90;
  else if (firstAction.includes("Mencari di mesin pencari")) debugScore = 80;
  else if (firstAction.includes("Bertanya kepada teman")) debugScore = 70;
  else if (firstAction.includes("Langsung copy-paste")) debugScore = 35;

  debugScore = Math.min(98, Math.max(25, Math.round((debugScore + (dep7 - 1) * 10 + (dep8 - 1) * 5) / 1.15)));

  // Critical verification calculation
  const crit4 = Number(answers.crit_4) || 2;
  const crit5 = Number(answers.crit_5) || 2;
  const crit6 = Number(answers.crit_6) || 2;
  const testCode = typeof answers.test_ai_code_before_use === "string" ? answers.test_ai_code_before_use : "";

  let testScore = 60;
  if (testCode.includes("Selalu diuji")) testScore = 90;
  else if (testCode.includes("Diuji sekilas")) testScore = 65;
  else if (testCode.includes("Hanya dipastikan tidak syntax")) testScore = 45;
  else if (testCode.includes("Kadang langsung dikirim")) testScore = 30;

  const critNorm = ((crit4 + crit5 + crit6 - 3) / 9) * 100;
  const verificationScore = Math.min(98, Math.max(20, Math.round(testScore * 0.4 + critNorm * 0.6)));

  return {
    debuggingAutonomy: debugScore,
    criticalVerification: verificationScore,
    dependencyScore: score,
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
  const firstAction = typeof answers.coding_first_action === "string" ? answers.coding_first_action : "";
  const triggers: string[] = Array.isArray(answers.usage_triggers) ? answers.usage_triggers : [];
  const ununderstood = typeof answers.use_ununderstood_code === "string" ? answers.use_ununderstood_code : "";
  const abilityExplain = typeof answers.ability_explain_ai_code === "string" ? answers.ability_explain_ai_code : "";
  const genFreq = typeof answers.code_generation_frequency === "string" ? answers.code_generation_frequency : "";
  const hallu = typeof answers.learn_encountered_hallucination === "string" ? answers.learn_encountered_hallucination : "";

  // 1. Terminal Error habit
  if (firstAction.includes("Langsung copy-paste")) {
    solutions.push({
      id: "terminal_rule",
      title: "Aturan 2 Menit Error Terminal",
      iconName: "terminal",
      advice:
        "Tahan diri selama 2 menit untuk membaca nomor baris dan tipe exception sendiri sebelum membuka AI. Ini melatih insting debugging kamu agar tidak kagok saat ujian offline.",
    });
  }

  // 2. Deadline rush
  if (triggers.some((t) => t.includes("Tenggat waktu") || t.includes("deadline"))) {
    solutions.push({
      id: "deadline_timebox",
      title: "Timeboxing 30/10 Praktikum",
      iconName: "timer",
      advice:
        "Alokasikan 30 menit awal untuk menyusun kerangka logika secara mandiri. Baru gunakan AI di 10 menit terakhir untuk review edge-case, bukan mengambil solusi instan sejak awal.",
    });
  }

  // 3. Responsi risk (code not fully understood)
  if (
    ununderstood.includes("Sering") ||
    ununderstood.includes("beberapa kali") ||
    abilityExplain.includes("Kurang") ||
    abilityExplain.includes("Tidak")
  ) {
    solutions.push({
      id: "feynman_check",
      title: "Uji Feynman 1 Paragraf",
      iconName: "shield",
      advice:
        "Sebelum submit tugas praktikum, coba jelaskan alur logika kode tersebut ke diri sendiri dalam 2 kalimat santai agar kamu siap dan percaya diri saat sesi responsi tatap muka.",
    });
  }

  // 4. Hallucination check
  if ((hallu.includes("Hampir tidak pernah") || hallu.includes("Jarang")) && score > 35) {
    solutions.push({
      id: "docs_check",
      title: "Uji Silang Dokumentasi Resmi",
      iconName: "file-text",
      advice:
        "Selalu periksa fungsi atau library yang disarankan AI ke dokumentasi resmi bahasa pemrograman untuk memastikan kodenya tidak fiktif atau memakai kaidah lama (deprecated).",
    });
  }

  // 5. Heavy code generation
  if (genFreq.includes("Sangat sering") || score > 60) {
    solutions.push({
      id: "sandbox_session",
      title: "Sesi 'Offline Sandbox' Mingguan",
      iconName: "code",
      advice:
        "Sisihkan 1 jam per minggu untuk mengerjakan satu soal algoritma murni dengan editor teks dan compiler terminal tanpa bantuan AI sama sekali untuk menjaga kemandirian berpikir.",
    });
  }

  // 6. Socratic prompt fallback
  if (solutions.length < 2) {
    solutions.push({
      id: "socratic_prompting",
      title: "Jadikan AI Mentor, Bukan Joki",
      iconName: "compass",
      advice:
        "Ubah cara bertanya ke AI dari 'Buatkan kode untuk...' menjadi 'Berikan saya petunjuk konsep atau pertanyaan pemantik tanpa memberikan kode lengkap' agar pemahamanmu terus berkembang.",
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
  const firstAction = typeof answers.coding_first_action === "string" ? answers.coding_first_action : "";
  const ununderstood = typeof answers.use_ununderstood_code === "string" ? answers.use_ununderstood_code : "";
  const codeExplain = typeof answers.code_explanation_frequency === "string" ? answers.code_explanation_frequency : "";
  const abilityExplain = typeof answers.ability_explain_ai_code === "string" ? answers.ability_explain_ai_code : "";
  const testCode = typeof answers.test_ai_code_before_use === "string" ? answers.test_ai_code_before_use : "";
  const genFreq = typeof answers.code_generation_frequency === "string" ? answers.code_generation_frequency : "";
  const crit4 = Number(answers.crit_4) || 2;
  const crit5 = Number(answers.crit_5) || 2;
  const crit6 = Number(answers.crit_6) || 2;
  const learnComp = Number(answers.learn_prioritize_completion) || 2;
  const hallu = typeof answers.learn_encountered_hallucination === "string" ? answers.learn_encountered_hallucination : "";

  // 1. The Skeptical Auditor
  if (
    (crit4 >= 3 || crit5 >= 3 || crit6 >= 3) &&
    (testCode.includes("Selalu diuji") || hallu.includes("Sangat sering") || hallu.includes("Cukup sering")) &&
    score <= 66.67
  ) {
    return {
      id: "skeptical_auditor",
      name: "THE SKEPTICAL AUDITOR",
      subtitle: "Sang Kurator Kritis",
      editionNo: "EDITION #01/06",
      insigniaType: "prism",
      tagline: "Kritis, teliti, dan nggak gampang percaya sama kode buatan AI.",
      description:
        "Kamu selalu berhati-hati sama output AI. Kamu sadar AI sering ngaco atau halusinasi, jadi kamu selalu tes kode dan kroscek dokumentasi resmi sebelum dipakai ke tugas praktikum.",
      characteristics: [
        "Rajin kroscek ke dokumentasi resmi",
        "Peka kalau ada kode aneh atau halusinasi",
        "Selalu tes edge-case sebelum yakin kode aman",
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

  // 2. The Socratic Co-Pilot
  if (
    (codeExplain.includes("Sangat sering") || codeExplain.includes("Sering")) &&
    (abilityExplain.includes("Sangat mampu") || abilityExplain.includes("Cukup mampu")) &&
    (firstAction.includes("Membaca pesan error") || firstAction.includes("Mencari di mesin pencari")) &&
    score <= 66.67
  ) {
    return {
      id: "socratic_copilot",
      name: "THE SOCRATIC CO-PILOT",
      subtitle: "Sang Mitra Dialektika",
      editionNo: "EDITION #02/06",
      insigniaType: "dialectic",
      tagline: "Pakai AI buat diskusi dan paham konsep, bukan buat joki tugas.",
      description:
        "Pola belajar kamu keren dan sehat! Kamu pakai AI kayak teman diskusi buat nanya 'kenapa' dan cari cara lain buat mecahin masalah. Logika kodingnya tetap kamu sendiri yang pegang.",
      characteristics: [
        "Fokus ke pemahaman alur, bukan asal kode jalan",
        "Coba cari error sendiri dulu sebelum nanya AI",
        "Pede dan siap pas ditanya alur kode waktu responsi",
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

  // 3. The Deadline Sprinter
  if (
    triggers.some((t) => t.includes("Tenggat waktu") || t.includes("deadline")) &&
    (ununderstood.includes("Sering") || ununderstood.includes("beberapa kali") || learnComp >= 3 || score > 45)
  ) {
    return {
      id: "deadline_sprinter",
      name: "THE DEADLINE SPRINTER",
      subtitle: "Sang Pelari Tenggat Waktu",
      editionNo: "EDITION #03/06",
      insigniaType: "pulse",
      tagline: "Bisa mandiri di waktu santai, tapi suka terpaksa kompromi pas deadline mepet.",
      description:
        "Sebenarnya kamu punya kemampuan mikir mandiri yang bagus. Tapi kalau tugas praktikum lagi numpuk dan deadline tinggal hitungan jam, godaan buat langsung copy-paste jawaban AI jadi susah ditolak.",
      characteristics: [
        "Mampu bernalar mandiri kalau beban tugas wajar",
        "Kadang terpaksa ambil jalan pintas pas kepepet waktu",
        "Bakal makin jago kalau waktu pengerjaan diatur lebih awal",
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

  // 4. The Autopilot Builder
  if (
    score > 66.67 ||
    (genFreq.includes("Sangat sering") && firstAction.includes("Langsung copy-paste"))
  ) {
    return {
      id: "autopilot_builder",
      name: "THE AUTOPILOT BUILDER",
      subtitle: "Sang Arsitek Otomatis",
      editionNo: "EDITION #04/06",
      insigniaType: "automaton",
      tagline: "Tugas kelar super cepat, tapi hati-hati insting koding dasar bisa tumpul.",
      description:
        "Tugas kamu selesai kilat karena porsi ngetik kodenya banyak dibantu AI. Tapi hati-hati, kalau keseringan bergantung, kamu bisa kagok pas harus nulis kode dari nol di ujian luring tanpa internet.",
      characteristics: [
        "Sering minta kode lengkap dari awal sampai akhir",
        "Refleks pertama pas error langsung lempar ke AI",
        "Perlu mulai luangkan waktu buat koding manual tanpa AI",
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

  // 5. The Digital Artisan
  if (score <= 33.33 || genFreq.includes("Tidak pernah") || genFreq.includes("Jarang")) {
    return {
      id: "digital_artisan",
      name: "THE DIGITAL ARTISAN",
      subtitle: "Sang Pengrajin Logika",
      editionNo: "EDITION #05/06",
      insigniaType: "terminal",
      tagline: "Setia sama kemurnian logika sendiri dan dokumentasi resmi.",
      description:
        "Kamu lebih suka mikir sendiri dari nol, coret-coret logika di kertas, dan baca manual resmi daripada disuapin sama generator kode. Kemandirian dan fokus kamu patut diacungi jempol!",
      characteristics: [
        "Fokus dan logika problem-solving sangat terlatih",
        "Tenang dan siap menghadapi ujian tanpa internet",
        "Bisa mulai coba AI buat otomatisasi hal repetitif",
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

  // Fallback: The Pragmatic Optimizer
  return {
    id: "pragmatic_optimizer",
    name: "THE PRAGMATIC OPTIMIZER",
    subtitle: "Sang Praktisi Seimbang",
    editionNo: "EDITION #06/06",
    insigniaType: "compass",
    tagline: "Pakai AI secukupnya biar efisien, tapi pemahaman tetap dijaga.",
    description:
      "Kamu pakai AI secara proporsional: buat ngetik hal repetitif atau cari petunjuk pas lagi mentok, tapi jalan ceritanya tetap kamu yang pegang dan pahami.",
    characteristics: [
      "Tahu kapan harus nanya AI dan kapan mikir sendiri",
      "Efisien ngerjain tugas tanpa kehilangan pemahaman",
      "Tinggal perkuat kebiasaan cek docs resmi",
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
 * Extracts specific strengths (superpowers) and vulnerable spots (blind spots).
 */
export function evaluateStrengthsAndBlindSpots(
  answers: Record<string, any>,
  score: number
): { superpowers: SuperpowerInsight[]; blindspots: BlindSpotInsight[] } {
  const superpowers: SuperpowerInsight[] = [];
  const blindspots: BlindSpotInsight[] = [];

  const firstAction = typeof answers.coding_first_action === "string" ? answers.coding_first_action : "";
  const abilityExplain = typeof answers.ability_explain_ai_code === "string" ? answers.ability_explain_ai_code : "";
  const testCode = typeof answers.test_ai_code_before_use === "string" ? answers.test_ai_code_before_use : "";
  const ununderstood = typeof answers.use_ununderstood_code === "string" ? answers.use_ununderstood_code : "";
  const learnComp = Number(answers.learn_prioritize_completion) || 2;
  const learnUnder = Number(answers.learn_attempt_understand) || 3;
  const hallu = typeof answers.learn_encountered_hallucination === "string" ? answers.learn_encountered_hallucination : "";
  const crit1 = Number(answers.crit_1) || 2;
  const crit2 = Number(answers.crit_2) || 2;
  const crit3 = Number(answers.crit_3) || 2;
  const crit4 = Number(answers.crit_4) || 2;
  const crit6 = Number(answers.crit_6) || 2;
  const dep1 = Number(answers.dep_1) || 2;
  const dep2 = Number(answers.dep_2) || 2;
  const dep7 = Number(answers.dep_7) || 2;
  const dep8 = Number(answers.dep_8) || 2;

  // --- SUPERPOWERS EVALUATION ---
  // 1. Stack Trace Diagnosis
  if (firstAction.includes("Membaca pesan error") || firstAction.includes("Mencari di mesin pencari")) {
    superpowers.push({
      id: "stack_trace_discipline",
      title: "Jago Baca Error Sendiri",
      tag: "Debugging Mandiri",
      description:
        "Pas kodingan error, kamu baca log dan pesan error-nya dulu sebelum buru-buru nanya AI. Kebiasaan ini bikin insting debugging kamu tetap terasah!",
    });
  }

  // 2. Full Code Ownership
  if (abilityExplain.includes("Sangat mampu") || crit6 >= 3) {
    superpowers.push({
      id: "code_ownership",
      title: "Paham Alur Kode 100%",
      tag: "Penguasaan Materi",
      description:
        "Kamu selalu mastiin ngerti jalan cerita kode yang kamu kumpulin. Jadi kalau pas responsi praktikum ditanya dosen atau aslab, kamu siap jawab dengan lancar.",
    });
  }

  // 3. Rigorous Edge-Case Testing
  if (testCode.includes("Selalu diuji")) {
    superpowers.push({
      id: "rigorous_testing",
      title: "Nggak Asal Percaya (Rajin Ngetes)",
      tag: "Testing Disiplin",
      description:
        "Kamu nggak langsung puas pas kode kelihatan jalan sekali. Kamu tes lagi pakai berbagai kemungkinan input buat mastiin hasilnya beneran valid.",
    });
  }

  // 4. Critical Skepticism & Fact-Checking
  if (crit4 >= 3 || crit3 >= 3 || hallu.includes("Sangat sering") || hallu.includes("Cukup sering")) {
    superpowers.push({
      id: "epistemic_vigilance",
      title: "Peka sama Halusinasi AI",
      tag: "Filter Kritis",
      description:
        "Mata kamu jeli ngeliat kalau AI mulai ngasih jawaban ngaco atau fungsi fiktif, dan kamu rajin kroscek ke dokumentasi asli.",
    });
  }

  // 5. Mental Resilience & First Principles
  if (crit1 >= 3 || crit2 >= 3 || dep7 >= 3 || dep8 >= 3) {
    superpowers.push({
      id: "mental_resilience",
      title: "Percaya Diri Mikir Mandiri",
      tag: "Nalar Mandiri",
      description:
        "Kamu punya keyakinan tinggi sama kemampuan logika kamu sendiri tanpa harus bergantung terus-menerus ke AI.",
    });
  }

  // Fallback superpower if needed
  if (superpowers.length < 2) {
    if (learnUnder >= 3) {
      superpowers.push({
        id: "learning_drive",
        title: "Niat Paham Konsep",
        tag: "Fokus Belajar",
        description:
          "Kamu mengutamakan pemahaman materi kuliah, bukan sekadar 'yang penting tugas kumpul'.",
      });
    } else {
      superpowers.push({
        id: "tech_adaptability",
        title: "Cepat Adaptasi Tools",
        tag: "Adaptif",
        description:
          "Kamu pintar memanfaatkan tools modern buat mendukung alur kerja kuliah kamu.",
      });
    }
  }

  // --- BLIND SPOTS EVALUATION ---
  // 1. Responsi & Live-Coding Vulnerability
  if (
    ununderstood.includes("Sering") ||
    ununderstood.includes("beberapa kali") ||
    abilityExplain.includes("Kurang") ||
    abilityExplain.includes("Tidak")
  ) {
    blindspots.push({
      id: "ununderstood_code_risk",
      title: "Risiko Pas Responsi / Ujian Offline",
      tag: "Waspada Responsi",
      riskDescription:
        "Pernah ngumpulin kode AI tanpa paham alurnya bisa jadi boomerang kalau tiba-tiba ditanya aslab atau pas ujian koding tatap muka.",
      microAction:
        "Coba jelaskan alur fungsi itu ke diri sendiri dengan bahasa santai selama 2 menit sebelum tugas dikumpul.",
    });
  }

  // 2. Debugger Atrophy from Instant Copy-Paste
  if (firstAction.includes("Langsung copy-paste")) {
    blindspots.push({
      id: "debugger_atrophy",
      title: "Refleks Langsung Lempar Error",
      tag: "Insting Debugging",
      riskDescription:
        "Kebiasaan langsung copy-paste error ke AI bisa bikin mata kamu kurang terbiasa baca nomor baris dan tipe exception di terminal.",
      microAction:
        "Tahan diri 2 menit: baca baris error-nya dan tebak penyebabnya sendiri dulu sebelum buka AI.",
    });
  }

  // 3. Completion Trap (Speed over Depth)
  if (learnComp >= 3) {
    blindspots.push({
      id: "completion_bias",
      title: "Jebakan 'Yang Penting Beres'",
      tag: "Ilusi Produktif",
      riskDescription:
        "Fokus ke tugas cepat kelar kadang bikin kita ngerasa udah paham materinya, padahal baru AI-nya yang paham.",
      microAction:
        "Setelah tugas selesai, tulis 1-2 baris catatan kecil tentang konsep baru apa yang baru aja kamu pelajari.",
    });
  }

  // 4. Over-Trust & Hallucination Blindness
  if ((hallu.includes("Hampir tidak pernah") || hallu.includes("Jarang")) && score > 35) {
    blindspots.push({
      id: "overtrust_risk",
      title: "Terlalu Percaya Output AI",
      tag: "Cek Validasi",
      riskDescription:
        "Jarang nemu kesalahan AI bisa jadi tanda kamu kurang teliti ngecek efisiensi atau kebenaran logika di balik kodenya.",
      microAction:
        "Kroscek library atau fungsi bawaan yang disarankan AI ke dokumentasi resmi bahasanya.",
    });
  }

  // 5. Blank-Mind Anxiety (Panic without AI)
  if (dep1 >= 3 || dep2 >= 3) {
    blindspots.push({
      id: "blank_mind_anxiety",
      title: "Gugup Kalau Nggak Ada AI",
      tag: "Kemandirian Mental",
      riskDescription:
        "Kebiasaan selalu buka AI dari awal bisa bikin panik atau 'blank' pas ngeliat editor kosong di ujian tanpa internet.",
      microAction:
        "Coret-coret alur logika atau pseudocode di kertas selama 5 menit dulu sebelum mulai ngoding.",
    });
  }

  // Fallback blindspot if needed
  if (blindspots.length < 2) {
    blindspots.push({
      id: "dependency_drift",
      title: "Ketergantungan yang Merayap",
      tag: "Pengingat Diri",
      riskDescription:
        "Kemudahan instan dari AI bisa perlahan-lahan bikin kita malas baca dokumentasi panjang.",
      microAction:
        "Luangkan satu sesi dalam seminggu buat ngoding murni tanpa buka tools AI sama sekali.",
    });
  }

  return {
    superpowers: superpowers.slice(0, 2),
    blindspots: blindspots.slice(0, 2),
  };
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
  const archetype = determineArchetype(score, answers);
  const personalizedSolutions = getPersonalizedSolutions(answers, score);
  const { superpowers, blindspots } = evaluateStrengthsAndBlindSpots(answers, score);

  return {
    scoringVersion: SCORING_VERSION,
    score,
    band,
    bandLabel: label,
    bandDescription: description,
    itemDetails,
    observations,
    recommendations,
    archetype,
    personalizedSolutions,
    superpowers,
    blindspots,
    calculatedAt: new Date().toISOString(),
  };
}
