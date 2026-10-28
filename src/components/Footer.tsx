import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#E1E5DF] bg-[#FFFFFF] mt-auto text-xs text-[#737A74]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:items-start text-center sm:text-left">
          <p className="font-semibold text-[#202522]">
            Himpunan Mahasiswa Ilmu Komputer (HIMALKOM) IPB University
          </p>
          <p className="mt-0.5">
            Departemen Ilmu Komputer, Fakultas Matematika dan Ilmu Pengetahuan Alam, IPB University
          </p>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-[#174C3C] transition-colors underline-offset-4 hover:underline">
            Kebijakan Privasi
          </Link>
          <Link href="/methodology" className="hover:text-[#174C3C] transition-colors underline-offset-4 hover:underline">
            Dokumentasi Metodologi
          </Link>
          <span className="text-[#C4CCC1]">|</span>
          <span>Grand Survey 2026</span>
        </div>
      </div>
    </footer>
  );
}
