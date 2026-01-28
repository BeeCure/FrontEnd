import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
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

interface AkunAktifProps {
  list: UserData[];
  onCardClick: (userId: string) => void;
  refreshData: () => void;
}

export default function AkunAktif({ list, onCardClick, refreshData }: AkunAktifProps) {
  const [isInactivateOpen, setIsInactivateOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inactivateData, setInactivateData] = useState({ reason: "", note: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInactivate = async () => {
    if (!inactivateData.reason.trim()) return showToast.error("Alasan wajib diisi");
    setIsProcessing(true);
    const toastId = showToast.loading("Menonaktifkan akun...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/practitioners/${selectedUserId}/inactivate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inactivateData),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        showToast.success(result.message, toastId);
        setIsInactivateOpen(false);
        setInactivateData({ reason: "", note: "" });
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
      <h3 className="text-lg font-bold text-center mb-4 uppercase tracking-[0.1em] shrink-0">Akun Aktif</h3>
      <div className="h-[2px] bg-[#4B2E05] w-full mb-6 opacity-30 shrink-0" />
      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide h-auto max-h-[380px]">
        {list.map((item) => (
          <div key={item.id} onClick={() => onCardClick(item.id)} className="bg-[#FFF8E1] rounded-[15px] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer text-left shrink-0">
            <div className="flex flex-col truncate pr-2"><span className="font-bold text-sm md:text-base truncate">{item.name}</span><span className="text-[10px] opacity-70 truncate">{item.email}</span></div>
            <button onClick={(e) => { e.stopPropagation(); setSelectedUserId(item.id); setIsInactivateOpen(true); }} className="p-1.5 transition-transform hover:scale-125 text-[#4B2E05] shrink-0"><RiDeleteBin6Line size={28} /></button>
          </div>
        ))}
      </div>

      <Dialog open={isInactivateOpen} onOpenChange={setIsInactivateOpen}>
        <DialogContent className="bg-[#F4B740] border-none rounded-[15px] w-[92%] sm:w-full max-w-[400px] p-8 shadow-2xl font-inder text-[#4B2E05]">
          <DialogHeader><DialogTitle className="text-2xl font-bold text-center text-[#4B2E05]">Nonaktifkan Akun</DialogTitle><DialogDescription className="text-center text-[#4B2E05]/80 font-inder">Alasan akun dinonaktifkan.</DialogDescription></DialogHeader>
          <div className="py-6 space-y-4">
            <Input placeholder="Alasan (Wajib)..." value={inactivateData.reason} onChange={(e) => setInactivateData({...inactivateData, reason: e.target.value})} className="h-12 rounded-[15px] border-none bg-white shadow-inner px-4" />
            <Input placeholder="Catatan (Opsional)..." value={inactivateData.note} onChange={(e) => setInactivateData({...inactivateData, note: e.target.value})} className="h-12 rounded-[15px] border-none bg-white shadow-inner px-4 opacity-80" />
          </div>
          <DialogFooter className="flex flex-row gap-3 justify-center">
            <Button onClick={() => setIsInactivateOpen(false)} variant="outline" className="rounded-[15px] border-2 border-[#4B2E05] text-[#4B2E05] font-bold px-8">Batal</Button>
            <Button onClick={handleInactivate} disabled={isProcessing || !inactivateData.reason} className="rounded-[15px] bg-[#8E4117] hover:bg-[#7a3713] text-white font-bold px-8 shadow-md">Inactivate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}