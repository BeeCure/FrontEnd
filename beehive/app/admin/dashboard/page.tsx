"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { 
  RiCheckboxCircleLine, 
  RiDeleteBin6Line, 
  RiFacebookCircleLine,
  RiMailLine,
  RiPhoneLine,
  RiUser3Line
} from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  approvalStatus: string;
}

interface PractitionerDetail {
  name: string;
  email: string;
  phone: string;
  facebookUrl: string;
}

export default function AdminDashboardPage() {
  const [practitioners, setPractitioners] = useState<UserData[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState<PractitionerDetail | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = useCallback(async () => {
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
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCardClick = async (userId: string) => {
    setIsDetailOpen(true);
    setIsFetchingDetail(true);
    setSelectedPractitioner(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/practitioner/${userId}`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setSelectedPractitioner(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleApprove = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    if (!confirm("Setujui akun praktisi ini?")) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/practitioners/approve/${userId}`, {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      alert(result.message);
      if (response.ok) fetchData();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Gagal memproses.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    setSelectedUserId(userId);
    setIsRejectOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return alert("Alasan wajib diisi");
    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/practitioners/reject/${selectedUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
        credentials: "include",
      });
      const result = await response.json();
      alert(result.message);
      if (response.ok) {
        setIsRejectOpen(false);
        setRejectReason("");
        fetchData();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Gagal memproses.");
    } finally {
      setIsProcessing(false);
    }
  };

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
          <div className="bg-[#F4B740] rounded-[15px] p-8 flex flex-col justify-center w-full md:w-[420px] h-40 shadow-sm transition-all">
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

          <div className="bg-[#4B2E05] rounded-[15px] p-8 flex flex-col justify-center items-end w-full md:w-[420px] h-40 shadow-sm text-[#FFF8E1] transition-all">
            <h2 className="text-7xl font-bold leading-none">{countPractitioners}</h2>
            <p className="text-3xl font-medium mt-1">Praktisi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          <div className="bg-[#F4B740] rounded-[15px] p-7 shadow-md border border-black/5">
            <h3 className="text-xl font-bold text-center mb-4 uppercase tracking-[0.2em]">Permintaan Akun Praktisi</h3>
            <div className="h-[2px] bg-[#4B2E05] w-full mb-8 opacity-30" />
            <div className="space-y-5">
              {pendingRequests.length > 0 ? pendingRequests.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleCardClick(item.id)}
                  className="bg-[#FFF8E1] rounded-[18px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex flex-col truncate pr-4 text-left">
                    <span className="font-bold text-base md:text-lg truncate">{item.name}</span>
                    <span className="text-xs opacity-70 truncate">{item.email}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={(e) => handleApprove(e, item.id)} disabled={isProcessing} className="p-2 transition-transform hover:scale-125 text-[#4B2E05]">
                      <RiCheckboxCircleLine size={32} />
                    </button>
                    <button onClick={(e) => handleRejectClick(e, item.id)} disabled={isProcessing} className="p-2 transition-transform hover:scale-125 text-[#4B2E05]">
                      <RiDeleteBin6Line size={32} />
                    </button>
                  </div>
                </div>
              )) : <p className="text-center opacity-50 py-10">Tidak ada permintaan baru</p>}
            </div>
          </div>

          <div className="bg-[#F4B740] rounded-[15px] p-7 shadow-md border border-black/5">
            <h3 className="text-xl font-bold text-center mb-4 uppercase tracking-[0.2em]">Daftar Akun Praktisi</h3>
            <div className="h-[2px] bg-[#4B2E05] w-full mb-8 opacity-30" />
            <div className="space-y-5">
              {approvedList.length > 0 ? approvedList.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleCardClick(item.id)}
                  className="bg-[#FFF8E1] rounded-[18px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex flex-col truncate pr-4 text-left">
                    <span className="font-bold text-base md:text-lg truncate">{item.name}</span>
                    <span className="text-xs opacity-70 truncate">{item.email}</span>
                  </div>
                  <div className="shrink-0">
                    <button onClick={(e) => handleRejectClick(e, item.id)} className="p-2 transition-transform hover:scale-125 text-[#4B2E05]">
                      <RiDeleteBin6Line size={32} />
                    </button>
                  </div>
                </div>
              )) : <p className="text-center opacity-50 py-10">Belum ada praktisi terdaftar</p>}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[#F4B740] border-none rounded-[15px] w-[92%] sm:w-full max-w-[450px] p-8 shadow-2xl font-inder">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#4B2E05] text-center pb-4 uppercase tracking-widest">
              Detail Praktisi
            </DialogTitle>
            <DialogDescription className="sr-only">Detail informasi profil praktisi terpilih.</DialogDescription>
          </DialogHeader>
          
          {isFetchingDetail ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#4B2E05]" size={32} />
            </div>
          ) : selectedPractitioner ? (
            <div className="space-y-4 py-2 text-[#4B2E05]">
              <div className="flex items-center gap-4 bg-[#FFF8E1] p-4 rounded-2xl shadow-sm">
                <RiUser3Line size={24} className="text-[#4B2E05]" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase opacity-60 font-bold tracking-tighter">Nama Lengkap</span>
                  <span className="font-bold text-lg leading-tight">{selectedPractitioner.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#FFF8E1] p-4 rounded-2xl shadow-sm">
                <RiMailLine size={24} className="text-[#4B2E05]" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase opacity-60 font-bold tracking-tighter">Email</span>
                  <span className="font-medium truncate max-w-[280px]">{selectedPractitioner.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#FFF8E1] p-4 rounded-2xl shadow-sm">
                <RiPhoneLine size={24} className="text-[#4B2E05]" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase opacity-60 font-bold tracking-tighter">No Telepon</span>
                  <span className="font-medium">{selectedPractitioner.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#FFF8E1] p-4 rounded-2xl shadow-sm overflow-hidden">
                <RiFacebookCircleLine size={24} className="text-[#4B2E05]" />
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-[10px] uppercase opacity-60 font-bold tracking-tighter">Link Facebook / Sosial Media</span>
                  <a href={selectedPractitioner.facebookUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline truncate font-medium">
                    {selectedPractitioner.facebookUrl}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center py-10 opacity-50">Gagal memuat data.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="bg-[#F4B740] border-none rounded-[15px] w-[92%] sm:w-full max-w-[400px] p-8 shadow-2xl font-inder">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#4B2E05] text-center">Tolak Permintaan</DialogTitle>
            <DialogDescription className="text-center text-[#4B2E05]/70">Berikan alasan penolakan untuk akun praktisi ini.</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Input placeholder="Alasan penolakan..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="h-12 rounded-[15px] border-none bg-white shadow-inner focus-visible:ring-2 focus-visible:ring-[#4B2E05]" />
          </div>
          <DialogFooter className="flex flex-row gap-3 justify-center sm:justify-center">
            <Button onClick={() => setIsRejectOpen(false)} variant="outline" className="rounded-[15px] border-2 border-[#4B2E05] text-[#4B2E05] font-bold px-8">Batal</Button>
            <Button onClick={handleRejectSubmit} disabled={isProcessing || !rejectReason} className="rounded-[15px] bg-[#8E4117] hover:bg-[#7a3713] text-white font-bold px-8 shadow-md">{isProcessing ? "Proses..." : "Reject"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}