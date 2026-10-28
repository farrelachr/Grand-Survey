import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Database, Mail } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi & Perlindungan Data — Grand Survey HIMALKOM 2026",
  description: "Penjelasan resmi mengenai tata kelola privasi data responden Grand Survey HIMALKOM 2026.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#EBF2EE] border border-[#174C3C]/20 text-[#174C3C] text-[11px] font-bold uppercase tracking-wider mb-3">
              Kerahasiaan & Tata Kelola Data
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202522]">
              Kebijakan Privasi & Etika Riset
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#636B65] leading-relaxed">
              Grand Survey HIMALKOM 2026 diselenggarakan sebagai inisiatif riset internal dan advokasi akademik Himpunan Mahasiswa Ilmu Komputer IPB University. Dokumen ini menguraikan komitmen kami dalam melindungi identitas dan data setiap mahasiswa responden.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded bg-[#EBF2EE] text-[#174C3C] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#202522]">
                    1. Tujuan Pengumpulan Data
                  </h2>
                  <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                    Data dikumpulkan secara eksklusif untuk menganalisis pola adaptasi kecerdasan buatan, dinamika proses belajar pemrograman, dan tingkat kemandirian berpikir kritis mahasiswa Ilmu Komputer IPB University Angkatan 62. Hasil survei akan menjadi rujukan perancangan program kerja HIMALKOM serta bahan rekomendasi akademik bagi Departemen Ilmu Komputer FMIPA IPB.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded bg-[#FAF5EB] text-[#D5A85B] shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#202522]">
                    2. Data yang Dikumpulkan dan Autentikasi
                  </h2>
                  <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                    Kami membatasi pengumpulan data pada parameter yang relevan secara substantif:
                  </p>
                  <ul className="mt-2.5 space-y-1.5 text-xs text-[#636B65] list-disc list-inside">
                    <li><strong className="text-[#202522]">Alamat Email IPB:</strong> Digunakan semata-mata untuk verifikasi kelayakan populasi target dan mencegah respon ganda (duplicate submissions).</li>
                    <li><strong className="text-[#202522]">Profil Akademik Singkat:</strong> Angkatan dan peminatan bidang ilmu komputer.</li>
                    <li><strong className="text-[#202522]">Respon Kuesioner:</strong> Pilihan skala Likert, kebiasaan teknis, dan saran kualitatif.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded bg-[#EBF2EE] text-[#174C3C] shrink-0">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#202522]">
                    3. Pemisahan Identitas & Prinsip Pseudonimitas
                  </h2>
                  <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                    Kami tidak menjanjikan anonimitas mutlak karena verifikasi email diterapkan demi integritas data ilmiah. Namun, sistem menerapkan <strong className="text-[#202522]">pemisahan ketat</strong> antara tabel kredensial akun dan data analisis kuesioner. Seluruh tabel analisis publik dan ekspor spreadsheet menggunakan ID acak (UUID), sehingga alamat email responden tidak dicantumkan dalam lembar kerja riset.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded bg-[#FAF5EB] text-[#D5A85B] shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#202522]">
                    4. Hak Akses & Keamanan Sistem
                  </h2>
                  <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                    Database dilindungi menggunakan enkripsi saat transit (TLS) dan istirahat, diperkuat oleh kebijakan Row Level Security (RLS) PostgreSQL. Mahasiswa hanya diizinkan melihat lembar hasil evaluasinya sendiri. Rekapitulasi penuh hanya dapat diakses oleh tim riset terotorisasi HIMALKOM IPB 2026.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded bg-[#EBF2EE] text-[#174C3C] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#202522]">
                    5. Kontak dan Narahubung Riset
                  </h2>
                  <p className="mt-2 text-sm text-[#636B65] leading-relaxed">
                    Apabila Anda memiliki pertanyaan, keberatan, atau ingin meminta penarikan data respon Anda sebelum laporan akhir diterbitkan, silakan hubungi tim survei melalui:
                  </p>
                  <p className="mt-2 text-xs font-mono text-[#174C3C]">
                    Email: himalkom@apps.ipb.ac.id | Instagram: @himalkomipb
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="text-xs font-semibold text-[#174C3C] hover:underline"
            >
              &larr; Kembali ke Beranda Survei
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
