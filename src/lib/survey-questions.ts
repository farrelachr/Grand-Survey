import { LIKERT_OPTIONS } from "./survey-schema";

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "likert_matrix"
  | "textarea"
  | "text";

export interface ChoiceOption {
  value: string;
  label: string;
  hint?: string;
}

export interface LikertStatement {
  id: string;
  statement: string;
  isReversed?: boolean;
}

export interface QuestionDefinition {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  options?: ChoiceOption[];
  statements?: LikertStatement[];
  placeholder?: string;
  minChars?: number;
}

export interface SectionContent {
  sectionId: string;
  sectionNumber: number;
  title: string;
  subtitle: string;
  questions: QuestionDefinition[];
}

export const SURVEY_SECTIONS_DATA: SectionContent[] = [
  // SECTION 1: Profil Responden
  {
    sectionId: "profile",
    sectionNumber: 1,
    title: "Profil Responden",
    subtitle: "Identitas dasar responden, program studi, dan angkatan mahasiswa Ilmu Komputer IPB.",
    questions: [
      {
        id: "respondent_name",
        title: "Nama Lengkap",
        description: "Tuliskan nama lengkap Anda sesuai identitas mahasiswa IPB University.",
        type: "text",
        placeholder: "Masukkan nama lengkap Anda...",
        minChars: 2,
      },
      {
        id: "nim",
        title: "NIM (Nomor Induk Mahasiswa)",
        description: "Masukkan NIM resmi Anda dengan format M0403xxxxxx.",
        type: "text",
        placeholder: "M0403xxxxxx",
        minChars: 10,
      },
      {
        id: "cohort_confirmation",
        title: "Angkatan",
        description: "Pilih angkatan Anda sebagai mahasiswa Program Studi Ilmu Komputer IPB University.",
        type: "single_choice",
        options: [
          { value: "60", label: "Angkatan 60" },
          { value: "61", label: "Angkatan 61" },
          { value: "62", label: "Angkatan 62" },
          { value: "63", label: "Angkatan 63" },
        ],
      },
      {
        id: "whatsapp_number",
        title: "Nomor WhatsApp Aktif",
        description: "Gunakan format tautan wa.me/62xxx untuk koordinasi internal dan pengundian doorprize responden.",
        type: "text",
        placeholder: "Contoh: wa.me/6281234567890",
        minChars: 12,
      },
      {
        id: "ipb_email",
        title: "Email IPB",
        description: "Alamat email resmi IPB University (@apps.ipb.ac.id atau @ipb.ac.id).",
        type: "text",
        placeholder: "username@apps.ipb.ac.id",
        minChars: 5,
      },
    ],
  },

  // SECTION 2: Pola Penggunaan AI
  {
    sectionId: "usage_patterns",
    sectionNumber: 2,
    title: "Pola Penggunaan AI",
    subtitle: "Platform utama, estimasi durasi mingguan, aktivitas akademik, dan pola pencarian solusi.",
    questions: [
      {
        id: "primary_ai_tool",
        title: "Platform Generative AI apa yang paling sering Anda gunakan dalam kegiatan akademik?",
        type: "single_choice",
        options: [
          { value: "ChatGPT", label: "ChatGPT (OpenAI)" },
          { value: "Claude", label: "Claude (Anthropic)" },
          { value: "Google Gemini", label: "Google Gemini" },
          { value: "DeepSeek", label: "DeepSeek" },
          { value: "GitHub Copilot", label: "GitHub Copilot" },
          { value: "Lainnya", label: "Lainnya" },
        ],
      },
      {
        id: "weekly_ai_duration",
        title: "Seberapa sering dan berapa lama estimasi durasi Anda menggunakan AI untuk kegiatan akademik dalam satu minggu?",
        description: "Pilih perkiraan frekuensi dan durasi rata-rata harian Anda.",
        type: "single_choice",
        options: [
          { value: "Jarang (< 1 jam/hari)", label: "Jarang (< 1 jam/hari)" },
          { value: "Kadang-kadang (1–3 jam/hari)", label: "Kadang-kadang (1–3 jam/hari)" },
          { value: "Sering (4–6 jam/hari)", label: "Sering (4–6 jam/hari)" },
          { value: "Sangat sering (> 6 jam/hari)", label: "Sangat sering (> 6 jam/hari)" },
        ],
      },
      {
        id: "academic_activities",
        title: "Untuk aktivitas akademik apa saja Anda biasanya menggunakan bantuan AI?",
        description: "Dapat memilih lebih dari satu aktivitas.",
        type: "multiple_choice",
        options: [
          {
            value: "Minta penjelasan konsep, teori, atau algoritma yang rumit",
            label: "Minta penjelasan konsep, teori, atau algoritma yang rumit",
          },
          {
            value: "Brainstorming ide proyek, fitur aplikasi, atau alur sistem",
            label: "Brainstorming ide proyek, fitur aplikasi, atau alur sistem",
          },
          {
            value: "Membuat kode dari nol, buat fungsi, atau template coding",
            label: "Membuat kode dari nol, buat fungsi, atau template coding",
          },
          {
            value: "Cari letak bug dan solusi saat kodingan error",
            label: "Cari letak bug dan solusi saat kodingan error",
          },
          {
            value: "Minta penjelasan alur kode atau merapikan kode",
            label: "Minta penjelasan alur kode atau merapikan kode",
          },
          {
            value: "Menyusun laporan praktikum atau materi PPT",
            label: "Menyusun laporan praktikum atau materi PPT",
          },
          {
            value: "Merangkum materi yang diberikan dosen",
            label: "Merangkum materi yang diberikan dosen",
          },
          {
            value: "Buat contoh soal latihan atau kisi-kisi materi ujian",
            label: "Buat contoh soal latihan atau kisi-kisi materi ujian",
          },
        ],
      },
      {
        id: "usage_triggers",
        title: "Faktor atau kondisi apa yang paling sering mendorong Anda menggunakan AI?",
        description: "Dapat memilih lebih dari satu kondisi pemicu.",
        type: "multiple_choice",
        options: [
          {
            value: "Dikejar tenggat waktu (deadline) atau tugas menumpuk",
            label: "Dikejar tenggat waktu (deadline) atau tugas menumpuk",
          },
          {
            value: "Materi kuliah atau instruksi tugas sulit dipahami",
            label: "Materi kuliah atau instruksi tugas sulit dipahami",
          },
          {
            value: "Buntu saat mencari solusi error di Google atau dokumentasi",
            label: "Buntu saat mencari solusi error di Google atau dokumentasi",
          },
          {
            value: "Ingin mempercepat proses pengerjaan (efisiensi waktu)",
            label: "Ingin mempercepat proses pengerjaan (efisiensi waktu)",
          },
          {
            value: "Menghindari penulisan kode berulang yang memakan waktu",
            label: "Menghindari penulisan kode berulang yang memakan waktu",
          },
          {
            value: "Belajar mandiri disaat tidak ada teman untuk berdiskusi bareng",
            label: "Belajar mandiri disaat tidak ada teman untuk berdiskusi bareng",
          },
          {
            value: "Sudah menjadi kebiasaan setiap kali mulai mengerjakan tugas",
            label: "Sudah menjadi kebiasaan setiap kali mulai mengerjakan tugas",
          },
        ],
      },
      {
        id: "problem_solving_sequence",
        title: "Saat menghadapi kendala tugas atau error coding, bagaimana urutan pencarian solusi yang biasanya Anda lakukan?",
        type: "single_choice",
        options: [
          {
            value: "Langsung tanya AI sebagai langkah pertama tanpa cari di sumber lain.",
            label: "Langsung tanya AI sebagai langkah pertama tanpa cari di sumber lain.",
          },
          {
            value: "Tanya AI dulu untuk gambaran awal, baru cek ulang di sumber terpercaya.",
            label: "Tanya AI dulu untuk gambaran awal, baru cek ulang di sumber terpercaya.",
          },
          {
            value: "Buka AI dan sumber terpercaya bersamaan untuk membandingkan solusi.",
            label: "Buka AI dan sumber terpercaya bersamaan untuk membandingkan solusi.",
          },
          {
            value: "Jarang pakai AI dan lebih mengandalkan sumber terpercaya atau diskusi dengan teman.",
            label: "Jarang pakai AI dan lebih mengandalkan sumber terpercaya atau diskusi dengan teman.",
          },
        ],
      },
    ],
  },

  // SECTION 3: Ketergantungan terhadap AI (Likert 1–4)
  {
    sectionId: "dependency_index",
    sectionNumber: 3,
    title: "Ketergantungan terhadap AI",
    subtitle: "Pernyataan evaluasi ketergantungan akademik mahasiswa Ilmu Komputer terhadap Generative AI (Skala 1–4).",
    questions: [
      {
        id: "dependency_matrix",
        title: "Matriks Skala Ketergantungan terhadap AI",
        description: "Berikan penilaian terhadap setiap pernyataan berikut berdasarkan kebiasaan Anda (1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Setuju, 4 = Sangat Setuju).",
        type: "likert_matrix",
        statements: [
          {
            id: "dep_1",
            statement: "Saya merasa kesulitan mengerjakan tugas tanpa AI.",
          },
          {
            id: "dep_2",
            statement: "Saya menggunakan AI sebelum mencoba menyelesaikan masalah sendiri.",
          },
          {
            id: "dep_3",
            statement: "Saya merasa pekerjaan menjadi lebih sulit tanpa AI.",
          },
          {
            id: "dep_4",
            statement: "Saya menggunakan AI dalam hampir setiap tugas akademik.",
          },
          {
            id: "dep_5",
            statement: "Saya meminta AI memberikan solusi lengkap untuk tugas saya.",
          },
        ],
      },
    ],
  },

  // SECTION 4: Instrumen Penilaian & Deteksi AI (Case Journal)
  {
    sectionId: "journal_case_study",
    sectionNumber: 4,
    title: "Instrumen Penilaian & Deteksi AI (Case Journal)",
    subtitle: "Uji analisis kritis terhadap 6 sitasi jurnal penelitian (3 jurnal asli dan 3 jurnal hasil fabrikasi AI).",
    questions: [
      {
        id: "journal_case_1",
        title: "Kasus 1 — Pertumbuhan Tanaman Padi Menggunakan Data Sentinel-1 SAR",
        description: "Dirgahayu D, Parsa IM. 2019. Detection phase growth of paddy crop using SAR Sentinel-1 data. IOP Conf Ser Earth Environ Sci. 280(1):012020. doi:10.1088/1755-1315/280/1/012020.",
        type: "single_choice",
        options: [
          { value: "Real", label: "Jurnal Asli (Real)" },
          { value: "Fake", label: "Jurnal Palsu / Hasil Generasi AI (Fake)" },
        ],
      },
      {
        id: "journal_case_2",
        title: "Kasus 2 — Pemantauan Tanaman Padi di Saku, Jepang Menggunakan Data Sentinel-1 SAR",
        description: "Kobayashi S, Ide H. 2022. Rice crop monitoring using Sentinel-1 SAR data: a case study in Saku, Japan. Remote Sens (Basel). 14(14):3254. doi:10.3390/rs14143254.",
        type: "single_choice",
        options: [
          { value: "Real", label: "Jurnal Asli (Real)" },
          { value: "Fake", label: "Jurnal Palsu / Hasil Generasi AI (Fake)" },
        ],
      },
      {
        id: "journal_case_3",
        title: "Kasus 3 — Klasifikasi Tanaman Data Time-Series Sentinel-1 SAR (LSTM, GRU, TCN)",
        description: "Tsuchiya Y, Sonobe R. 2025. Crop classification using time-series Sentinel-1 SAR data: A comparison of LSTM, GRU, and TCN with attention. Remote Sens (Basel). 17(12):2095. doi:10.3390/rs17122095.",
        type: "single_choice",
        options: [
          { value: "Real", label: "Jurnal Asli (Real)" },
          { value: "Fake", label: "Jurnal Palsu / Hasil Generasi AI (Fake)" },
        ],
      },
      {
        id: "journal_case_4",
        title: "Kasus 4 — Pemetaan Fase Fenologis Padi Sawah di Jawa Barat (Random Forest)",
        description: "Kusumawardhani R, Prasetyo LB. 2023. Phenological stage mapping of irrigated lowland rice in West Java using multi-temporal Sentinel-1 C-band SAR backscatter and Random Forest. IOP Conf Ser Earth Environ Sci. 1184(1):012042. doi:10.1088/1755-1315/1184/1/012042.",
        type: "single_choice",
        options: [
          { value: "Real", label: "Jurnal Asli (Real)" },
          { value: "Fake", label: "Jurnal Palsu / Hasil Generasi AI (Fake)" },
        ],
      },
      {
        id: "journal_case_5",
        title: "Kasus 5 — Deteksi Genangan dan Anomali Pertumbuhan Padi Otomatis (Bi-LSTM Networks)",
        description: "Watanabe K, Takahashi M, Sato H. 2024. Automated paddy field inundation and growth anomaly detection using dual-polarized Sentinel-1 SAR time-series and Bi-LSTM networks. Remote Sens (Basel). 16(8):1419. doi:10.3390/rs16081419.",
        type: "single_choice",
        options: [
          { value: "Real", label: "Jurnal Asli (Real)" },
          { value: "Fake", label: "Jurnal Palsu / Hasil Generasi AI (Fake)" },
        ],
      },
      {
        id: "journal_case_6",
        title: "Kasus 6 — Estimasi Hasil Panen Padi Spatio-Temporal Terintegrasi (Transformer Attention)",
        description: "Nugroho S, Wijaya A, Darmawan S. 2025. Spatio-temporal rice yield estimation integrating Sentinel-1 SAR coherence and Transformer-based attention models in tropical agroecosystems. Comput Electron Agric. 218:108714. doi:10.1016/j.compag.2025.108714.",
        type: "single_choice",
        options: [
          { value: "Real", label: "Jurnal Asli (Real)" },
          { value: "Fake", label: "Jurnal Palsu / Hasil Generasi AI (Fake)" },
        ],
      },
      {
        id: "journal_confidence",
        title: "Tingkat Keyakinan Penilaian",
        description: "Seberapa yakin Anda dengan penilaian klasifikasi jurnal yang Anda berikan pada kasus di atas?",
        type: "single_choice",
        options: [
          { value: "Sangat Yakin (100%)", label: "Sangat Yakin (100%)" },
          { value: "Cukup Yakin (75%)", label: "Cukup Yakin (75%)" },
          { value: "Ragu-ragu (50%)", label: "Ragu-ragu (50%)" },
          { value: "Tidak Yakin / Menebak (< 25%)", label: "Tidak Yakin / Menebak (< 25%)" },
        ],
      },
      {
        id: "journal_reasoning",
        title: "Alasan Indikator Analisis (Open-Ended)",
        description: "Indikator utama apa (misal: gaya penulisan DOI, nama pengarang, judul yang terlalu spesifik/generik, nama jurnal) yang membuat Anda menyimpulkan demikian?",
        type: "textarea",
        placeholder: "Jelaskan indikator atau pola yang Anda amati dalam membedakan jurnal asli dan palsu...",
        minChars: 5,
      },
    ],
  },

  // SECTION 5: Kemandirian, Verifikasi, dan Critical Thinking
  {
    sectionId: "independence_verification",
    sectionNumber: 5,
    title: "Kemandirian, Verifikasi, dan Critical Thinking",
    subtitle: "Evaluasi kemandirian nalar, verifikasi materi, dan kesadaran kritis terhadap keluaran AI.",
    questions: [
      {
        id: "critical_thinking_matrix",
        title: "Matriks Skala Kemandirian, Verifikasi, dan Critical Thinking",
        description: "Berikan penilaian terhadap setiap pernyataan berikut (1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Setuju, 4 = Sangat Setuju).",
        type: "likert_matrix",
        statements: [
          {
            id: "crit_1",
            statement: "Saya mencoba mengerjakan tugas kuliah sendiri tanpa menggunakan AI, baru setelah itu memastikan jawaban yang benar dengan AI.",
          },
          {
            id: "crit_2",
            statement: "Saya yakin dapat menyelesaikan tugas kuliah tanpa AI.",
          },
          {
            id: "crit_3",
            statement: "Saya melakukan verifikasi jawaban AI dengan materi yang telah dipelajari di perkuliahan.",
          },
          {
            id: "crit_4",
            statement: "Saya merasa kemampuan berpikir saya menurun setelah sering menggunakan AI.",
          },
          {
            id: "crit_5",
            statement: "Saya membatasi diri untuk membuka AI hanya ketika saya benar-benar menemukan jalan buntu.",
          },
          {
            id: "crit_6",
            statement: "Saya menggunakan AI sebagai alat bantu menemukan proses pengerjaan, bukan untuk sekedar meminta jawaban hasil akhir.",
          },
          {
            id: "crit_7",
            statement: "Saya langsung mempercayai penjelasan AI ketika penjelasannya terdengar sangat logis dan meyakinkan tanpa mengecek sumber dokumentasi resminya.",
          },
          {
            id: "crit_8",
            statement: "Saya mampu membedakan mana jawaban AI yang benar dan mana yang sekadar terlihat benar padahal salah.",
          },
          {
            id: "crit_9",
            statement: "Saya pernah mengumpulkan tugas hasil jawaban AI yang ternyata mengandung kesalahan logika fatal tanpa saya sadari sebelumnya.",
          },
          {
            id: "crit_10",
            statement: "Saya dapat menjelaskan alur jawaban AI dalam tugas kuliah saya ketika dosen/asprak bertanya tentang jawaban tugas kuliah saya.",
          },
        ],
      },
    ],
  },

  // SECTION 6: Dampak terhadap Pemahaman dan Proses Belajar
  {
    sectionId: "learning_process",
    sectionNumber: 6,
    title: "Dampak AI terhadap Pemahaman dan Proses Belajar",
    subtitle: "Pengaruh AI terhadap retensi konsep, pemahaman materi programming, dan disiplin belajar mandiri.",
    questions: [
      {
        id: "learning_impact_matrix",
        title: "Penilaian Pengalaman Menggunakan Generative AI dalam Pembelajaran",
        description: "Berikan penilaian terhadap setiap pernyataan berikut berdasarkan pengalaman Anda (1 = Sangat Tidak Setuju s.d. 4 = Sangat Setuju).",
        type: "likert_matrix",
        statements: [
          {
            id: "learn_1",
            statement: "AI membantu saya memahami materi perkuliahan yang sulit dijelaskan melalui metode pembelajaran biasa.",
          },
          {
            id: "learn_2",
            statement: "Penggunaan AI membantu saya memahami konsep programming melalui contoh penerapan yang lebih konkret.",
          },
          {
            id: "learn_3",
            statement: "Saya lebih mudah memahami suatu konsep ketika AI menjelaskannya menggunakan contoh kasus yang berkaitan dengan kehidupan nyata.",
          },
          {
            id: "learn_4",
            statement: "Saya dapat mengingat kembali materi yang telah dipelajari melalui bantuan penjelasan AI.",
          },
          {
            id: "learn_5",
            statement: "Penjelasan AI membantu saya memahami hubungan antara satu konsep pemrograman dengan konsep lainnya.",
          },
          {
            id: "learn_6",
            statement: "Saya merasa penggunaan AI membuat proses belajar menjadi lebih berorientasi pada penyelesaian tugas daripada pemahaman materi.",
          },
          {
            id: "learn_7",
            statement: "Saya cenderung melewatkan materi perkuliahan karena merasa penjelasan dari AI sudah cukup untuk memahami topik tersebut.",
          },
          {
            id: "learn_8",
            statement: "Saya merasa lebih cepat menyelesaikan tugas menggunakan AI, tetapi belum tentu memahami materi yang dikerjakan.",
          },
          {
            id: "learn_9",
            statement: "Penggunaan AI mendorong saya untuk mengeksplorasi topik atau materi lain di luar yang diberikan dalam perkuliahan.",
          },
        ],
      },
      {
        id: "learn_practice_frequency",
        title: "Penerapan Mandiri Materi Perkuliahan",
        description: "Setelah menggunakan Generative AI untuk mempelajari suatu materi perkuliahan, seberapa sering Anda mencoba menerapkan kembali konsep tersebut secara mandiri melalui latihan soal atau praktik programming?",
        type: "single_choice",
        options: [
          { value: "Selalu", label: "Selalu" },
          { value: "Sering", label: "Sering" },
          { value: "Kadang-kadang", label: "Kadang-kadang" },
          { value: "Jarang", label: "Jarang" },
          { value: "Tidak Pernah", label: "Tidak Pernah" },
        ],
      },
    ],
  },

  // SECTION 7: Persepsi dan Batas Penggunaan AI
  {
    sectionId: "perceptions_boundaries",
    sectionNumber: 7,
    title: "Persepsi dan Batas Penggunaan AI",
    subtitle: "Pandangan mahasiswa mengenai batasan kewajaran dan titik kritis ketergantungan AI dalam akademik.",
    questions: [
      {
        id: "boundary_explain_material",
        title: "Menurut Anda, apakah meminta Generative AI menjelaskan materi kuliah yang sulit dipahami merupakan penggunaan AI yang wajar dalam kegiatan akademik?",
        type: "single_choice",
        options: [
          { value: "Ya, sangat wajar", label: "Ya, sangat wajar" },
          { value: "Cukup wajar, tergantung situasi", label: "Cukup wajar, tergantung situasi" },
          { value: "Kurang wajar", label: "Kurang wajar" },
          { value: "Tidak wajar", label: "Tidak wajar" },
        ],
      },
      {
        id: "boundary_sample_code",
        title: "Menurut Anda, apakah meminta Generative AI membuat contoh kode untuk membantu memahami suatu konsep programming merupakan penggunaan AI yang wajar?",
        type: "single_choice",
        options: [
          { value: "Ya, sangat wajar", label: "Ya, sangat wajar" },
          { value: "Cukup wajar, tergantung situasi", label: "Cukup wajar, tergantung situasi" },
          { value: "Kurang wajar", label: "Kurang wajar" },
          { value: "Tidak wajar", label: "Tidak wajar" },
        ],
      },
      {
        id: "boundary_debugging",
        title: "Menurut Anda, apakah menggunakan Generative AI untuk memperbaiki atau melakukan debugging terhadap kode program merupakan penggunaan AI yang wajar?",
        type: "single_choice",
        options: [
          { value: "Ya, sangat wajar", label: "Ya, sangat wajar" },
          { value: "Cukup wajar, tergantung situasi", label: "Cukup wajar, tergantung situasi" },
          { value: "Kurang wajar", label: "Kurang wajar" },
          { value: "Tidak wajar", label: "Tidak wajar" },
        ],
      },
      {
        id: "boundary_entire_assignment",
        title: "Menurut Anda, apakah meminta Generative AI menyelesaikan seluruh tugas akademik tanpa keterlibatan pemikiran sendiri merupakan penggunaan AI yang wajar?",
        type: "single_choice",
        options: [
          { value: "Ya, sangat wajar", label: "Ya, sangat wajar" },
          { value: "Cukup wajar, tergantung situasi", label: "Cukup wajar, tergantung situasi" },
          { value: "Kurang wajar", label: "Kurang wajar" },
          { value: "Tidak wajar", label: "Tidak wajar" },
        ],
      },
      {
        id: "boundary_threshold_essay",
        title: "Titik Kritis Transformasi Ketergantungan AI",
        description: "Menurut Anda, pada titik apa penggunaan Generative AI berubah dari sekadar alat bantu belajar menjadi bentuk ketergantungan?",
        type: "textarea",
        placeholder: "Tuliskan pandangan reflektif Anda mengenai batas kritis ketergantungan AI...",
        minChars: 5,
      },
    ],
  },

  // SECTION 8: AI dan Masa Depan Mahasiswa Ilkom
  {
    sectionId: "future_readiness",
    sectionNumber: 8,
    title: "AI dan Masa Depan Mahasiswa Ilkom",
    subtitle: "Kebutuhan kompetensi kerja, tantangan fundamental programming, dan program penguatan HIMALKOM.",
    questions: [
      {
        id: "future_readiness_matrix",
        title: "Persiapan dan Pandangan Masa Depan di Bidang Ilmu Komputer",
        description: "Berikan penilaian terhadap setiap pernyataan berikut (1 = Sangat Tidak Setuju s.d. 4 = Sangat Setuju).",
        type: "likert_matrix",
        statements: [
          {
            id: "future_labor_change",
            statement: "Perkembangan teknologi AI akan membawa perubahan signifikan terhadap kebutuhan tenaga kerja di bidang Ilmu Komputer.",
          },
          {
            id: "future_ai_competence",
            statement: "Kemampuan memanfaatkan teknologi AI secara tepat merupakan salah satu kompetensi yang perlu dimiliki lulusan Ilmu Komputer.",
          },
          {
            id: "future_core_cs_needed",
            statement: "Pemahaman terhadap konsep dasar pemrograman tetap diperlukan meskipun teknologi AI semakin mampu membantu proses pengembangan perangkat lunak.",
          },
          {
            id: "future_problem_solving_key",
            statement: "Kemampuan menganalisis dan menemukan solusi atas suatu permasalahan tetap menjadi kompetensi utama mahasiswa Ilmu Komputer di era AI.",
          },
          {
            id: "future_continuous_learning",
            statement: "Saya perlu terus meningkatkan kompetensi diri agar mampu beradaptasi dengan perubahan kebutuhan di bidang Ilmu Komputer akibat perkembangan AI.",
          },
        ],
      },
      {
        id: "future_most_important_skill",
        title: "Menurut Anda, kemampuan apa yang paling penting untuk dikembangkan mahasiswa Ilmu Komputer agar tetap relevan di tengah perkembangan AI?",
        type: "multiple_choice",
        options: [
          {
            value: "A. Fundamental programming dan pemahaman algoritma.",
            label: "A. Fundamental programming dan pemahaman algoritma.",
          },
          {
            value: "B. Problem solving dan critical thinking.",
            label: "B. Problem solving dan critical thinking.",
          },
          {
            value: "C. Kemampuan menggunakan dan mengoptimalkan teknologi AI.",
            label: "C. Kemampuan menggunakan dan mengoptimalkan teknologi AI.",
          },
          {
            value: "D. Kemampuan beradaptasi dan mempelajari teknologi baru.",
            label: "D. Kemampuan beradaptasi dan mempelajari teknologi baru.",
          },
        ],
      },
      {
        id: "future_biggest_challenge",
        title: "Menurut Anda, aspek apa yang paling menjadi tantangan bagi mahasiswa Ilmu Komputer dalam menghadapi perkembangan AI di masa depan?",
        type: "multiple_choice",
        options: [
          {
            value: "A. Beradaptasi dengan perubahan kebutuhan kompetensi di dunia kerja.",
            label: "A. Beradaptasi dengan perubahan kebutuhan kompetensi di dunia kerja.",
          },
          {
            value: "B. Mempertahankan kemampuan fundamental programming di tengah otomatisasi.",
            label: "B. Mempertahankan kemampuan fundamental programming di tengah otomatisasi.",
          },
          {
            value: "C. Mengembangkan kemampuan berpikir kritis dan problem solving.",
            label: "C. Mengembangkan kemampuan berpikir kritis dan problem solving.",
          },
          {
            value: "D. Mengikuti perkembangan teknologi AI yang semakin cepat.",
            label: "D. Mengikuti perkembangan teknologi AI yang semakin cepat.",
          },
        ],
      },
      {
        id: "future_needed_programs",
        title: "Program atau kegiatan apa yang paling dibutuhkan untuk membantu mahasiswa Ilmu Komputer menghadapi perkembangan AI?",
        type: "multiple_choice",
        options: [
          {
            value: "A. Workshop penggunaan AI untuk pembelajaran dan programming.",
            label: "A. Workshop penggunaan AI untuk pembelajaran dan programming.",
          },
          {
            value: "B. Pelatihan fundamental programming dan problem solving di era AI.",
            label: "B. Pelatihan fundamental programming dan problem solving di era AI.",
          },
          {
            value: "C. Seminar atau diskusi mengenai perkembangan AI dan dampaknya terhadap dunia kerja.",
            label: "C. Seminar atau diskusi mengenai perkembangan AI dan dampaknya terhadap dunia kerja.",
          },
          {
            value: "D. Proyek kolaboratif atau kompetisi yang mengintegrasikan teknologi AI.",
            label: "D. Proyek kolaboratif atau kompetisi yang mengintegrasikan teknologi AI.",
          },
        ],
      },
      {
        id: "future_ideal_graduate_profile",
        title: "Profil Lulusan Ilmu Komputer yang Ideal",
        description: "Menurut Anda, bagaimana profil lulusan Ilmu Komputer yang ideal untuk menghadapi perkembangan teknologi AI di masa depan?",
        type: "textarea",
        placeholder: "Deskripsikan profil kompetensi dan karakter lulusan Ilmu Komputer ideal menurut Anda...",
        minChars: 5,
      },
    ],
  },

  // SECTION 9: Saran (Wajib)
  {
    sectionId: "recommendations",
    sectionNumber: 9,
    title: "Saran dan Masukan (Wajib)",
    subtitle: "Aspirasi dan refleksi terbuka mahasiswa untuk lingkungan akademik dan kebijakan HIMALKOM IPB.",
    questions: [
      {
        id: "feedback_task_practical_usage",
        title: "Bagaimana pendapat Anda mengenai penggunaan AI dalam pengerjaan tugas, praktikum, maupun proyek perkuliahan?",
        description: "Uraikan pandangan Anda terkait etika, batasan, serta efektivitas penggunaan AI dalam perkuliahan.",
        type: "textarea",
        placeholder: "Tuliskan pandangan Anda secara terbuka...",
        minChars: 5,
      },
      {
        id: "feedback_independent_thinking",
        title: "Apa yang sebaiknya dilakukan mahasiswa agar tetap memiliki kemampuan berpikir mandiri di tengah perkembangan teknologi AI?",
        description: "Uraikan tips, kebiasaan, atau strategi yang Anda terapkan atau sarankan untuk rekan mahasiswa.",
        type: "textarea",
        placeholder: "Tuliskan saran dan strategi Anda...",
        minChars: 5,
      },
      {
        id: "feedback_lecturer_academic_response",
        title: "Menurut Anda, bagaimana seharusnya dosen dan lingkungan akademik menyikapi penggunaan AI oleh mahasiswa?",
        description: "Uraikan usulan kebijakan akademik, format penugasan, atau pendekatan pengajaran yang ideal.",
        type: "textarea",
        placeholder: "Tuliskan usulan dan harapan Anda untuk dosen dan fakultas...",
        minChars: 5,
      },
    ],
  },
];
