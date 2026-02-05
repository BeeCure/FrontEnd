import Link from "next/link";
import { RiShieldKeyholeLine, RiHome4Line } from "react-icons/ri";

export default function Forbidden() {
  return (
    <main className="min-h-screen w-full bg-[#FFF8E1] flex flex-col items-center justify-center px-4 text-[#4B2E05] font-inder">
      <div className="text-center space-y-6">
        {/* Ikon/Ilustrasi - Menggunakan Shield/Lock agar relevan dengan 403 */}
        <div className="relative flex justify-center">
          <RiShieldKeyholeLine size={120} className="text-[#F4B740] animate-pulse" />
          <span className="absolute bottom-0 text-8xl font-black opacity-10">403</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold uppercase tracking-tighter">Akses Ditolak!</h1>
          <p className="text-lg opacity-80 max-w-md mx-auto">
            Maaf, Anda tidak memiliki izin untuk mengakses area ini. Halaman ini hanya untuk Superadmin.
          </p>
        </div>

        <Link href="/">
          <button className="mt-8 flex items-center gap-2 bg-[#F4B740] hover:bg-[#4B2E05] hover:text-[#FFF8E1] text-[#4B2E05] font-bold py-3 px-8 rounded-[15px] transition-all duration-300 shadow-lg active:scale-95 mx-auto">
            <RiHome4Line size={20} />
            Kembali ke Beranda
          </button>
        </Link>
      </div>
    </main>
  );
}