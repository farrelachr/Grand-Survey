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

export interface UsageProfile {
  primaryTool: string;
  weeklyDuration: string;
  problemSolvingSequence: string;
  academicActivities: string[];
  usageTriggers: string[];
  practiceFrequency: string;
}

export interface AcademicStrength {
  id: string;
  category: "Verifikasi" | "Kemandirian" | "Kritis" | "Kolaborasi";
  title: string;
  evidence: string;
}

export interface AcademicRisk {
  id: string;
  severity: "Tinggi" | "Sedang" | "Perhatian";
  title: string;
  evidence: string;
  implication: string;
}

export interface EvaluationMetrics {
  debuggingAutonomy: number; // 0 - 100
  criticalVerification: number; // 0 - 100
  journalAccuracy: {
    correct: number;
    total: number;
    percentage: number;
  };
}

export interface ActionableRecommendation {
  id: string;
  title: string;
  action: string;
  expectedOutcome: string;
}

export interface ScoringResult {
  scoringVersion: string;
  score: number; // 0.00 to 100.00
  band: DependencyBand;
  bandLabel: string;
  bandDescription: string;
  narrativeConclusion?: string;
  itemDetails: ItemScoreDetail[];
  usageProfile: UsageProfile;
  metrics: EvaluationMetrics;
  strengths: AcademicStrength[];
  risks: AcademicRisk[];
  actionableRecommendations: ActionableRecommendation[];
  observations: string[];
  recommendations: string[];
  calculatedAt: string;
  journalDetectionAccuracy: {
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
    label: "Tingkat Kesulitan Tugas Tanpa AI",
  },
  {
    id: "dep_2",
    statement: "Saya menggunakan AI sebelum mencoba menyelesaikan masalah sendiri.",
    isReversed: false,
    label: "Penggunaan AI Sebelum Mencoba Mandiri",
  },
  {
    id: "dep_3",
    statement: "Saya merasa pekerjaan menjadi lebih sulit tanpa AI.",
    isReversed: false,
    label: "Persepsi Beban Kerja Tanpa Bantuan AI",
  },
  {
    id: "dep_4",
    statement: "Saya menggunakan AI dalam hampir setiap tugas akademik.",
    isReversed: false,
    label: "Frekuensi Penggunaan di Setiap Tugas Akademik",
  },
  {
    id: "dep_5",
    statement: "Saya meminta AI memberikan solusi lengkap untuk tugas saya.",
    isReversed: false,
    label: "Kecenderungan Meminta Solusi Kode Utuh",
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
 * 0.00 – 33.33: Rendah (Mandiri)
 * >33.33 – 66.67: Sedang (Proporsional)
 * >66.67 – 100.00: Tinggi (Ketergantungan Signifikan)
 */
export function getScoreCategory(score: number): { band: DependencyBand; label: string; description: string } {
  if (score < 0 || score > 100) {
    throw new Error(`Score out of range: ${score}`);
  }

  if (score <= 33.33) {
    return {
      band: "RENDAH",
      label: "Ketergantungan Rendah (Mandiri)",
      description:
        "Tingkat kemandirian akademik Anda sangat kuat. Anda memposisikan AI secara proporsional sebagai akselerator sekunder dan tetap mengutamakan penalaran logika sendiri dalam memecahkan masalah pemrograman.",
    };
  }

  if (score <= 66.67) {
    return {
      band: "SEDANG",
      label: "Ketergantungan Sedang (Proporsional)",
      description:
        "Pola penggunaan AI Anda tergolong seimbang dan pragmatis. Anda memanfaatkan AI untuk mempercepat pekerjaan mekanis, namun tetap mempertahankan kendali atas alur konseptual dan pemahaman program.",
    };
  }

  return {
    band: "TINGGI",
    label: "Ketergantungan Tinggi (Signifikan)",
    description:
      "Tingkat ketergantungan Anda terhadap AI berada pada level tinggi. AI kerap menggantikan tahapan penalaran awal atau diagnosa mandiri, yang berisiko menumpulkan intuisi algoritma saat ujian luring atau sesi responsi tatap muka.",
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
 * Calculates academic evaluation metrics (Autonomy, Verification, Journal Accuracy).
 */
export function calculateEvaluationMetrics(score: number, answers: Record<string, any>): EvaluationMetrics {
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
    Math.max(20, Math.round((baseAutonomy + (crit1 - 1) * 8 + (crit2 - 1) * 8 + (crit5 - 1) * 6) / 1.25))
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
    journalAccuracy: {
      correct: journalEval.correctCount,
      total: journalEval.totalCases,
      percentage: journalScore,
    },
  };
}

/**
 * Extracts structured usage profile from questionnaire answers.
 */
export function extractUsageProfile(answers: Record<string, any>): UsageProfile {
  return {
    primaryTool: typeof answers.primary_ai_tool === "string" ? answers.primary_ai_tool : "Tidak disebutkan",
    weeklyDuration: typeof answers.weekly_ai_duration === "string" ? answers.weekly_ai_duration : "Tidak disebutkan",
    problemSolvingSequence:
      typeof answers.problem_solving_sequence === "string" ? answers.problem_solving_sequence : "Tidak disebutkan",
    academicActivities: Array.isArray(answers.academic_activities) ? answers.academic_activities : [],
    usageTriggers: Array.isArray(answers.usage_triggers) ? answers.usage_triggers : [],
    practiceFrequency:
      typeof answers.learn_practice_frequency === "string" ? answers.learn_practice_frequency : "Tidak disebutkan",
  };
}

/**
 * Evaluates academic strengths based on empirical facts from submitted answers.
 */
export function evaluateStrengths(
  answers: Record<string, any>,
  metrics: EvaluationMetrics,
  score: number
): AcademicStrength[] {
  const strengths: AcademicStrength[] = [];
  const seq = typeof answers.problem_solving_sequence === "string" ? answers.problem_solving_sequence : "";
  const practice = typeof answers.learn_practice_frequency === "string" ? answers.learn_practice_frequency : "";
  const crit1 = Number(answers.crit_1) || 2;
  const crit2 = Number(answers.crit_2) || 2;
  const crit3 = Number(answers.crit_3) || 2;
  const crit5 = Number(answers.crit_5) || 2;
  const crit6 = Number(answers.crit_6) || 2;
  const crit7 = Number(answers.crit_7) || 2;
  const crit8 = Number(answers.crit_8) || 2;
  const crit10 = Number(answers.crit_10) || 2;
  const learn1 = Number(answers.learn_1) || 2;
  const learn2 = Number(answers.learn_2) || 2;
  const learn9 = Number(answers.learn_9) || 2;

  // 1. Kesiapan Responsi & Artikulasi Verbal
  if (crit10 >= 3) {
    strengths.push({
      id: "responsi_readiness",
      category: "Kritis",
      title: "Paham alur logika dan siap menerangkan kode saat responsi tatap muka",
      evidence: "Mampu menjelaskan kembali jalan pikiran di balik setiap fungsi atau baris kode saat diuji langsung oleh dosen maupun asisten praktikum.",
    });
  }

  // 2. Kemandirian Debugging & Penelusuran Error
  if (metrics.debuggingAutonomy >= 60 || seq.includes("Jarang pakai AI") || seq.includes("baru cek ulang")) {
    strengths.push({
      id: "debugging_autonomy",
      category: "Kemandirian",
      title: "Terbiasa menganalisis pesan error dan baris kode secara mandiri terlebih dahulu",
      evidence: `Indeks kemandirian problem-solving mencapai ${metrics.debuggingAutonomy}%. Responden tidak langsung menyalin pesan error ke AI, melainkan meneliti nomor baris dan alur program secara independen.`,
    });
  }

  // 3. Deteksi Halusinasi Jurnal
  if (metrics.journalAccuracy.correct >= 4) {
    strengths.push({
      id: "journal_audit",
      category: "Kritis",
      title: "Kritis menyaring rujukan ilmiah dan tidak mudah terkecoh sitasi fiktif",
      evidence: `Berhasil mengidentifikasi ${metrics.journalAccuracy.correct} dari 6 referensi jurnal dengan tepat (${metrics.journalAccuracy.percentage}%), menunjukkan ketelitian tinggi terhadap keluaran AI.`,
    });
  }

  // 4. Disiplin Uji Silang Dokumentasi
  if (crit3 >= 3 || crit8 >= 3 || crit7 <= 2) {
    strengths.push({
      id: "doc_verification",
      category: "Verifikasi",
      title: "Disiplin menguji silang solusi AI dengan dokumentasi resmi dan materi kuliah",
      evidence: "Secara aktif mencocokkan sintaks, method, atau pustaka yang disarankan AI dengan dokumentasi resmi bahasa pemrograman untuk memastikan kaidahnya benar.",
    });
  }

  // 5. Orientasi pada Proses Belajar, Bukan Hasil Instan
  if (crit6 >= 3) {
    strengths.push({
      id: "learning_process_orientation",
      category: "Kritis",
      title: "Fokus mempelajari proses berpikir dan logika algoritma, bukan sekadar meminta hasil jadi",
      evidence: "Memposisikan AI untuk menuntun langkah pemecahan masalah secara bertahap, bukan sekadar mengambil potongan kode siap pakai.",
    });
  }

  // 6. Menyusun Solusi Sendiri Dulu
  if (crit1 >= 3) {
    strengths.push({
      id: "self_attempt_first",
      category: "Kemandirian",
      title: "Membiasakan diri menyusun solusi mandiri sebelum mengonfirmasinya ke AI",
      evidence: "Mengedepankan pemikiran sendiri saat mengerjakan tugas dan baru memanfaatkan AI sebagai pembanding untuk memastikan ketepatan solusi.",
    });
  }

  // 7. Kontrol Penggunaan Terukur
  if (crit5 >= 3) {
    strengths.push({
      id: "usage_boundary_control",
      category: "Kemandirian",
      title: "Membatasi penggunaan AI hanya pada saat benar-benar menemui jalan buntu",
      evidence: "Memiliki kontrol diri yang baik untuk tidak terus-menerus membuka AI, menjaga daya juang analitis tetap aktif saat menyelesaikan persoalan.",
    });
  }

  // 8. Rutin Latihan Koding Murni
  if (practice === "Sering" || practice === "Kadang-kadang") {
    strengths.push({
      id: "practice_consistency",
      category: "Kemandirian",
      title: "Rutin melatih kemampuan koding murni di editor tanpa bantuan asisten cerdas",
      evidence: "Menyediakan waktu khusus untuk berlatih memprogram tanpa AI, sehingga sintaks dasar dan intuisi algoritma tetap melekat kuat.",
    });
  }

  // 9. Eksplorasi Materi di Luar Silabus
  if (learn9 >= 3) {
    strengths.push({
      id: "syllabus_expansion",
      category: "Kolaborasi",
      title: "Aktif mengeksplorasi konsep dan materi teknologi baru di luar kurikulum kuliah",
      evidence: "Memanfaatkan asisten AI untuk mendalami topik-topik komputasi mutakhir yang belum sempat diajarkan di kelas reguler.",
    });
  }

  // 10. Menggunakan AI Memperjelas Konsep Abstrak
  if (learn1 >= 3 || learn2 >= 3) {
    strengths.push({
      id: "concrete_conceptualization",
      category: "Kritis",
      title: "Mampu memanfaatkan analogi konkret AI untuk memperjelas konsep abstrak",
      evidence: "Menyerap penjelasan konsep rumit melalui contoh penerapan praktis yang dihadirkan AI tanpa kehilangan esensi teorinya.",
    });
  }

  // 11. Keyakinan Mandiri
  if (crit2 >= 3) {
    strengths.push({
      id: "academic_self_efficacy",
      category: "Kemandirian",
      title: "Memiliki keyakinan tinggi dapat menuntaskan tugas tanpa ketergantungan pada AI",
      evidence: "Memiliki efikasi diri akademik yang mantap dalam menyelesaikan tantangan pemrograman dengan kapasitas penalaran sendiri.",
    });
  }

  if (strengths.length === 0) {
    strengths.push({
      id: "baseline_awareness",
      category: "Kritis",
      title: "Keterbukaan dalam mengevaluasi kebiasaan dan kemandirian belajar",
      evidence: "Bersikap jujur dan transparan dalam mengakui kebiasaan belajar serta ketergantungan terhadap AI, menjadi fondasi utama bagi pengembangan kompetensi mandiri.",
    });
  }

  return strengths;
}

/**
 * Evaluates academic risks and vulnerabilities based on empirical facts from submitted answers.
 */
export function evaluateRisks(
  answers: Record<string, any>,
  metrics: EvaluationMetrics,
  score: number
): AcademicRisk[] {
  const risks: AcademicRisk[] = [];
  const seq = typeof answers.problem_solving_sequence === "string" ? answers.problem_solving_sequence : "";
  const triggers: string[] = Array.isArray(answers.usage_triggers) ? answers.usage_triggers : [];
  const practice = typeof answers.learn_practice_frequency === "string" ? answers.learn_practice_frequency : "";
  const crit4 = Number(answers.crit_4) || 2;
  const crit7 = Number(answers.crit_7) || 2;
  const crit9 = Number(answers.crit_9) || 2;
  const crit10 = Number(answers.crit_10) || 2;
  const learn6 = Number(answers.learn_6) || 2;
  const learn7 = Number(answers.learn_7) || 2;
  const learn8 = Number(answers.learn_8) || 2;
  const dep1 = Number(answers.dep_1) || 2;
  const dep3 = Number(answers.dep_3) || 2;
  const dep5 = Number(answers.dep_5) || 2;

  // 1. Tekanan Deadline
  if (triggers.some((t) => t.includes("deadline") || t.includes("tenggat"))) {
    risks.push({
      id: "deadline_compromise",
      severity: "Tinggi",
      title: "Mudah terdorong mengambil jalan pintas kode instan setiap kali dikejar deadline tugas",
      evidence: "Teridentifikasi mengandalkan AI secara intensif saat batas waktu pengumpulan tugas praktikum mendesak.",
      implication: "Mendorong kecenderungan 'asal kode berjalan' yang mengorbankan pemahaman struktur data dan algoritma fundamental.",
    });
  }

  // 2. Refleks Langsung Bertanya ke AI saat Error
  if (seq.includes("Langsung tanya AI sebagai langkah pertama")) {
    risks.push({
      id: "instant_ai_reflex",
      severity: "Tinggi",
      title: "Refleks langsung bertanya ke AI saat menemui error tanpa sempat meneliti pesan kesalahannya",
      evidence: "Tindakan pertama saat menemui kendala koding adalah langsung bertanya ke AI tanpa membaca stack trace atau mencari di dokumentasi terlebih dahulu.",
      implication: "Menumpulkan insting diagnosa bug mandiri dan berpotensi menimbulkan kesulitan besar saat evaluasi coding luring tanpa koneksi internet.",
    });
  }

  // 3. Permintaan Solusi Utuh (Black-Box)
  if (dep5 >= 3) {
    risks.push({
      id: "full_code_request",
      severity: "Sedang",
      title: "Cenderung meminta solusi program lengkap sehingga melewatkan proses penalaran algoritma",
      evidence: "Sering meminta AI menghasilkan solusi program utuh alih-alih meminta petunjuk logika konseptual bertahap.",
      implication: "Menciptakan ilusi kompetensi semu yang rentan runtuh saat diminta memodifikasi kode secara langsung pada sesi responsi.",
    });
  }

  // 4. Tugas Cepat Selesai tapi Belum Tentu Paham
  if (learn8 >= 3 || learn6 >= 3) {
    risks.push({
      id: "task_completion_over_understanding",
      severity: "Sedang",
      title: "Tugas sering terselesaikan dengan cepat, namun pemahaman mendalam terhadap kodenya masih belum utuh",
      evidence: "Mengakui proses belajar lebih berorientasi pada penyelesaian tugas daripada pemahaman materi secara mendalam.",
      implication: "Membuat retensi pengetahuan jangka panjang menjadi dangkal dan mudah terlupakan setelah tugas diserahkan.",
    });
  }

  // 5. Pernah Mengumpulkan Kode Error dari AI
  if (crit9 >= 3) {
    risks.push({
      id: "unnoticed_logic_bug",
      severity: "Sedang",
      title: "Pernah meloloskan kekeliruan logika kode dari AI karena kurang teliti menguji hasil akhirnya",
      evidence: "Responden mengakui pernah mengumpulkan tugas kuliah berbasis AI yang memuat kekeliruan logika yang tidak disadari sebelumnya.",
      implication: "Menunjukkan tahapan pengetesan lokal dan uji edge-case belum dijalankan secara tuntas sebelum submit tugas.",
    });
  }

  // 6. Mudah Percaya Penjelasan AI Tanpa Kroscek
  if (crit7 >= 3) {
    risks.push({
      id: "uncritical_trust",
      severity: "Sedang",
      title: "Cenderung mudah percaya pada jawaban AI yang terdengar meyakinkan tanpa mengecek dokumentasi resminya",
      evidence: "Sering langsung mempercayai penjelasan AI yang tampak logis tanpa memvalidasinya ke sumber dokumentasi resmi.",
      implication: "Berpotensi mengadopsi sintaks atau library usang (deprecated) dan logika yang sekadar tampak benar di permukaan.",
    });
  }

  // 7. Kesulitan / Kekhawatiran Tanpa AI
  if (dep1 >= 3 || dep3 >= 3) {
    risks.push({
      id: "dependency_anxiety",
      severity: "Sedang",
      title: "Merasa canggung atau khawatir jika harus memecahkan persoalan pemrograman tanpa koneksi AI",
      evidence: "Merasakan tugas perkuliahan menjadi jauh lebih sulit dan membingungkan jika tidak didampingi asisten cerdas.",
      implication: "Mengikis rasa percaya diri mandiri saat dihadapkan pada ujian teknis luring atau coding interview kerja.",
    });
  }

  // 8. Rentan saat Responsi Tatap Muka
  if (crit10 <= 2) {
    risks.push({
      id: "responsi_vulnerability",
      severity: "Tinggi",
      title: "Rentan kesulitan menerangkan alur program jika dosen atau asisten menanyakan detail baris kodenya",
      evidence: "Kurang yakin dapat menerangkan kembali alur logika kode tugas yang dihasilkan AI saat diuji secara lisan.",
      implication: "Menjadi titik rawan utama pada evaluasi praktikum tatap muka di mana penilaian berpusat pada pemahaman responden.",
    });
  }

  // 9. Akurasi Jurnal Rendah
  if (metrics.journalAccuracy.correct <= 3) {
    risks.push({
      id: "journal_detection_gap",
      severity: "Perhatian",
      title: "Sensitivitas membedakan rujukan ilmiah asli dan rekaan AI masih perlu diasah lebih lanjut",
      evidence: `Hanya mengidentifikasi ${metrics.journalAccuracy.correct} dari 6 studi kasus referensi jurnal dengan benar (${metrics.journalAccuracy.percentage}%).`,
      implication: "Berisiko mengutip artikel atau penulis ilmiah fiktif hasil fabrikasi AI ke dalam penulisan laporan praktikum atau tugas akhir.",
    });
  }

  // 10. Melewatkan Materi Perkuliahan
  if (learn7 >= 3) {
    risks.push({
      id: "lecture_bypass",
      severity: "Sedang",
      title: "Cenderung menganggap AI sudah cukup sehingga terkadang melewatkan materi inti perkuliahan",
      evidence: "Cenderung melewatkan penjelasan materi kuliah reguler karena merasa rangkuman AI sudah mencukupi.",
      implication: "Berisiko kehilangan pemahaman terhadap standar kurikulum institusi dan studi kasus spesifik yang ditekankan dosen.",
    });
  }

  // 11. Merasa Kemampuan Berpikir Menurun
  if (crit4 >= 3) {
    risks.push({
      id: "cognitive_decline_perception",
      severity: "Perhatian",
      title: "Menyadari adanya penurunan daya konsentrasi analitis setelah terbiasa bergantung pada bantuan instan",
      evidence: "Merasakan penurunan kelenturan berpikir kritis saat harus merumuskan solusi logika secara mandiri.",
      implication: "Sinyal penting untuk mulai menyeimbangkan kembali ritme belajar dengan latihan penalaran tanpa alat bantu.",
    });
  }

  // 12. Jarang Latihan Koding Mandiri
  if (practice === "Jarang" || practice === "Tidak Pernah") {
    risks.push({
      id: "rare_offline_practice",
      severity: "Perhatian",
      title: "Kurang meluangkan waktu untuk latihan koding mandiri tanpa alat bantu",
      evidence: "Responden jarang atau tidak pernah mengalokasikan waktu menulis kode mandiri tanpa bantuan asisten cerdas.",
      implication: "Daya ingat terhadap sintaks bahasa pemrograman dan algoritma dasar berisiko memudar seiring berjalannya semester.",
    });
  }

  if (risks.length === 0) {
    risks.push({
      id: "overconfidence_check",
      severity: "Perhatian",
      title: "Perlu tetap waspada saat menghadapi skala proyek yang semakin rumit di semester lanjutan",
      evidence: "Pola pemakaian saat ini berada dalam kendali mandiri yang baik.",
      implication: "Pertahankan disiplin verifikasi kode saat tugas proyek berskala besar di semester atas mulai menuntut arsitektur yang lebih kompleks.",
    });
  }

  return risks;
}

/**
 * Generates concrete actionable recommendations.
 */
export function generateActionableRecommendations(
  answers: Record<string, any>,
  risks: AcademicRisk[],
  score: number
): ActionableRecommendation[] {
  const recommendations: ActionableRecommendation[] = [];

  recommendations.push({
    id: "rec_1",
    title: "Terapkan Protokol '2-Minute Self-Debugging'",
    action: "Saat menjumpai error atau exception, luangkan 2 menit penuh untuk membaca nomor baris dan pesan traceback secara mandiri sebelum beralih ke AI.",
    expectedOutcome: "Melatih intuisi diagnosa masalah dan memastikan Anda tidak gugup saat menghadapi ujian koding luring.",
  });

  recommendations.push({
    id: "rec_2",
    title: "Ubah Pola Instruksi Menjadi 'Socratic Mentoring'",
    action: "Instruksikan AI: 'Jelaskan konsep dan berikan pertanyaan penuntun tanpa memberikan kode lengkap' saat mencari bantuan pemecahan masalah.",
    expectedOutcome: "Mencegah fenomena salin-tempel buta dan menjamin logika algoritma tetap disusun oleh penalaran Anda sendiri.",
  });

  recommendations.push({
    id: "rec_3",
    title: "Simulasi Uji Responsi Mandiri Sebelum Submit",
    action: "Sebelum mengumpulkan tugas, terangkan alur kerja fungsi utama secara lisan dalam 2-3 kalimat seolah-olah sedang diuji di hadapan asisten praktikum.",
    expectedOutcome: "Menjamin penguasaan materi 100% dan meningkatkan kepercayaan diri saat sesi responsi tatap muka.",
  });

  recommendations.push({
    id: "rec_4",
    title: "Validasi Silang Sintaks & Referensi ke Sumber Resmi",
    action: "Selalu uji silang pustaka atau fungsi yang disarankan AI ke dokumentasi resmi bahasa pemrograman untuk memastikan kaidah mutakhir.",
    expectedOutcome: "Mencegah penggunaan fungsi usang (deprecated) dan mengeliminasi risiko pencantuman sitasi fiktif.",
  });

  return recommendations;
}

/**
 * Generates natural, human-like narrative conclusion synthesized from the respondent's multidimensional answers.
 * Format: "Anda menggunakan AI terutama untuk [pemakaian], dan cenderung [kebiasaan/alur], sehingga [dampak/catatan evaluatif]."
 */
export function generateNarrativeConclusion(
  answers: Record<string, any>,
  details: {
    band?: DependencyBand;
    metrics?: EvaluationMetrics;
    usageProfile?: UsageProfile;
  }
): string {
  // 1. Ekstraksi Data Isian Responden
  const activities: string[] = Array.isArray(answers?.academic_activities)
    ? answers.academic_activities
    : details.usageProfile?.academicActivities || [];

  const triggers: string[] = Array.isArray(answers?.usage_triggers)
    ? answers.usage_triggers
    : details.usageProfile?.usageTriggers || [];

  const sequence = String(answers?.problem_solving_sequence || details.usageProfile?.problemSolvingSequence || "");
  const tool = String(answers?.primary_ai_tool || details.usageProfile?.primaryTool || "");
  const practice = String(answers?.learn_practice_frequency || details.usageProfile?.practiceFrequency || "");

  const dep5 = Number(answers?.dep_5) || 2;
  const crit9 = Number(answers?.crit_9) || 2;
  const crit10 = Number(answers?.crit_10) || 2;
  const learn8 = Number(answers?.learn_8) || 2;

  const band = details.band || "SEDANG";
  const autonomy = details.metrics?.debuggingAutonomy ?? 50;
  const journalAcc = details.metrics?.journalAccuracy?.percentage ?? 50;

  // 2. Variabel Pemakaian Utama (Untuk Apa Saja)
  const activityPhrases: string[] = [];
  const hasCodingTemplate = activities.some((a) => a.includes("Membuat kode") || a.includes("template coding"));
  const hasBugFixing = activities.some((a) => a.includes("Cari letak bug") || a.includes("kodingan error"));
  const hasComplexConcepts = activities.some((a) => a.includes("penjelasan konsep") || a.includes("algoritma"));
  const hasBrainstorming = activities.some((a) => a.includes("Brainstorming") || a.includes("fitur aplikasi"));
  const hasReportDraft = activities.some((a) => a.includes("laporan praktikum") || a.includes("PPT"));
  const hasSummarizing = activities.some((a) => a.includes("Merangkum materi"));
  const hasExamPractice = activities.some((a) => a.includes("soal latihan") || a.includes("kisi-kisi"));
  const hasCodeExplaining = activities.some((a) => a.includes("penjelasan alur kode") || a.includes("merapikan kode"));

  if (hasCodingTemplate && hasBugFixing) {
    activityPhrases.push("merancang kerangka kode pemrograman dan menelusuri sumber error saat praktikum");
  } else if (hasCodingTemplate) {
    activityPhrases.push("menghasilkan struktur fungsi dan template kode");
  } else if (hasBugFixing) {
    activityPhrases.push("mendiagnosa letak bug dan mencari perbaikan kodingan");
  }

  if (hasComplexConcepts) {
    activityPhrases.push("membedah konsep algoritma atau teori perkuliahan yang rumit");
  } else if (hasCodeExplaining) {
    activityPhrases.push("memahami alur baris program yang belum familiar");
  }

  if (hasBrainstorming) {
    activityPhrases.push("mengembangkan ide rancangan proyek dan arsitektur aplikasi");
  }
  if (hasReportDraft) {
    activityPhrases.push("menyusun draf laporan praktikum dan bahan presentasi");
  }
  if (hasSummarizing && activityPhrases.length < 2) {
    activityPhrases.push("merangkum materi kuliah dosen agar lebih mudah diulang");
  }
  if (hasExamPractice && activityPhrases.length < 2) {
    activityPhrases.push("membuat latihan soal untuk persiapan kuis atau ujian");
  }

  let purpose = "";
  if (activityPhrases.length === 0) {
    purpose = "membantu proses pengerjaan tugas-tugas perkuliahan harian";
  } else if (activityPhrases.length === 1) {
    purpose = activityPhrases[0];
  } else {
    purpose = `${activityPhrases[0]} serta ${activityPhrases[1]}`;
  }

  let prefix = "Anda menggunakan AI";
  if (tool && tool !== "Tidak disebutkan" && tool !== "Lainnya") {
    prefix = `Anda memanfaatkan ${tool}`;
  }

  // 3. Variabel Kecenderungan Perilaku (Cenderung...)
  let tendency = "";
  const hasDeadlineTrigger = triggers.some((t) => t.includes("deadline") || t.includes("tenggat"));
  const hasHabitTrigger = triggers.some((t) => t.includes("kebiasaan"));
  const hasSoloTrigger = triggers.some((t) => t.includes("Belajar mandiri disaat tidak ada teman"));
  const hasStuckTrigger = triggers.some((t) => t.includes("Buntu saat mencari solusi"));
  const hasBoilerplateTrigger = triggers.some((t) => t.includes("Menghindari penulisan kode berulang"));

  if (sequence.includes("Langsung tanya AI sebagai langkah pertama")) {
    if (hasDeadlineTrigger) {
      tendency = "langsung menjadikannya rujukan instan utama setiap kali dikejar tenggat waktu tugas yang mendesak";
    } else if (hasHabitTrigger) {
      tendency = "menjadikannya refleks pertama secara otomatis begitu mulai mengetik tugas di depan teks editor";
    } else if (dep5 >= 3) {
      tendency = "langsung meminta potongan solusi kode utuh tanpa jeda untuk meraba logikanya secara mandiri";
    } else {
      tendency = "langsung bertanya ke AI sebagai langkah pertama sebelum sempat membaca pesan error atau mencobanya sendiri";
    }
  } else if (sequence.includes("Tanya AI dulu untuk gambaran awal")) {
    if (hasStuckTrigger) {
      tendency = "menggunakannya sebagai kompas awal saat menemui jalan buntu teknis, baru kemudian menguji kembali kebenarannya";
    } else if (hasSoloTrigger) {
      tendency = "memposisikannya seperti teman diskusi daring saat belajar mandiri sebelum memverifikasi ke literatur lain";
    } else {
      tendency = "menjadikannya acuan awal untuk memperoleh gambaran umum sebelum memvalidasi ke sumber yang lebih terpercaya";
    }
  } else if (sequence.includes("Buka AI dan sumber terpercaya bersamaan")) {
    if (hasBoilerplateTrigger) {
      tendency = "bersikap taktis dengan memangkas penulisan kode repetitif sambil tetap menyandingkannya dengan dokumentasi resmi";
    } else {
      tendency = "bersikap kritis dengan mengomparasikan saran AI secara langsung terhadap dokumentasi teknis dan materi perkuliahan";
    }
  } else if (sequence.includes("Jarang pakai AI")) {
    tendency = "tetap mengutamakan penalaran logika sendiri serta diskusi rekan sejawat, dan hanya melirik AI dalam situasi buntu ekstrem";
  } else {
    if (hasDeadlineTrigger && band === "TINGGI") {
      tendency = "mengandalkannya sebagai penyelamat utama saat ritme tugas praktikum mulai menumpuk dan mendesak";
    } else if (hasSoloTrigger) {
      tendency = "memanfaatkannya sebagai pengganti rekan belajar saat harus memecahkan persoalan perkuliahan seorang diri";
    } else if (dep5 >= 3) {
      tendency = "meminta solusi instan siap pakai agar tugas dapat terselesaikan sesegera mungkin";
    } else if (band === "RENDAH") {
      tendency = "menjaga jarak aman dan tetap memegang kendali penuh atas alur penyelesaian masalah";
    } else {
      tendency = "menggunakannya secara situasional terutama saat menghadapi kebuntuan teknis yang memakan waktu";
    }
  }

  // 4. Variabel Dampak Nyata pada Pemahaman & Kompetensi (Sehingga...)
  let consequence = "";

  if (band === "TINGGI") {
    if (crit10 <= 2 || learn8 >= 3) {
      consequence =
        "tugas-tugas praktikum memang terselesaikan jauh lebih cepat, tetapi Anda berisiko kehilangan kepekaan logika mendalam dan berpotensi canggung saat harus menerangkan alur program pada sesi responsi atau ujian luring.";
    } else if (crit9 >= 3) {
      consequence =
        "tugas Anda dapat terkumpul tepat waktu, namun ada risiko meloloskan kekeliruan logika yang tak terduga karena minimnya pengetesan mandiri sebelum kode diserahkan.";
    } else if (autonomy < 40) {
      consequence =
        "kemandirian Anda dalam membaca stack trace dan menyelesaikan bug pemrograman secara mandiri masih rentan bila dihadapkan pada situasi coding tanpa koneksi internet.";
    } else {
      consequence =
        "alur kerja Anda terasa sangat ringkas, namun kebiasaan ini dapat menumpulkan daya analisis masalah jika tidak diimbangi pembuktian kode baris per baris.";
    }
  } else if (band === "SEDANG") {
    if (crit10 >= 3 && autonomy >= 65) {
      consequence =
        "produktivitas belajar Anda meningkat tanpa mengorbankan pemahaman logika dasar, asalkan Anda terus konsisten menelusuri mengapa kode tersebut bisa berjalan.";
    } else if (practice === "Jarang" || practice === "Tidak Pernah") {
      consequence =
        "pengerjaan tugas menjadi lebih efisien, namun Anda tetap perlu meluangkan waktu latihan koding murni dari nol agar memori sintaks dan intuisi algoritma Anda tidak mudah memudar.";
    } else if (journalAcc >= 67) {
      consequence =
        "Anda memperoleh akselerasi waktu yang baik sambil tetap memiliki kepekaan yang cukup jeli dalam menyaring informasi atau referensi yang keliru.";
    } else {
      consequence =
        "efisiensi pengerjaan tugas Anda terjaga dengan baik, namun tetap diperlukan kehati-hatian agar tidak terbiasa mengandalkan jalan pintas saat menghadapi problem yang lebih kompleks.";
    }
  } else {
    // BAND RENDAH / MANDIRI
    if (journalAcc >= 67 || autonomy >= 75) {
      consequence =
        "fondasi pemikiran komputasional dan daya nalar analitis Anda tetap sangat kokoh, menjadikan AI murni sebagai alat bantu akselerasi tanpa mengikis kemandirian akademik Anda.";
    } else if (crit10 >= 3) {
      consequence =
        "kemandirian nalar Anda terjaga solid dan Anda memiliki kesiapan mental yang sangat baik untuk mempertanggungjawabkan setiap tugas pada sesi evaluasi tatap muka.";
    } else {
      consequence =
        "penguasaan konsep fundamental dan kebiasaan pemecahan masalah mandiri Anda tetap terbangun secara sehat dan berkelanjutan.";
    }
  }

  return `${prefix} terutama untuk ${purpose}, dan cenderung ${tendency}, sehingga ${consequence}`;
}

/**
 * Calculates the complete dependency score and comprehensive academic evaluation report.
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

  const usageProfile = extractUsageProfile(answers);
  const metrics = calculateEvaluationMetrics(roundedScore, answers);
  const strengths = evaluateStrengths(answers, metrics, roundedScore);
  const risks = evaluateRisks(answers, metrics, roundedScore);
  const actionableRecommendations = generateActionableRecommendations(answers, risks, roundedScore);
  const narrativeConclusion = generateNarrativeConclusion(answers, {
    band,
    metrics,
    usageProfile,
  });

  // Backward compatibility strings
  const observations = [
    `Indeks ketergantungan AI: ${roundedScore.toFixed(1)} / 100 (${bandLabel}).`,
    `Alat utama yang digunakan: ${usageProfile.primaryTool} dengan durasi mingguan: ${usageProfile.weeklyDuration}.`,
    `Akurasi deteksi jurnal ilmiah: ${metrics.journalAccuracy.correct} dari ${metrics.journalAccuracy.total} kasus benar (${metrics.journalAccuracy.percentage}%).`,
  ];
  const recommendations = actionableRecommendations.map((r) => `${r.title}: ${r.action}`);

  return {
    scoringVersion: SCORING_VERSION,
    score: roundedScore,
    band,
    bandLabel,
    bandDescription,
    narrativeConclusion,
    itemDetails,
    usageProfile,
    metrics,
    strengths,
    risks,
    actionableRecommendations,
    observations,
    recommendations,
    calculatedAt: new Date().toISOString(),
    journalDetectionAccuracy: {
      correctCount: metrics.journalAccuracy.correct,
      totalCases: metrics.journalAccuracy.total,
      scorePercentage: metrics.journalAccuracy.percentage,
    },
  };
}
