"use client";

import React from "react";
import { UserCheck, Trash2 } from "lucide-react";

export default function AdminDashboardPage() {
  const pendingRequests = Array(3).fill({
    name: "Arswendo Erza Sadewa",
    email: "Aarswendo@Gmail.Com",
  });

  const practitionersList = Array(4).fill({
    name: "Arswendo Erza Sadewa",
    email: "Aarswendo@Gmail.Com",
  });

  return (
    <main className="min-h-screen w-full bg-[#FFF8E1] p-6 md:p-12 font-inder text-[#4B2E05]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- SECTION ATAS: STATISTIK (Lebih Lebar & Rapat) --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10">
          
          {/* Card Pengguna - Diperlebar (w-[420px]) */}
          <div className="bg-[#F4B740] rounded-[25px] p-8 flex flex-col justify-center w-full md:w-[420px] h-40 shadow-sm transition-all">
            <h2 className="text-7xl font-bold leading-none">58</h2>
            <p className="text-3xl font-medium mt-1">Pengguna</p>
          </div>

          {/* Diagram Donut - Ring Dipertebal */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <div 
              className="w-full h-full rounded-full flex items-center justify-center shadow-md"
              style={{
                background: `conic-gradient(#4B2E05 0% 42%, #F4B740 42% 100%)`
              }}
            >
              {/* Lubang Tengah Diperkecil agar Ring Terlihat Lebih Tebal */}
              <div className="w-[55%] h-[55%] bg-[#FFF8E1] rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Total</span>
                <span className="text-2xl font-bold">100</span>
              </div>
            </div>

            {/* Label Persentase - Diposisikan di tengah ketebalan ring */}
            <span className="absolute right-4 top-10 text-[12px] font-black text-[#FFF8E1]">42%</span>
            <span className="absolute left-4 bottom-10 text-[12px] font-black text-[#4B2E05]">58%</span>
          </div>

          {/* Card Praktisi - Diperlebar (w-[420px]) */}
          <div className="bg-[#4B2E05] rounded-[25px] p-8 flex flex-col justify-center items-end w-full md:w-[420px] h-40 shadow-sm text-[#FFF8E1] transition-all">
            <h2 className="text-7xl font-bold leading-none">42</h2>
            <p className="text-3xl font-medium mt-1">Praktisi</p>
          </div>

        </div>

        {/* --- SECTION BAWAH: DAFTAR AKUN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          
          {/* Permintaan Akun */}
          <div className="bg-[#F4B740] rounded-[25px] p-7 shadow-md border border-black/5">
            <h3 className="text-xl font-bold text-center mb-4 uppercase tracking-[0.2em]">Permintaan Akun Praktisi</h3>
            <div className="h-[2px] bg-[#4B2E05] w-full mb-8 opacity-30" />
            
            <div className="space-y-5">
              {pendingRequests.map((item, idx) => (
                <div key={idx} className="bg-[#FFF8E1] rounded-[18px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col truncate pr-4">
                    <span className="font-bold text-base md:text-lg truncate">{item.name}</span>
                    <span className="text-xs opacity-70 truncate">{item.email}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <button className="p-2 hover:bg-green-100 rounded-full transition-colors text-[#4B2E05]">
                        <UserCheck size={32} strokeWidth={1.5} />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-full transition-colors text-[#4B2E05]">
                        <Trash2 size={32} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daftar Akun */}
          <div className="bg-[#F4B740] rounded-[25px] p-7 shadow-md border border-black/5">
            <h3 className="text-xl font-bold text-center mb-4 uppercase tracking-[0.2em]">Daftar Akun Praktisi</h3>
            <div className="h-[2px] bg-[#4B2E05] w-full mb-8 opacity-30" />

            <div className="space-y-5">
              {practitionersList.map((item, idx) => (
                <div key={idx} className="bg-[#FFF8E1] rounded-[18px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col truncate pr-4">
                    <span className="font-bold text-base md:text-lg truncate">{item.name}</span>
                    <span className="text-xs opacity-70 truncate">{item.email}</span>
                  </div>
                  <div className="shrink-0">
                    <button className="p-2 hover:bg-red-100 rounded-full transition-colors text-[#4B2E05]">
                        <Trash2 size={32} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}