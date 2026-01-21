"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Trash2, Loader2 } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  approvalStatus: string;
}

export default function AdminDashboardPage() {
  const [practitioners, setPractitioners] = useState<UserData[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPract, resAll] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/practitioners`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/all`, { credentials: "include" })
        ]);

        const dataPract = await resPract.json();
        const dataAll = await resAll.json();

        if (dataPract.success) setPractitioners(dataPract.data);
        if (dataAll.success) setAllUsers(dataAll.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const countUsers = allUsers.filter(u => u.role === "USER").length;
  const countPractitioners = practitioners.filter(p => p.approvalStatus === "APPROVED").length;
  const totalDisplay = countUsers + countPractitioners;
  
  const practPercent = totalDisplay > 0 ? Math.round((countPractitioners / totalDisplay) * 100) : 0;
  const userPercent = totalDisplay > 0 ? 100 - practPercent : 0;

  const pendingRequests = practitioners.filter(p => p.approvalStatus === "PENDING");
  const approvedList = practitioners.filter(p => p.approvalStatus === "APPROVED");

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF8E1]">
        <Loader2 className="animate-spin text-[#4B2E05]" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#FFF8E1] p-6 md:p-12 font-inder text-[#4B2E05]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10">
          <div className="bg-[#F4B740] rounded-[25px] p-8 flex flex-col justify-center w-full md:w-[420px] h-40 shadow-sm transition-all">
            <h2 className="text-7xl font-bold leading-none">{countUsers}</h2>
            <p className="text-3xl font-medium mt-1">Pengguna</p>
          </div>

          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <div 
              className="w-full h-full rounded-full flex items-center justify-center shadow-md"
              style={{ background: `conic-gradient(#4B2E05 0% ${practPercent}%, #F4B740 ${practPercent}% 100%)` }}
            >
              <div className="w-[55%] h-[55%] bg-[#FFF8E1] rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Total</span>
                <span className="text-2xl font-bold">{totalDisplay}</span>
              </div>
            </div>
            {practPercent > 0 && <span className="absolute right-4 top-10 text-[12px] font-black text-[#FFF8E1]">{practPercent}%</span>}
            {userPercent > 0 && <span className="absolute left-4 bottom-10 text-[12px] font-black text-[#4B2E05]">{userPercent}%</span>}
          </div>

          <div className="bg-[#4B2E05] rounded-[25px] p-8 flex flex-col justify-center items-end w-full md:w-[420px] h-40 shadow-sm text-[#FFF8E1] transition-all">
            <h2 className="text-7xl font-bold leading-none">{countPractitioners}</h2>
            <p className="text-3xl font-medium mt-1">Praktisi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          <div className="bg-[#F4B740] rounded-[25px] p-7 shadow-md border border-black/5">
            <h3 className="text-xl font-bold text-center mb-4 uppercase tracking-[0.2em]">Permintaan Akun Praktisi</h3>
            <div className="h-[2px] bg-[#4B2E05] w-full mb-8 opacity-30" />
            <div className="space-y-5">
              {pendingRequests.length > 0 ? pendingRequests.map((item) => (
                <div key={item.id} className="bg-[#FFF8E1] rounded-[18px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
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
              )) : <p className="text-center opacity-50 py-10">Tidak ada permintaan baru</p>}
            </div>
          </div>

          <div className="bg-[#F4B740] rounded-[25px] p-7 shadow-md border border-black/5">
            <h3 className="text-xl font-bold text-center mb-4 uppercase tracking-[0.2em]">Daftar Akun Praktisi</h3>
            <div className="h-[2px] bg-[#4B2E05] w-full mb-8 opacity-30" />
            <div className="space-y-5">
              {approvedList.length > 0 ? approvedList.map((item) => (
                <div key={item.id} className="bg-[#FFF8E1] rounded-[18px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
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
              )) : <p className="text-center opacity-50 py-10">Belum ada praktisi terdaftar</p>}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}