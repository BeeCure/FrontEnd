import React, { useState } from "react";
import { MdOutlineRestore } from "react-icons/md";
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

interface AkunTidakAktifProps {
  list: UserData[];
  onCardClick: (userId: string) => void;
  refreshData: () => void;
}

export default function AkunTidakAktif({ list, onCardClick, refreshData }: AkunTidakAktifProps) {
  const [isReactivateOpen, setIsReactivateOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reactivateNote, setReactivateNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReactivate = async () => {
    setIsProcessing(true);
    const toastId = showToast.loading("Mengaktifkan kembali...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/practitioners/${selectedUserId}/reactivate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: reactivateNote }),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        showToast.success(result.message, toastId);
        setIsReactivateOpen(false);
        setReactivateNote("");
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
      <h3 className="text-lg font-bold text-center mb-4 uppercase tracking-[0.1em] shrink-0">Akun Tidak Aktif</h3>
      <div className="h-[2px] bg-[#4B2E05] w-full mb-6 opacity-30 shrink-0" />
      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide h-auto max-h-[380px]">
        {list.map((item) => (
          <div key={item.id} onClick={() => onCardClick(item.id)} className="bg-[#FFF8E1] rounded-[15px] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer text-left shrink-0">
            <div className="flex flex-col truncate pr-2"><span className="font-bold text-sm md:text-base truncate">{item.name}</span><span className="text-[10px] opacity-70 truncate">{item.email}</span></div>
            <button onClick={(e) => { e.stopPropagation(); setSelectedUserId(item.id); setIsReactivateOpen(true); }} className="p-1.5 transition-transform hover:scale-125 text-[#4B2E05] shrink-0"><MdOutlineRestore size={28} /></button>
          </div>
        ))}
      </div>

      <Dialog open={isReactivateOpen} onOpenChange={setIsReactivateOpen}>
        <DialogContent className="bg-[#F4B740] border-none rounded-[15px] w-[92%] sm:w-full max-w-[400px] p-8 shadow-2xl font-inder text-[#4B2E05]">
          <DialogHeader><DialogTitle className="text-2xl font-bold text-center text-[#4B2E05]">Aktifkan Kembali</DialogTitle><DialogDescription className="text-center text-[#4B2E05]/80 font-inder">Catatan pengaktifan kembali.</DialogDescription></DialogHeader>
          <div className="py-6"><Input placeholder="Catatan tambahan" value={reactivateNote} onChange={(e) => setReactivateNote(e.target.value)} className="h-12 rounded-[15px] border-none bg-white shadow-inner px-4" /></div>
          <DialogFooter className="flex flex-row gap-3 justify-center sm:justify-center">
            <Button onClick={() => setIsReactivateOpen(false)} variant="outline" className="rounded-[15px] border-2 border-[#4B2E05] text-[#4B2E05] font-bold px-8">Batal</Button>
            <Button onClick={handleReactivate} disabled={isProcessing} className="rounded-[15px] bg-[#34581B] hover:bg-[#2c4b17] text-white font-bold px-8 shadow-md">Reactivate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}