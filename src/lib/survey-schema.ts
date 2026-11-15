import { z } from "zod";

export const SURVEY_VERSION = "2026.1";
export const SCORING_VERSION = "2.0.0";

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
    subtitle: "Identitas dasar responden, NIM, angkatan, kontak WhatsApp, dan email IPB.",
    itemCount: 5,
  },
  {
    id: "usage_patterns",
    number: 2,
    title: "Pola Penggunaan AI",
    subtitle: "Platform utama, durasi mingguan, ragam aktivitas akademik, dan pola pencarian solusi.",
    itemCount: 5,
  },
  {
    id: "dependency_index",
    number: 3,
    title: "Ketergantungan terhadap AI",
    subtitle: "Pernyataan evaluasi ketergantungan akademik mahasiswa Ilmu Komputer (Skala 1–4).",
    itemCount: 5,
  },
  {
    id: "journal_case_study",
    number: 4,
    title: "Instrumen Penilaian & Deteksi AI (Case Journal)",
    subtitle: "Uji analisis kritis terhadap 6 sitasi jurnal penelitian (Real vs Fake).",
    itemCount: 8,
  },
  {
    id: "independence_verification",
    number: 5,
    title: "Kemandirian, Verifikasi, dan Critical Thinking",
    subtitle: "Evaluasi kemandirian nalar, verifikasi materi, dan kesadaran kritis terhadap keluaran AI.",
    itemCount: 10,
  },
  {
    id: "learning_process",
    number: 6,
    title: "Dampak terhadap Pemahaman dan Proses Belajar",
    subtitle: "Pengaruh AI terhadap retensi konsep, pemahaman materi, dan disiplin latihan mandiri.",
    itemCount: 10,
  },
  {
    id: "perceptions_boundaries",
    number: 7,
    title: "Persepsi dan Batas Penggunaan AI",
    subtitle: "Pandangan mahasiswa mengenai batasan kewajaran dan titik kritis ketergantungan AI.",
    itemCount: 5,
  },
  {
    id: "future_readiness",
    number: 8,
    title: "AI dan Masa Depan Mahasiswa Ilkom",
    subtitle: "Kebutuhan kompetensi kerja, tantangan fundamental programming, dan program penguatan HIMALKOM.",
    itemCount: 9,
  },
  {
    id: "recommendations",
    number: 9,
    title: "Saran dan Masukan (Wajib)",
    subtitle: "Aspirasi dan refleksi terbuka mahasiswa untuk lingkungan akademik dan kebijakan HIMALKOM IPB.",
    itemCount: 3,
  },
];

// Zod Schema for Complete Survey Submission
export const SurveySubmissionSchema = z.object({
  // Section 1: Profil (5 items)
  respondent_name: z.string().min(2, "Nama lengkap wajib diisi (minimal 2 karakter)."),
  nim: z
    .string()
    .trim()
    .regex(/^M0403\d{5,7}$/i, "Format NIM tidak valid. Gunakan format M0403xxxxxx."),
  cohort_confirmation: z.enum(["60", "61", "62", "63"], {
    message: "Pilih angkatan Anda (60, 61, 62, atau 63).",
  }),
  whatsapp_number: z
    .string()
    .trim()
    .regex(
      /^(https?:\/\/)?wa\.me\/62\d{8,14}$/i,
      "Format WhatsApp tidak valid. Gunakan format wa.me/62xxx (contoh: wa.me/6281234567890)."
    ),
  ipb_email: z.string().min(5, "Email IPB wajib diisi."),

  // Section 2: Pola Penggunaan (5 items)
  primary_ai_tool: z.string().min(1, "Pilih platform Generative AI yang paling sering Anda gunakan."),
  weekly_ai_duration: z.string().min(1, "Pilih estimasi frekuensi dan durasi mingguan penggunaan AI."),
  academic_activities: z.array(z.string()).min(1, "Pilih minimal satu aktivitas akademik."),
  usage_triggers: z.array(z.string()).min(1, "Pilih minimal satu kondisi pemicu."),
  problem_solving_sequence: z.string().min(1, "Pilih urutan pencarian solusi Anda saat menghadapi kendala/error."),

  // Section 3: Ketergantungan (5 statements Likert 1-4)
  dep_1: z.number().int().min(1).max(4),
  dep_2: z.number().int().min(1).max(4),
  dep_3: z.number().int().min(1).max(4),
  dep_4: z.number().int().min(1).max(4),
  dep_5: z.number().int().min(1).max(4),

  // Section 4: Instrumen Penilaian & Deteksi AI (Case Journal) (8 items)
  journal_case_1: z.enum(["Real", "Fake"], { message: "Pilih klasifikasi untuk Kasus Jurnal 1." }),
  journal_case_2: z.enum(["Real", "Fake"], { message: "Pilih klasifikasi untuk Kasus Jurnal 2." }),
  journal_case_3: z.enum(["Real", "Fake"], { message: "Pilih klasifikasi untuk Kasus Jurnal 3." }),
  journal_case_4: z.enum(["Real", "Fake"], { message: "Pilih klasifikasi untuk Kasus Jurnal 4." }),
  journal_case_5: z.enum(["Real", "Fake"], { message: "Pilih klasifikasi untuk Kasus Jurnal 5." }),
  journal_case_6: z.enum(["Real", "Fake"], { message: "Pilih klasifikasi untuk Kasus Jurnal 6." }),
  journal_confidence: z.string().min(1, "Pilih tingkat keyakinan penilaian klasifikasi jurnal."),
  journal_reasoning: z.string().min(5, "Tuliskan alasan atau indikator analisis jurnal Anda (minimal 5 karakter)."),

  // Section 5: Kemandirian & Critical Thinking (10 statements Likert 1-4)
  crit_1: z.number().int().min(1).max(4),
  crit_2: z.number().int().min(1).max(4),
  crit_3: z.number().int().min(1).max(4),
  crit_4: z.number().int().min(1).max(4),
  crit_5: z.number().int().min(1).max(4),
  crit_6: z.number().int().min(1).max(4),
  crit_7: z.number().int().min(1).max(4),
  crit_8: z.number().int().min(1).max(4),
  crit_9: z.number().int().min(1).max(4),
  crit_10: z.number().int().min(1).max(4),

  // Section 6: Dampak Pemahaman & Proses Belajar (9 Likert + 1 Frequency)
  learn_1: z.number().int().min(1).max(4),
  learn_2: z.number().int().min(1).max(4),
  learn_3: z.number().int().min(1).max(4),
  learn_4: z.number().int().min(1).max(4),
  learn_5: z.number().int().min(1).max(4),
  learn_6: z.number().int().min(1).max(4),
  learn_7: z.number().int().min(1).max(4),
  learn_8: z.number().int().min(1).max(4),
  learn_9: z.number().int().min(1).max(4),
  learn_practice_frequency: z.string().min(1, "Pilih frekuensi penerapan mandiri materi perkuliahan."),

  // Section 7: Persepsi & Batas Penggunaan (4 choices + 1 essay)
  boundary_explain_material: z.string().min(1, "Pilih persepsi kewajaran penjelasan materi oleh AI."),
  boundary_sample_code: z.string().min(1, "Pilih persepsi kewajaran pembuatan contoh kode oleh AI."),
  boundary_debugging: z.string().min(1, "Pilih persepsi kewajaran debugging oleh AI."),
  boundary_entire_assignment: z.string().min(1, "Pilih persepsi penyelesaian seluruh tugas oleh AI."),
  boundary_threshold_essay: z.string().min(5, "Tuliskan pandangan titik kritis ketergantungan (minimal 5 karakter)."),

  // Section 8: Masa Depan Mahasiswa Ilkom (5 Likert + 3 multiple choices + 1 essay)
  future_labor_change: z.number().int().min(1).max(4),
  future_ai_competence: z.number().int().min(1).max(4),
  future_core_cs_needed: z.number().int().min(1).max(4),
  future_problem_solving_key: z.number().int().min(1).max(4),
  future_continuous_learning: z.number().int().min(1).max(4),
  future_most_important_skill: z.array(z.string()).min(1, "Pilih minimal satu kemampuan penting."),
  future_biggest_challenge: z.array(z.string()).min(1, "Pilih minimal satu tantangan utama."),
  future_needed_programs: z.array(z.string()).min(1, "Pilih minimal satu program kegiatan yang dibutuhkan."),
  future_ideal_graduate_profile: z.string().min(5, "Tuliskan profil lulusan Ilmu Komputer ideal (minimal 5 karakter)."),

  // Section 9: Saran dan Masukan (Wajib) (3 open-ended)
  feedback_task_practical_usage: z.string().min(5, "Tuliskan pendapat pengerjaan tugas/praktikum (minimal 5 karakter)."),
  feedback_independent_thinking: z.string().min(5, "Tuliskan saran mempertahankan pemikiran mandiri (minimal 5 karakter)."),
  feedback_lecturer_academic_response: z.string().min(5, "Tuliskan masukan untuk dosen dan lingkungan akademik (minimal 5 karakter)."),
});

export type SurveySubmissionPayload = z.infer<typeof SurveySubmissionSchema>;
