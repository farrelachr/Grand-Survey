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
    subtitle: "Konfirmasi angkatan, peminatan bidang ilmu komputer, dan profil awal penggunaan AI.",
    questions: [
      {
        id: "respondent_name",
        title: "Nama Lengkap Responden",
        description: "Tuliskan nama lengkap Anda (digunakan untuk verifikasi internal riset dan pengundian doorprize responden).",
        type: "text",
        placeholder: "Masukkan nama lengkap Anda...",
        minChars: 2,
      },
      {
        id: "cohort_confirmation",
        title: "Angkatan Responden",
        description: "Pilih angkatan Anda sebagai mahasiswa Program Studi Ilmu Komputer IPB University.",
        type: "single_choice",
        options: [
          { value: "Angkatan 60 (2023)", label: "Mahasiswa Ilmu Komputer IPB Angkatan 60 (2023)" },
          { value: "Angkatan 61 (2024)", label: "Mahasiswa Ilmu Komputer IPB Angkatan 61 (2024)" },
          { value: "Angkatan 62 (2025)", label: "Mahasiswa Ilmu Komputer IPB Angkatan 62 (2025)" },
          { value: "Angkatan 63 (2026)", label: "Mahasiswa Ilmu Komputer IPB Angkatan 63 (2026)" },
          { value: "Lainnya", label: "Lainnya / Program Studi Lain" },
        ],
      },
      {
        id: "cs_interest",
        title: "Bidang Minat Utama di Ilmu Komputer",
        description: "Pilih bidang yang paling mendekati minat akademik atau rencana karier Anda saat ini.",
        type: "single_choice",
        options: [
          { value: "Software Engineering & Web/Mobile Dev", label: "Software Engineering & Pengembangan Web/Mobile" },
          { value: "Artificial Intelligence, Data Science & ML", label: "Artificial Intelligence, Data Science & Machine Learning" },
          { value: "Cybersecurity & Digital Forensics", label: "Cybersecurity & Digital Forensics" },
          { value: "Cloud Computing & Computer Networks", label: "Cloud Computing, Computer Systems & Jaringan" },
          { value: "Human-Computer Interaction (HCI) & UI/UX", label: "Human-Computer Interaction (HCI) & UI/UX" },
          { value: "Game Development & Computer Graphics", label: "Game Development & Computer Graphics" },
          { value: "Algorithms & Theoretical Computer Science", label: "Algoritma & Teori Komputasi" },
          { value: "Belum menentukan minat spesifik", label: "Belum menentukan minat spesifik / Masih mengeksplorasi" },
        ],
      },
      {
        id: "ai_usage_frequency",
        title: "Frekuensi Penggunaan Alat AI untuk Kegiatan Akademik",
        description: "Seberapa sering Anda menggunakan generative AI (ChatGPT, Claude, Copilot, dll.) dalam perkuliahan atau tugas?",
        type: "single_choice",
        options: [
          { value: "Setiap hari (beberapa kali sehari)", label: "Setiap hari (beberapa kali dalam sehari)" },
          { value: "Hampir setiap hari (4-6 hari per minggu)", label: "Hampir setiap hari (4–6 hari per minggu)" },
          { value: "Beberapa kali seminggu (2-3 hari per minggu)", label: "Beberapa kali seminggu (2–3 hari per minggu)" },
          { value: "Jarang (1-3 kali per bulan)", label: "Jarang (1–3 kali dalam sebulan)" },
          { value: "Hampir tidak pernah / hanya mencoba", label: "Hampir tidak pernah / hanya sesekali mencoba" },
        ],
      },
      {
        id: "ai_tools_used",
        title: "Alat AI yang Pernah Anda Gunakan",
        description: "Pilih semua alat AI yang pernah Anda manfaatkan untuk keperluan belajar atau perkuliahan.",
        type: "multiple_choice",
        options: [
          { value: "ChatGPT (OpenAI)", label: "ChatGPT (OpenAI — GPT-4o / GPT-3.5)" },
          { value: "Claude (Anthropic)", label: "Claude (Anthropic — Sonnet / Opus)" },
          { value: "GitHub Copilot", label: "GitHub Copilot (Integrasi IDE / VS Code)" },
          { value: "Google Gemini", label: "Google Gemini" },
          { value: "Perplexity AI", label: "Perplexity AI (Mesin pencari berbasis AI)" },
          { value: "Cursor / v0 / Windsurf", label: "AI Code Editor (Cursor, Windsurf, v0.dev)" },
          { value: "DeepSeek", label: "DeepSeek (Coder / V3 / R1)" },
          { value: "Lainnya", label: "Alat AI lainnya" },
        ],
      },
    ],
  },

  // SECTION 2: Pola Penggunaan AI
  {
    sectionId: "usage_patterns",
    sectionNumber: 2,
    title: "Pola Penggunaan AI",
    subtitle: "Karakteristik alat utama, rutinitas mingguan, dan konteks pemanfaatan AI dalam perkuliahan.",
    questions: [
      {
        id: "primary_ai_tool",
        title: "Alat AI yang Paling Sering Diandalkan",
        description: "Pilih satu alat AI yang menjadi pilihan utama Anda dalam aktivitas belajar sehari-hari.",
        type: "single_choice",
        options: [
          { value: "ChatGPT", label: "ChatGPT" },
          { value: "Claude", label: "Claude" },
          { value: "GitHub Copilot", label: "GitHub Copilot" },
          { value: "DeepSeek", label: "DeepSeek" },
          { value: "Google Gemini", label: "Google Gemini" },
          { value: "Perplexity AI", label: "Perplexity AI" },
          { value: "Cursor / AI Editor", label: "Cursor / AI Editor khusus" },
          { value: "Lainnya", label: "Lainnya" },
        ],
      },
      {
        id: "weekly_ai_frequency",
        title: "Estimasi Waktu Penggunaan AI Per Minggu untuk Tugas Kuliah",
        description: "Perkiraan akumulasi waktu yang Anda alokasikan berinteraksi dengan AI dalam seminggu.",
        type: "single_choice",
        options: [
          { value: "< 2 jam per minggu", label: "< 2 jam per minggu (minimal)" },
          { value: "2 - 5 jam per minggu", label: "2 – 5 jam per minggu (moderat)" },
          { value: "6 - 10 jam per minggu", label: "6 – 10 jam per minggu (cukup intensif)" },
          { value: "11 - 20 jam per minggu", label: "11 – 20 jam per minggu (intensif)" },
          { value: "> 20 jam per minggu", label: "> 20 jam per minggu (sangat intensif)" },
        ],
      },
      {
        id: "academic_activities",
        title: "Aktivitas Akademik di Mana Anda Memanfaatkan AI",
        description: "Pilih semua skenario akademik yang relevan dengan kebiasaan Anda.",
        type: "multiple_choice",
        options: [
          { value: "Mengerjakan tugas coding / algoritma praktikum", label: "Mengerjakan tugas coding / praktikum pemrograman" },
          { value: "Memahami materi kuliah dan konsep teori", label: "Memahami konsep materi kuliah dan bahan bacaan" },
          { value: "Menyusun draf laporan, makalah, atau resume", label: "Menyusun draf laporan praktikum, makalah, atau essay" },
          { value: "Mencari ide atau solusi arsitektur proyek", label: "Brainstorming ide atau perancangan arsitektur proyek" },
          { value: "Persiapan kuis, UTS, atau UAS", label: "Latihan soal dan persiapan ujian (Kuis, UTS, UAS)" },
          { value: "Menerjemahkan atau meringkas jurnal/artikel ilmiah", label: "Menerjemahkan atau menyarikan literatur ilmiah" },
        ],
      },
      {
        id: "usage_triggers",
        title: "Faktor atau Kondisi yang Memicu Anda Menggunakan AI",
        description: "Kondisi apa saja yang biasanya mendorong Anda membuka alat AI? (Boleh pilih lebih dari satu)",
        type: "multiple_choice",
        options: [
          { value: "Menghadapi error / bug yang sulit dipecahkan", label: "Menghadapi error / bug yang sudah dicoba namun gagal" },
          { value: "Tenggat waktu (deadline) tugas yang sudah mepet", label: "Tenggat waktu (deadline) tugas yang sangat mendesak" },
          { value: "Penjelasan dosen / materi di kelas terasa kurang jelas", label: "Penjelasan di kelas atau slide kuliah kurang jelas" },
          { value: "Ingin menghemat waktu untuk tugas-tugas repetitif", label: "Ingin efisiensi waktu pada tugas yang bersifat repetitif" },
          { value: "Merasa malas menulis kode dasar atau boilerplate dari awal", label: "Enggan mengetik kode dasar (boilerplate) dari nol" },
          { value: "Rasa cemas tertinggal dari teman yang memakai AI", label: "Kekhawatiran tertinggal dari rekan yang memakai AI" },
        ],
      },
      {
        id: "session_duration",
        title: "Durasi Tipikal Satu Sesi Penggunaan AI",
        description: "Berapa lama rata-rata satu sesi Anda membuka dan berdialog dengan AI?",
        type: "single_choice",
        options: [
          { value: "Singkat (< 15 menit, hanya quick check)", label: "Singkat (< 15 menit, hanya untuk verifikasi cepat / sintaks)" },
          { value: "Sedang (15 - 30 menit)", label: "Sedang (15 – 30 menit, eksplorasi solusi spesifik)" },
          { value: "Cukup lama (30 - 60 menit)", label: "Cukup lama (30 – 60 menit, memecahkan masalah kompleks)" },
          { value: "Panjang (> 1 jam, berkelanjutan)", label: "Panjang (> 1 jam, AI selalu terbuka selama sesi belajar)" },
        ],
      },
      {
        id: "ai_vs_traditional",
        title: "Perbandingan Ketergantungan: AI vs Sumber Belajar Tradisional",
        description: "Bila dibandingkan antara AI dengan sumber konvensional (buku, dokumentasi resmi, dosen, asisten, diskusi teman):",
        type: "single_choice",
        options: [
          { value: "Jauh lebih mengutamakan AI daripada sumber konvensional", label: "Jauh lebih mengutamakan AI dibanding dokumentasi/buku/dosen" },
          { value: "Proporsional seimbang antara AI dan sumber konvensional", label: "Seimbang: AI sebagai pendamping bersama dokumentasi dan dosen" },
          { value: "Lebih mengutamakan sumber konvensional, AI hanya opsi darurat", label: "Lebih mengutamakan dokumentasi resmi/buku, AI sekadar pelengkap" },
        ],
      },
    ],
  },

  // SECTION 3: Ketergantungan terhadap AI (The 8 Likert Statements for Primary Score)
  {
    sectionId: "dependency_index",
    sectionNumber: 3,
    title: "Ketergantungan terhadap AI (Indeks Utama)",
    subtitle: "Pernyataan berikut mengevaluasi kemandirian akademik dan kecenderungan ketergantungan. Pilihlah tingkat persetujuan yang paling mencerminkan kondisi riil Anda.",
    questions: [
      {
        id: "likert_dependency_group",
        title: "Matriks Pernyataan Sikap dan Perilaku Belajar",
        description: "Pilih 1 (Sangat Tidak Setuju) hingga 4 (Sangat Setuju) untuk masing-masing butir pernyataan:",
        type: "likert_matrix",
        statements: [
          {
            id: "dep_1",
            statement: "1. Saya merasa kesulitan menyelesaikan tugas akademik tanpa bantuan AI.",
            isReversed: false,
          },
          {
            id: "dep_2",
            statement: "2. Saya cenderung langsung menggunakan AI sebelum mencoba memikirkan solusi sendiri.",
            isReversed: false,
          },
          {
            id: "dep_3",
            statement: "3. Pekerjaan akademik saya terasa jauh lebih berat apabila tidak ada AI.",
            isReversed: false,
          },
          {
            id: "dep_4",
            statement: "4. Saya menggunakan AI untuk hampir setiap tugas akademik yang saya kerjakan.",
            isReversed: false,
          },
          {
            id: "dep_5",
            statement: "5. Saya meminta AI untuk memberikan solusi lengkap tugas saya.",
            isReversed: false,
          },
          {
            id: "dep_6",
            statement: "6. Saya tetap mampu menyelesaikan tugas akademik dengan baik meskipun tanpa AI.",
            isReversed: true, // Reverse scored!
          },
          {
            id: "dep_7",
            statement: "7. Saya selalu berusaha menyelesaikan masalah secara mandiri terlebih dahulu sebelum bertanya ke AI.",
            isReversed: true, // Reverse scored!
          },
          {
            id: "dep_8",
            statement: "8. Saya memperlakukan AI sebagai alat bantu berpikir, bukan pengganti proses berpikir saya.",
            isReversed: true, // Reverse scored!
          },
        ],
      },
    ],
  },

  // SECTION 4: AI dalam Coding dan Problem Solving
  {
    sectionId: "coding_problem_solving",
    sectionNumber: 4,
    title: "AI dalam Coding dan Problem Solving",
    subtitle: "Eksplorasi mendalam terkait kebiasaan penulisan kode, penanganan error, dan validasi solusi teknis.",
    questions: [
      {
        id: "coding_first_action",
        title: "Aksi Pertama yang Anda Lakukan Saat Menemukan Error / Bug Coding",
        description: "Ketika program Anda menghasilkan pesan error atau crash:",
        type: "single_choice",
        options: [
          { value: "Langsung copy-paste pesan error ke AI", label: "Langsung menyalin (copy-paste) pesan error atau kode ke AI" },
          { value: "Membaca pesan error dan stack trace mandiri terlebih dahulu", label: "Membaca baris error & stack trace mandiri untuk mendiagnosis sendiri" },
          { value: "Mencari di mesin pencari / StackOverflow / dokumentasi bahasa", label: "Mencari kode error di dokumentasi resmi atau StackOverflow" },
          { value: "Bertanya kepada teman kuliah atau asisten praktikum", label: "Berdiskusi langsung dengan rekan kuliah atau asisten praktikum" },
        ],
      },
      {
        id: "code_generation_frequency",
        title: "Frekuensi Meminta AI Menghasilkan Potongan Kode Lengkap",
        description: "Seberapa sering Anda meminta AI menuliskan seluruh fungsi, algoritma, atau modul program?",
        type: "single_choice",
        options: [
          { value: "Sangat sering (hampir setiap tugas coding)", label: "Sangat sering (hampir setiap tugas coding)" },
          { value: "Sering (pada tugas yang kompleks atau panjang)", label: "Sering (pada tugas yang kompleks atau panjang)" },
          { value: "Kadang-kadang (hanya untuk fungsi pembantu/boilerplate)", label: "Kadang-kadang (hanya untuk fungsi pembantu / boilerplate)" },
          { value: "Jarang (hanya saat benar-benar buntu)", label: "Jarang (hanya saat benar-benar buntu)" },
          { value: "Tidak pernah (selalu menulis kode sendiri dari awal)", label: "Tidak pernah (selalu mengetik kode sendiri dari awal)" },
        ],
      },
      {
        id: "code_debugging_frequency",
        title: "Frekuensi Menggunakan AI untuk Menemukan dan Memperbaiki Bug (Debugging)",
        description: "Seberapa sering Anda memanfaatkan AI sebagai alat utama debugging?",
        type: "single_choice",
        options: [
          { value: "Selalu (menjadi langkah pertama setiap kali ada bug)", label: "Selalu (menjadi langkah pertama setiap kali ada bug)" },
          { value: "Sering", label: "Sering" },
          { value: "Kadang-kadang (jika bug tidak ketemu setelah 15-30 menit)", label: "Kadang-kadang (jika bug tidak ketemu setelah dicoba sendiri)" },
          { value: "Jarang (lebih suka print debugging / debugger IDE)", label: "Jarang (lebih suka print debugging / debugger bawaan IDE)" },
          { value: "Tidak pernah", label: "Tidak pernah" },
        ],
      },
      {
        id: "code_explanation_frequency",
        title: "Frekuensi Meminta AI Menjelaskan Maksud Kode atau Algoritma",
        description: "Seberapa sering Anda meminta AI menguraikan cara kerja baris kode tertentu?",
        type: "single_choice",
        options: [
          { value: "Sangat sering (selalu meminta breakdown penjelasan)", label: "Sangat sering (selalu meminta breakdown penjelasan)" },
          { value: "Sering", label: "Sering" },
          { value: "Kadang-kadang", label: "Kadang-kadang" },
          { value: "Jarang", label: "Jarang" },
          { value: "Tidak pernah (hanya mengambil kodenya saja)", label: "Tidak pernah (hanya mengambil kodenya tanpa membaca penjelasan)" },
        ],
      },
      {
        id: "ability_explain_ai_code",
        title: "Kemampuan Anda Menjelaskan Kode yang Dihasilkan oleh AI",
        description: "Jika dosen atau asisten praktikum menguji Anda secara lisan tentang setiap baris kode buatan AI:",
        type: "single_choice",
        options: [
          { value: "Sangat mampu (saya memahami 100% logika dan alasan kodenya)", label: "Sangat mampu: memahami 100% logika, sintaks, dan dampaknya" },
          { value: "Cukup mampu (memahami garis besar alurnya, detailnya sedikit ragu)", label: "Cukup mampu: memahami alur logika garis besar, detail kecil agak ragu" },
          { value: "Kurang mampu (hanya tahu kode tersebut menghasilkan output yang diminta)", label: "Kurang mampu: hanya tahu kode tersebut berhasil berjalan" },
          { value: "Tidak mampu (sulit menjelaskan kembali jika ditanya mendalam)", label: "Tidak mampu: sulit menjelaskan jika ditanya secara mendalam" },
        ],
      },
      {
        id: "use_ununderstood_code",
        title: "Pengalaman Mengumpulkan / Memakai Kode AI Tanpa Memahaminya",
        description: "Pernahkah Anda menyalin kode dari AI langsung ke tugas praktikum tanpa memahami cara kerjanya?",
        type: "single_choice",
        options: [
          { value: "Sering terjadi karena tuntutan waktu", label: "Sering terjadi karena tuntutan waktu / deadline" },
          { value: "Pernah beberapa kali", label: "Pernah beberapa kali pada tugas yang rumit" },
          { value: "Pernah satu atau dua kali saja", label: "Pernah satu atau dua kali saja" },
          { value: "Tidak pernah (selalu memastikan paham sebelum memakai)", label: "Tidak pernah (selalu memastikan paham sebelum memakai)" },
        ],
      },
      {
        id: "test_ai_code_before_use",
        title: "Verifikasi dan Pengujian Kode Buatan AI Sebelum Digunakan",
        description: "Bagaimana kebiasaan Anda menguji kode yang disarankan oleh AI?",
        type: "single_choice",
        options: [
          { value: "Selalu diuji menyeluruh dengan berbagai test case dan edge case", label: "Selalu diuji menyeluruh dengan test case normal dan edge case" },
          { value: "Diuji sekilas hanya dengan contoh input dari soal tugas", label: "Diuji sekilas hanya dengan contoh masukan dari soal tugas" },
          { value: "Hanya dipastikan tidak syntax error / langsung dijalankan", label: "Hanya dipastikan tidak syntax error / langsung compile" },
          { value: "Kadang langsung dikirim tanpa sempat dites menyeluruh", label: "Kadang langsung dipakai tanpa sempat pengetesan menyeluruh" },
        ],
      },
    ],
  },

  // SECTION 5: AI dan Proses Belajar
  {
    sectionId: "learning_process",
    sectionNumber: 5,
    title: "AI dan Proses Belajar",
    subtitle: "Dampak alat kecerdasan buatan terhadap pemahaman konsep dasar, retensi materi, dan kebiasaan belajar.",
    questions: [
      {
        id: "likert_learning_group",
        title: "Evaluasi Dampak AI terhadap Proses Kognitif dan Belajar",
        description: "Pilih tingkat persetujuan Anda (1: Sangat Tidak Setuju, 2: Tidak Setuju, 3: Setuju, 4: Sangat Setuju):",
        type: "likert_matrix",
        statements: [
          {
            id: "learn_faster_concepts",
            statement: "1. AI membantu saya memahami konsep kuliah lebih cepat dibanding belajar sendiri dari slide.",
          },
          {
            id: "learn_difficult_concepts",
            statement: "2. AI mampu menguraikan konsep yang abstrak / rumit menjadi analogi yang mudah dicerna.",
          },
          {
            id: "learn_alternative_approaches",
            statement: "3. Berdiskusi dengan AI membuka wawasan alternatif solusi algoritma yang tidak saya duga.",
          },
          {
            id: "learn_reduced_reliance_others",
            statement: "4. Ketersediaan AI membuat saya semakin jarang membaca buku teks, dokumentasi resmi, atau slide kuliah.",
          },
          {
            id: "learn_prioritize_completion",
            statement: "5. Saya cenderung lebih memprioritaskan tugas cepat selesai dibanding memahami materinya secara mendalam.",
          },
          {
            id: "learn_attempt_understand",
            statement: "6. Meskipun AI telah memberikan jawaban siap pakai, saya tetap meluangkan waktu mempelajari konsep dasarnya.",
          },
        ],
      },
      {
        id: "learn_encountered_hallucination",
        title: "Pengalaman Menjumpai Informasi Keliru / Halusinasi dari AI",
        description: "Seberapa sering Anda mendapati AI memberikan sintaks yang tidak valid, konsep yang keliru, atau referensi palsu?",
        type: "single_choice",
        options: [
          { value: "Sangat sering (saya harus selalu waspada)", label: "Sangat sering (saya harus selalu waspada memeriksa)" },
          { value: "Cukup sering", label: "Cukup sering pada pertanyaan konsep mendalam" },
          { value: "Jarang", label: "Jarang (kebanyakan jawaban AI terbukti benar)" },
          { value: "Hampir tidak pernah menyadari adanya kekeliruan", label: "Hampir tidak pernah menyadari adanya kekeliruan" },
        ],
      },
    ],
  },

  // SECTION 6: Kemandirian, Verifikasi, dan Critical Thinking
  {
    sectionId: "independence_verification",
    sectionNumber: 6,
    title: "Kemandirian, Verifikasi, dan Critical Thinking",
    subtitle: "Tingkat kesadaran kritis, proses validasi informasi, dan kemandirian intelektual responden.",
    questions: [
      {
        id: "likert_critical_group",
        title: "Matriks Kemandirian Intelektual dan Verifikasi",
        description: "Pilih tingkat persetujuan Anda (1: Sangat Tidak Setuju, 2: Tidak Setuju, 3: Setuju, 4: Sangat Setuju):",
        type: "likert_matrix",
        statements: [
          {
            id: "crit_1",
            statement: "1. Saya yakin dengan kapasitas diri saya menyelesaikan tugas dan ujian tanpa keterlibatan AI.",
          },
          {
            id: "crit_2",
            statement: "2. Saya mampu menelusuri dokumentasi teknis dan referensi primer secara mandiri saat AI tidak dapat diakses.",
          },
          {
            id: "crit_3",
            statement: "3. Saya memiliki kapabilitas untuk mengidentifikasi kekeliruan logika dalam jawaban yang disodorkan AI.",
          },
          {
            id: "crit_4",
            statement: "4. Saya selalu melakukan pengecekan ulang (fact-checking) sebelum mempercayai klaim teknis dari AI.",
          },
          {
            id: "crit_5",
            statement: "5. Untuk materi penting, saya membandingkan uraian AI dengan literatur akademik, buku teks, atau dokumentasi resmi.",
          },
          {
            id: "crit_6",
            statement: "6. Saya mewajibkan diri saya mengerti alur penalaran jawaban AI sebelum mengimplementasikannya ke tugas.",
          },
          {
            id: "crit_7",
            statement: "7. Keterbiasaan mendapatkan jawaban instan dari AI membuat saya merasa kehilangan ketahanan berpikir mendalam (deep thinking).",
          },
        ],
      },
    ],
  },

  // SECTION 7: Persepsi dan Batas Penggunaan AI
  {
    sectionId: "perceptions_boundaries",
    sectionNumber: 7,
    title: "Persepsi dan Batas Penggunaan AI",
    subtitle: "Pandangan responden mengenai etika akademik, batas wajar pemanfaatan AI, dan kebutuhan regulasi.",
    questions: [
      {
        id: "boundary_explain_material",
        title: "Persepsi: Menggunakan AI untuk Menjelaskan Konsep Materi Kuliah",
        description: "Bagaimana Anda memandang mahasiswa yang menggunakan AI sebagai tutor belajar pribadi untuk memahami teori?",
        type: "single_choice",
        options: [
          { value: "Sangat etis dan dianjurkan", label: "Sangat etis dan sangat dianjurkan sebagai metode belajar mandiri" },
          { value: "Etis dengan batasan tertentu", label: "Etis, selama tetap merujuk pada materi rujukan utama dosen" },
          { value: "Kurang etis", label: "Kurang etis jika menggantikan interaksi dengan dosen/asisten" },
          { value: "Tidak etis", label: "Tidak etis" },
        ],
      },
      {
        id: "boundary_sample_code",
        title: "Persepsi: Menggunakan AI untuk Membuat Contoh Kode Algoritma Sederhana",
        description: "Bagaimana pandangan Anda tentang meminta AI mendemonstrasikan sintaks atau contoh struktur data?",
        type: "single_choice",
        options: [
          { value: "Sangat wajar dan etis", label: "Sangat wajar dan lazim sebagai bahan referensi" },
          { value: "Etis jika hanya contoh, bukan kode tugas akhir", label: "Etis jika sebatas contoh sintaks umum, bukan kode spesifik tugas" },
          { value: "Kurang etis", label: "Kurang etis karena mahasiswa harus merujuk dokumentasi resmi" },
          { value: "Tidak etis", label: "Tidak etis" },
        ],
      },
      {
        id: "boundary_debugging",
        title: "Persepsi: Menggunakan AI untuk Membantu Menemukan Bug pada Kode Sendiri",
        description: "Bagaimana pandangan Anda mengenai penggunaan AI sebagai asisten debugging?",
        type: "single_choice",
        options: [
          { value: "Sangat wajar dan efisien", label: "Sangat wajar dan meningkatkan efisiensi belajar pemrograman" },
          { value: "Wajar setelah usaha debug mandiri dilakukan", label: "Wajar jika telah mencoba debugging mandiri terlebih dahulu" },
          { value: "Kurang tepat jika langsung di awal", label: "Kurang tepat karena menghilangkan kesempatan mengasah intuisi error" },
          { value: "Tidak etis", label: "Tidak etis" },
        ],
      },
      {
        id: "boundary_entire_assignment",
        title: "Persepsi: Meminta AI Menyelesaikan Seluruh Tugas Kuliah dari Awal hingga Akhir",
        description: "Bagaimana pandangan etika Anda ketika seluruh tugas diproduksi oleh AI tanpa kontribusi pemikiran mandiri?",
        type: "single_choice",
        options: [
          { value: "Pelanggaran integritas akademik serius (Plagiarisme AI)", label: "Pelanggaran integritas akademik serius / kecurangan akademik" },
          { value: "Tidak etis namun dapat dimaklumi pada situasi mendesak", label: "Tidak etis, namun terkadang dapat dipahami jika kepepet" },
          { value: "Bisa diterima asalkan kodenya dipahami", label: "Dapat diterima asalkan mahasiswa mengerti isi kodenya" },
          { value: "Sepenuhnya wajar dan sah di era modern", label: "Sepenuhnya wajar di era AI modern" },
        ],
      },
      {
        id: "boundary_ununderstood_answer",
        title: "Persepsi: Mengumpulkan Jawaban AI Tanpa Memahami Cara Kerjanya",
        description: "Pandangan Anda tentang praktik mengumpulkan tugas yang bersumber dari AI tanpa menguasai isinya:",
        type: "single_choice",
        options: [
          { value: "Sangat tidak dapat dibenarkan (merugikan diri sendiri)", label: "Sangat tidak dapat dibenarkan dan merugikan kompetensi diri sendiri" },
          { value: "Buruk dari sisi pembelajaran", label: "Kurang baik dari kacamata esensi pendidikan tinggi" },
          { value: "Netral / Terserah individu mahasiswa", label: "Netral / Merupakan pilihan dan risiko masing-masing individu" },
          { value: "Wajar jika hanya demi nilai", label: "Wajar demi pragmatisme nilai tugas" },
        ],
      },
      {
        id: "boundary_threshold_dependency",
        title: "Menurut Anda, Titik Mana yang Menandakan Mahasiswa Sudah 'Ketergantungan' pada AI?",
        description: "Kondisi apa yang paling akurat merepresentasikan ketergantungan yang tidak sehat?",
        type: "single_choice",
        options: [
          { value: "Merasa panik atau buntu saat harus coding di ujian tanpa AI", label: "Merasa cemas atau buntu total saat harus menyelesaikan soal di ujian tanpa AI" },
          { value: "Tidak mampu menjelaskan logika program yang dibuatnya sendiri", label: "Tidak mampu menguraikan logika dari tugas yang dikumpulkannya" },
          { value: "Kehilangan motivasi membaca dokumentasi primer atau buku", label: "Kehilangan ketertarikan untuk membaca dokumentasi primer atau buku teks" },
          { value: "Menggunakan AI untuk segala hal dari ide awal hingga penutup", label: "Menggunakan AI untuk seluruh tahapan tanpa ada upaya berpikir mandiri" },
        ],
      },
      {
        id: "boundary_rules_needed",
        title: "Pandangan Mengenai Kebutuhan Regulasi AI di Tingkat Program Studi / Departemen",
        description: "Apakah Departemen Ilmu Komputer IPB perlu menetapkan aturan formal terkait batasan AI?",
        type: "single_choice",
        options: [
          { value: "Sangat perlu: Aturan tertulis yang tegas dan transparan di setiap silabus mata kuliah", label: "Sangat perlu: Aturan tertulis yang tegas dan transparan pada tiap mata kuliah" },
          { value: "Cukup panduan etika umum: Dosen memberikan arahan wajar tanpa sanksi kaku", label: "Cukup panduan etika umum: Arahan fleksibel yang disesuaikan karakter matkul" },
          { value: "Tidak perlu aturan formal: Diserahkan sepenuhnya pada kedewasaan mahasiswa", label: "Tidak perlu aturan formal: Diserahkan pada kesadaran profesional mahasiswa" },
        ],
      },
    ],
  },

  // SECTION 8: AI dan Masa Depan Mahasiswa Ilkom
  {
    sectionId: "future_readiness",
    sectionNumber: 8,
    title: "AI dan Masa Depan Mahasiswa Ilkom",
    subtitle: "Relevansi keahlian di masa depan, penguatan fondasi ilmu komputer, dan harapan terhadap peran HIMALKOM.",
    questions: [
      {
        id: "likert_future_group",
        title: "Kesiapan Menghadapi Era Kecerdasan Buatan",
        description: "Pilih tingkat persetujuan Anda (1: Sangat Tidak Setuju, 2: Tidak Setuju, 3: Setuju, 4: Sangat Setuju):",
        type: "likert_matrix",
        statements: [
          {
            id: "future_career_importance",
            statement: "1. Penguasaan alat AI generatif merupakan kompetensi penentu daya saing lulusan Ilmu Komputer.",
          },
          {
            id: "future_proficiency_need",
            statement: "2. Mahasiswa Ilmu Komputer dituntut untuk mahir memadukan AI dalam alur kerja rekayasa perangkat lunak.",
          },
          {
            id: "future_foundational_cs",
            statement: "3. Fondasi fundamental ilmu komputer (struktur data, algoritma, OS, arsitektur komputer) tetap lebih krusial daripada sekadar mahir prompt engineering.",
          },
          {
            id: "future_problem_solving",
            statement: "4. Daya nalar problem-solving mandiri adalah pembeda utama antara software engineer berkualitas dan pengguna AI biasa.",
          },
          {
            id: "future_prevent_overdependence",
            statement: "5. Mahasiswa perlu sengaja melatih diri secara berkala tanpa AI agar ketajaman kognitif problem-solving tidak tumpul.",
          },
        ],
      },
      {
        id: "future_top_skills",
        title: "Keterampilan Paling Vital Agar Mahasiswa Ilkom Tetap Relevan di Era AI",
        description: "Pilih maksimal 3 keterampilan yang menurut Anda paling esensial:",
        type: "multiple_choice",
        options: [
          { value: "Problem Solving & Algorithmic Thinking", label: "Pemecahan Masalah & Berpikir Algoritmik yang Kuat" },
          { value: "System Architecture & Engineering Design", label: "Arsitektur Sistem & Perancangan Rekayasa Skala Besar" },
          { value: "Critical Evaluation & Code Verification", label: "Evaluasi Kritis & Verifikasi Ketepatan Kode Otomatis" },
          { value: "Mathematical Foundations & Statistical Modeling", label: "Fondasi Matematika Diskrit, Kalkulus, & Pemodelan Statistik" },
          { value: "AI Literacy & Advanced Prompt Engineering", label: "Literasi AI & Rekayasa Prompt / Integrasi LLM Lanjut" },
          { value: "Collaboration & Communication Skills", label: "Kolaborasi Tim, Komunikasi Interpersonal, & Advokasi Klien" },
        ],
      },
      {
        id: "future_himalkom_programs",
        title: "Program yang Diharapkan dari HIMALKOM Terkait Pemanfaatan AI",
        description: "Pilih program atau inisiatif yang paling Anda harapkan diselenggarakan oleh HIMALKOM IPB:",
        type: "multiple_choice",
        options: [
          { value: "Workshop AI Tools & Ethical Engineering", label: "Workshop Praktis Pemanfaatan AI secara Etis & Bertanggung Jawab" },
          { value: "Kajian & Diskusi Ketergantungan Akademik Mahasiswa", label: "Ruang Diskusi & Kajian Ketergantungan AI di Kalangan Mahasiswa" },
          { value: "Coding Challenge / Hackathon Tanpa AI (Pure Coding)", label: "Kompetisi Coding Mandiri Tanpa AI untuk Menguji Fondasi Murni" },
          { value: "Panduan Pandangan HIMALKOM Terkait Integritas AI", label: "Buku Saku / Panduan Ringkas Etika AI Khusus Mahasiswa Ilkom IPB" },
          { value: "Sharing Session dengan Praktisi Industri Seputar AI di Dunia Kerja", label: "Sharing Session Bersama Alumni & Praktisi Industri Seputar Ekspektasi AI" },
        ],
      },
      {
        id: "future_ideal_usage",
        title: "Bagaimana Mahasiswa Ilkom Seharusnya Memposisikan AI?",
        description: "Pilih satu formulasi posisi yang paling ideal menurut Anda:",
        type: "single_choice",
        options: [
          { value: "Co-pilot berpikir yang mempercepat implementasi setelah ide dan logika dipahami matang", label: "Co-pilot berpikir: mempercepat implementasi setelah logika dipahami mandiri" },
          { value: "Tutor pribadi untuk memperdalam pemahaman materi yang belum jelas di kuliah", label: "Tutor pribadi: sarana interaktif memperdalam materi teoritis" },
          { value: "Opsi darurat hanya ketika semua upaya penelusuran mandiri tidak membuahkan hasil", label: "Opsi darurat: hanya dibuka ketika upaya mandiri mencapai jalan buntu" },
          { value: "Mesin pelaksana otomatis penuh untuk semua tugas rutin perkuliahan", label: "Mesin pelaksana otomatis penuh demi efisiensi maksimal" },
        ],
      },
    ],
  },

  // SECTION 9: Saran dan Rekomendasi Mahasiswa
  {
    sectionId: "recommendations",
    sectionNumber: 9,
    title: "Saran dan Rekomendasi Mahasiswa",
    subtitle: "Urun rembuk aspirasi kualitatif untuk penguatan kurikulum, kultur belajar Ilkom IPB, dan program kerja HIMALKOM.",
    questions: [
      {
        id: "open_biggest_challenge",
        title: "Tantangan Terbesar dalam Menggunakan AI Tanpa Menjadi Bergantung",
        description: "Ceritakan tantangan pribadi atau observasi Anda di lingkungan mahasiswa dalam menyeimbangkan kepraktisan AI dan kemandirian intelektual.",
        type: "textarea",
        placeholder: "Contoh: Godaan untuk langsung copy-paste saat deadline mepet, berkurangnya kesabaran membaca stack trace, dll.",
        minChars: 5,
      },
      {
        id: "open_effective_learning_tips",
        title: "Saran Metode Belajar Agar AI Menjadi Pendorong, Bukan Penghambat Pemahaman",
        description: "Strategi atau kebiasaan apa yang Anda nilai efektif agar penggunaan AI tetap meningkatkan pemahaman materi, bukan sekadar memproduksi output?",
        type: "textarea",
        placeholder: "Tuliskan saran praktis atau tips belajar Anda...",
        minChars: 5,
      },
      {
        id: "open_himalkom_initiative",
        title: "Aspirasi Program atau Inisiatif untuk HIMALKOM dan Departemen Ilkom IPB",
        description: "Usulan inisiatif atau kebijakan apa yang Anda harapkan dari HIMALKOM atau dosen sehubungan dengan adaptasi AI di perkuliahan?",
        type: "textarea",
        placeholder: "Tuliskan aspirasi program kerja atau rekomendasi Anda...",
        minChars: 5,
      },
    ],
  },
];
