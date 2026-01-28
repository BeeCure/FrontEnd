import React, { useState } from "react";
import { RiCheckboxCircleLine, RiDeleteBin6Line } from "react-icons/ri";
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
import { showToast } from "@/components/Toast";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface PermintaanAkunProps {
  list: UserData[];
  onCardClick: (userId: string) => void;
  refreshData: () => void;
}

export default function PermintaanAkun({ list, onCardClick, refreshData }: PermintaanAkunProps) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    const toastId = showToast.loading("Menyetujui akun...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/practitioners/approve/${selectedUserId}`, {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        showToast.success(result.message, toastId);
        setIsApproveOpen(false);
        refreshData();
      } else {
        showToast.error(result.message, toastId);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error("Error server", toastId);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return showToast.error("Alasan wajib diisi");
    setIsProcessing(true);
    const toastId = showToast.loading("Menolak permintaan...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/practitioners/reject/${selectedUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        showToast.success(result.message, toastId);
        setIsRejectOpen(false);
        setRejectReason("");
        refreshData();
      } else {
        showToast.error(result.message, toastId);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error("Error server", toastId);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#F4B740] rounded-[15px] p-6 shadow-md border border-black/5 flex flex-col max-h-full">
      <h3 className="text-lg font-bold text-center mb-4 uppercase tracking-[0.1em] shrink-0">Permintaan Akun</h3>
      <div className="h-[2px] bg-[#4B2E05] w-full mb-6 opacity-30 shrink-0" />
      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide h-auto max-h-[380px]">
        {list.map((item) => (
          <div key={item.id} onClick={() => onCardClick(item.id)} className="bg-[#FFF8E1] rounded-[15px] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer text-left shrink-0">
            <div className="flex flex-col truncate pr-2"><span className="font-bold text-sm md:text-base truncate">{item.name}</span><span className="text-[10px] opacity-70 truncate">{item.email}</span></div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={(e) => { e.stopPropagation(); setSelectedUserId(item.id); setIsApproveOpen(true); }} className="p-1.5 transition-transform hover:scale-125 text-[#4B2E05]"><RiCheckboxCircleLine size={28} /></button>
              <button onClick={(e) => { e.stopPropagation(); setSelectedUserId(item.id); setIsRejectOpen(true); }} className="p-1.5 transition-transform hover:scale-125 text-[#4B2E05]"><RiDeleteBin6Line size={28} /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="bg-[#F4B740] border-none rounded-[15px] w-[92%] sm:w-full max-w-[400px] p-8 shadow-2xl font-inder text-[#4B2E05]">
          <DialogHeader><DialogTitle className="text-2xl font-bold text-center">Setujui Praktisi</DialogTitle><DialogDescription className="text-center text-[#4B2E05]/80 mt-2 font-inder">Apakah Anda yakin ingin menyetujui akun ini?</DialogDescription></DialogHeader>
          <DialogFooter className="flex flex-row gap-3 justify-center sm:justify-center mt-6">
            <Button onClick={() => setIsApproveOpen(false)} variant="outline" className="rounded-[15px] border-2 border-[#4B2E05] text-[#4B2E05] font-bold px-8">Batal</Button>
            <Button onClick={handleApprove} disabled={isProcessing} className="rounded-[15px] bg-[#34581B] hover:bg-[#2c4b17] text-white font-bold px-8 shadow-md">Setujui</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="bg-[#F4B740] border-none rounded-[15px] w-[92%] sm:w-full max-w-[400px] p-8 shadow-2xl font-inder text-[#4B2E05]">
          <DialogHeader><DialogTitle className="text-2xl font-bold text-[#4B2E05] text-center">Tolak Permintaan</DialogTitle><DialogDescription className="text-center text-[#4B2E05]/70 font-inder">Berikan alasan penolakan.</DialogDescription></DialogHeader>
          <div className="py-6"><Input placeholder="Alasan penolakan..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="h-12 rounded-[15px] border-none bg-white shadow-inner focus-visible:ring-2 focus-visible:ring-[#4B2E05] px-4 font-inder" /></div>
          <DialogFooter className="flex flex-row gap-3 justify-center sm:justify-center">
            <Button onClick={() => setIsRejectOpen(false)} variant="outline" className="rounded-[15px] border-2 border-[#4B2E05] text-[#4B2E05] font-bold px-8">Batal</Button>
            <Button onClick={handleReject} disabled={isProcessing || !rejectReason} className="rounded-[15px] bg-[#8E4117] hover:bg-[#7a3713] text-white font-bold px-8 shadow-md">Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}