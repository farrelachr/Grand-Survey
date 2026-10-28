# Grand Survey HIMALKOM 2026 — AI Dependency Survey Platform

> **Grand Survey HIMALKOM 2026: Analisis Ketergantungan Mahasiswa Program Studi Ilmu Komputer IPB University Angkatan 62 terhadap Artificial Intelligence dalam Pembelajaran dan Aktivitas Akademik.**

Platform survei resmi Himpunan Mahasiswa Ilmu Komputer (HIMALKOM) IPB University dengan sistem autentikasi email IPB, evaluasi skor ketergantungan AI instan, keamanan Row Level Security (RLS) PostgreSQL, dan integrasi Google Sheets.

---

## 1. Fitur Utama

- **Editorial Academic UI**: Desain minimalis berbasis estetika riset kampus (warm background `#F7F7F2`, forest green `#174C3C`, aksen emas `#D5A85B`, font Geist).
- **Verifikasi Domain Email IPB**: Autentikasi Supabase Auth dengan proteksi ganda (Server Action, OAuth handler, dan PostgreSQL trigger) membatasi akses hanya untuk `@apps.ipb.ac.id` dan `@ipb.ac.id`.
- **Kuesioner 9 Bagian (57 Indikator)**:
  1. Profil Responden (4 butir)
  2. Pola Penggunaan AI (6 butir)
  3. Ketergantungan terhadap AI (8 butir matriks Likert 1–4)
  4. AI dalam Coding & Problem Solving (7 butir)
  5. AI dan Proses Belajar (7 butir)
  6. Kemandirian, Verifikasi & Critical Thinking (7 butir)
  7. Persepsi & Batas Penggunaan AI (7 butir)
  8. AI dan Masa Depan Mahasiswa Ilkom (8 butir)
  9. Saran & Rekomendasi Mahasiswa (3 butir esai terbuka)
- **Mesin Penilaian Transparan**: Menghitung *Primary Dependency Index* (0–100) berbasis 8 pernyataan Bagian 3, normalisasi Likert, *reverse scoring* pada indikator kemandirian, dan pemetaan 3 band (Rendah 0–33.33, Sedang >33.33–66.67, Tinggi >66.67–100).
- **Halaman Hasil Personal Terproteksi (`/result/[submissionId]`)**: Visual gauge indikator, kategori, observasi akademik personal, rekomendasi praktis, dan transparansi rumus. Dilindungi RLS sehingga mahasiswa lain tidak dapat melihat data melalui modifikasi URL.
- **Pencegahan Respon Ganda**: *Unique constraint* pada `(user_id, survey_version_id)` di database dan pengecekan server-side.
- **Integrasi Google Sheets & Fallback CSV**: Sinkronisasi baris terpisah per butir kuesioner dengan idempotensi keyed by `submissionId`, pencatatan log pada `spreadsheet_sync_logs`, tombol *retry* admin, dan ekspor CSV langsung.
- **Panel Admin Terproteksi (`/admin`)**: Statistik agregat nyata, distribusi kategori, popularitas AI tools, tabel submisi dengan pseudonimitas identitas, dan kontrol sinkronisasi.

---

## 2. Panduan Setup Database & Google OAuth (Langkah Demi Langkah)

Berikut adalah panduan lengkap untuk menghubungkan aplikasi ke Supabase Database dan Google OAuth.

### Langkah A: Setup Supabase Database

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat proyek baru (misal: `grand-survey-himalkom-2026`).
2. Masuk ke menu **SQL Editor** pada sidebar kiri.
3. Buka file migrasi lokal:
   [`supabase/migrations/20260228000000_init_schema.sql`](supabase/migrations/20260228000000_init_schema.sql)
4. Salin seluruh isi SQL tersebut, tempel ke SQL Editor Supabase, lalu klik **Run**.
   - Ini akan membuat tabel `profiles`, `survey_versions`, `survey_submissions`, `spreadsheet_sync_logs`.
   - Mengaktifkan Row Level Security (RLS) pada semua tabel.
   - Mengaktifkan trigger verifikasi domain email IPB (`check_ipb_email_domain`) pada tabel `auth.users`.
   - Mengaktifkan trigger otomatis pembuatan profil saat pengguna mendaftar (`handle_new_user`).
5. Buka **Project Settings** -> **API** di Supabase Dashboard:
   - Salin **Project URL** ke `NEXT_PUBLIC_SUPABASE_URL` di `.env.local`.
   - Salin **anon public key** ke `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`.
   - Salin **service_role secret key** ke `SUPABASE_SERVICE_ROLE_KEY` di `.env.local`.

---

### Langkah B: Setup Google OAuth di Google Cloud & Supabase

Untuk mengizinkan mahasiswa masuk menggunakan akun Google `@apps.ipb.ac.id`:

#### 1. Konfigurasi di Google Cloud Console
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru (misal: `Himalkom Grand Survey`).
3. Masuk ke **APIs & Services** -> **OAuth consent screen**:
   - Pilih User Type: **External** (atau **Internal** jika organisasi Google Workspace IPB mengizinkan).
   - Isi App Name: `Grand Survey HIMALKOM 2026`.
   - Masukkan User support email dan Developer contact email.
   - Simpan.
4. Masuk ke **APIs & Services** -> **Credentials**:
   - Klik **+ Create Credentials** -> **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `Grand Survey Web Client`.
   - Pada bagian **Authorized redirect URIs**, tambahkan Callback URL dari Supabase Anda:
     ```text
     https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback
     ```
     *(URL ini dapat dilihat di Supabase Dashboard -> Authentication -> Providers -> Google)*.
   - Klik **Create**. Salin **Client ID** dan **Client Secret**.

#### 2. Konfigurasi di Supabase Dashboard
1. Buka Supabase Dashboard -> **Authentication** -> **Providers**.
2. Pilih **Google**, aktifkan toggle **Enable Google provider**.
3. Masukkan **Client ID** dan **Client Secret** yang Anda peroleh dari Google Cloud Console.
4. Simpan konfigurasi.
5. Masuk ke **Authentication** -> **URL Configuration**:
   - Pada **Site URL**, masukkan:
     - Untuk lokal: `http://localhost:3000`
     - Untuk produksi Vercel: `https://your-domain.vercel.app`
   - Pada **Redirect URLs**, tambahkan:
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.vercel.app/auth/callback`

---

### Langkah C: Setup Google Sheets API (Opsional untuk Sinkronisasi Otomatis)

1. Di Google Cloud Console yang sama, buka **APIs & Services** -> **Library**.
2. Cari dan aktifkan **Google Sheets API**.
3. Masuk ke **Credentials** -> **+ Create Credentials** -> **Service Account**.
   - Beri nama service account (misal: `sheets-sync-agent`).
   - Buat kunci baru bertipe **JSON**, lalu simpan file JSON tersebut dengan aman.
4. Buka Google Spreadsheet baru di Google Drive:
   - Salin Spreadsheet ID dari URL browser: `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`.
   - Bagikan (Share) spreadsheet tersebut kepada email service account dengan peran **Editor**.
5. Masukkan ke `.env.local`:
   ```bash
   GOOGLE_SHEETS_SPREADSHEET_ID=your-google-spreadsheet-id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=sheets-sync-agent@your-project.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

---

## 3. Menjalankan di Komputer Lokal

1. Salin template environment:
   ```bash
   cp .env.example .env.local
   ```
2. Isi nilai kredensial Supabase Anda di `.env.local`.
3. Jalankan automated test:
   ```bash
   npm test
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 4. Menentukan Akun Administrator

Untuk memberikan akses ke halaman `/admin`:
1. Buka `.env.local` dan tambahkan email admin ke variabel `ADMIN_EMAILS`:
   ```bash
   ADMIN_EMAILS=admin.himalkom@apps.ipb.ac.id,bph.himalkom@apps.ipb.ac.id
   ```
2. Atau di database Supabase, ubah kolom `role` pada baris pengguna di tabel `public.profiles` dari `'respondent'` menjadi `'admin'`.

---

## 5. Deployment ke Vercel

1. Push repository ke GitHub.
2. Impor project di [Vercel Dashboard](https://vercel.com).
3. Di bagian **Environment Variables** di Vercel, salin seluruh variabel dari `.env.local`.
4. Pastikan `NEXT_PUBLIC_SITE_URL` diisi dengan domain produksi Vercel Anda (misal `https://grand-survey-himalkom.vercel.app`).
5. Tambahkan domain tersebut ke **Redirect URLs** di Supabase Dashboard.
6. Klik **Deploy**.
