import Link from "next/link";
import { RiAlertLine, RiHome4Line } from "react-icons/ri";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-[#FFF8E1] flex flex-col items-center justify-center px-4 text-[#4B2E05] font-inder">
      <div className="text-center space-y-6">
        {/* Ikon/Ilustrasi */}
        <div className="relative flex justify-center">
          <RiAlertLine size={120} className="text-[#F4B740] animate-bounce" />
          <span className="absolute bottom-0 text-8xl font-black opacity-10">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold uppercase tracking-tighter">Ups! Halaman Hilang</h1>
          <p className="text-lg opacity-80 max-w-md mx-auto">
            Sepertinya halaman yang Anda cari telah terbang menjauh atau tidak pernah ada.
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