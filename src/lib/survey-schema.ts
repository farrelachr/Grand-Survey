import { z } from "zod";

export const SURVEY_VERSION = "2026.1";
export const SCORING_VERSION = "1.0.0";

export const LIKERT_OPTIONS = [
  { value: 1, label: "Sangat Tidak Setuju" },
  { value: 2, label: "Tidak Setuju" },
  { value: 3, label: "Setuju" },
  { value: 4, label: "Sangat Setuju" },
] as const;

export interface SectionMeta {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  itemCount: number;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: "profile",
    number: 1,
    title: "Profil Responden",
    subtitle: "Konfirmasi angkatan, minat bidang ilmu komputer, dan profil awal penggunaan AI.",
    itemCount: 4,
  },
  {
    id: "usage_patterns",
    number: 2,
    title: "Pola Penggunaan AI",
    subtitle: "Intensitas, alat utama, dan skenario umum pemanfaatan AI dalam akademik.",
    itemCount: 6,
  },
  {
    id: "dependency_index",
    number: 3,
    title: "Ketergantungan terhadap AI",
    subtitle: "Evaluasi kemandirian akademik dan indikator ketergantungan (Skala 1–4).",
    itemCount: 8,
  },
  {
    id: "coding_problem_solving",
    number: 4,
    title: "AI dalam Coding & Problem Solving",
    subtitle: "Perilaku ketika menghadapi error, pembuatan kode, dan debugging.",
    itemCount: 7,
  },
  {
    id: "learning_process",
    number: 5,
    title: "AI dan Proses Belajar",
    subtitle: "Dampak AI terhadap pemahaman konsep dan cara belajar mahasiswa.",
    itemCount: 7,
  },
  {
    id: "independence_verification",
    number: 6,
    title: "Kemandirian, Verifikasi & Critical Thinking",
    subtitle: "Evaluasi kritis, validasi output AI, dan kemampuan mandiri.",
    itemCount: 7,
  },
  {
    id: "perceptions_boundaries",
    number: 7,
    title: "Persepsi dan Batas Penggunaan AI",
    subtitle: "Batasan etika dan titik kritis ketergantungan menurut responden.",
    itemCount: 7,
  },
  {
    id: "future_readiness",
    number: 8,
    title: "AI dan Masa Depan Mahasiswa Ilkom",
    subtitle: "Kesiapan kompetensi, fondasi ilmu komputer, dan harapan program HIMALKOM.",
    itemCount: 8,
  },
  {
    id: "recommendations",
    number: 9,
    title: "Saran dan Rekomendasi",
    subtitle: "Refleksi terbuka untuk penguatan literasi dan advokasi akademik HIMALKOM.",
    itemCount: 3,
  },
];

// Zod Schema for Complete Survey Submission
export const SurveySubmissionSchema = z.object({
  // Section 1: Profil (4 items)
  cohort_confirmation: z.enum(["Angkatan 62 (2025)", "Lainnya"], {
    message: "Pilih konfirmasi angkatan Anda.",
  }),
  cs_interest: z.string().min(1, "Pilih peminatan utama Ilmu Komputer Anda."),
  ai_usage_frequency: z.string().min(1, "Pilih frekuensi penggunaan AI Anda."),
  ai_tools_used: z.array(z.string()).min(1, "Pilih minimal satu alat AI yang pernah Anda gunakan."),

  // Section 2: Pola Penggunaan (6 items)
  primary_ai_tool: z.string().min(1, "Pilih alat AI yang paling sering Anda gunakan."),
  weekly_ai_frequency: z.string().min(1, "Pilih perkiraan frekuensi mingguan penggunaan AI."),
  academic_activities: z.array(z.string()).min(1, "Pilih minimal satu aktivitas akademik."),
  usage_triggers: z.array(z.string()).min(1, "Pilih minimal satu kondisi pemicu."),
  session_duration: z.string().min(1, "Pilih durasi tipikal sesi penggunaan AI Anda."),
  ai_vs_traditional: z.string().min(1, "Pilih perbandingan ketergantungan sumber belajar."),

  // Section 3: Ketergantungan (8 statements Likert 1-4)
  dep_1: z.number().int().min(1).max(4),
  dep_2: z.number().int().min(1).max(4),
  dep_3: z.number().int().min(1).max(4),
  dep_4: z.number().int().min(1).max(4),
  dep_5: z.number().int().min(1).max(4),
  dep_6: z.number().int().min(1).max(4),
  dep_7: z.number().int().min(1).max(4),
  dep_8: z.number().int().min(1).max(4),

  // Section 4: Coding & Problem Solving (7 items)
  coding_first_action: z.string().min(1, "Pilih aksi pertama saat menjumpai error coding."),
  code_generation_frequency: z.string().min(1, "Pilih frekuensi meminta AI men-generate kode."),
  code_debugging_frequency: z.string().min(1, "Pilih frekuensi menggunakan AI untuk debugging."),
  code_explanation_frequency: z.string().min(1, "Pilih frekuensi meminta penjelasan kode."),
  ability_explain_ai_code: z.string().min(1, "Pilih tingkat kemampuan menjelaskan kode buatan AI."),
  use_ununderstood_code: z.string().min(1, "Pilih frekuensi menggunakan kode tanpa dipahami."),
  test_ai_code_before_use: z.string().min(1, "Pilih kebiasaan pengujian kode buatan AI."),

  // Section 5: Proses Belajar (7 items)
  learn_faster_concepts: z.number().int().min(1).max(4),
  learn_difficult_concepts: z.number().int().min(1).max(4),
  learn_alternative_approaches: z.number().int().min(1).max(4),
  learn_reduced_reliance_others: z.number().int().min(1).max(4),
  learn_prioritize_completion: z.number().int().min(1).max(4),
  learn_attempt_understand: z.number().int().min(1).max(4),
  learn_encountered_hallucination: z.string().min(1, "Pilih frekuensi menjumpai informasi keliru dari AI."),

  // Section 6: Kemandirian & Verifikasi (7 statements Likert 1-4)
  crit_1: z.number().int().min(1).max(4),
  crit_2: z.number().int().min(1).max(4),
  crit_3: z.number().int().min(1).max(4),
  crit_4: z.number().int().min(1).max(4),
  crit_5: z.number().int().min(1).max(4),
  crit_6: z.number().int().min(1).max(4),
  crit_7: z.number().int().min(1).max(4),

  // Section 7: Persepsi & Batas (7 items)
  boundary_explain_material: z.string().min(1, "Pilih persepsi penggunaan AI untuk menjelaskan materi."),
  boundary_sample_code: z.string().min(1, "Pilih persepsi penggunaan AI untuk contoh kode."),
  boundary_debugging: z.string().min(1, "Pilih persepsi penggunaan AI untuk debugging."),
  boundary_entire_assignment: z.string().min(1, "Pilih persepsi meminta AI mengerjakan seluruh tugas."),
  boundary_ununderstood_answer: z.string().min(1, "Pilih persepsi menggunakan jawaban tanpa paham."),
  boundary_threshold_dependency: z.string().min(1, "Pilih definisi titik ketergantungan."),
  boundary_rules_needed: z.string().min(1, "Pilih pandangan Anda terkait perlunya aturan AI."),

  // Section 8: Masa Depan Ilkom (8 items)
  future_career_importance: z.number().int().min(1).max(4),
  future_proficiency_need: z.number().int().min(1).max(4),
  future_foundational_cs: z.number().int().min(1).max(4),
  future_problem_solving: z.number().int().min(1).max(4),
  future_prevent_overdependence: z.number().int().min(1).max(4),
  future_top_skills: z.array(z.string()).min(1, "Pilih minimal satu skill terpenting."),
  future_himalkom_programs: z.array(z.string()).min(1, "Pilih minimal satu usulan program HIMALKOM."),
  future_ideal_usage: z.string().min(1, "Pilih pandangan ideal peran AI dalam akademik."),

  // Section 9: Saran & Rekomendasi (3 open-ended)
  open_biggest_challenge: z.string().min(5, "Tuliskan tantangan terbesar Anda (minimal 5 karakter)."),
  open_effective_learning_tips: z.string().min(5, "Tuliskan saran proses belajar Anda (minimal 5 karakter)."),
  open_himalkom_initiative: z.string().min(5, "Tuliskan saran inisiatif HIMALKOM (minimal 5 karakter)."),
});

export type SurveySubmissionPayload = z.infer<typeof SurveySubmissionSchema>;
