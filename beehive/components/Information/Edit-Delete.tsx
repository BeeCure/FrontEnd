"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bee } from "@/app/(main)/informasi/page";

interface EditDeleteProps {
  bee: Bee | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditDeleteBeeDialog({ bee, isOpen, onOpenChange, onSuccess }: EditDeleteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeImgIdx, setActiveImgIdx] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    genus: "",
    subGenus: "",
    distribution: "",
    discoverer: "",
    discoveredYear: "",
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);

  const imageKeys = ["bodyShape", "wingShape", "entranceShape", "honeyPouchShape"];

  useEffect(() => {
    if (bee) {
      setFormData({
        name: bee.name,
        scientificName: bee.scientificName,
        genus: bee.genus,
        subGenus: bee.subGenus,
        distribution: bee.distribution,
        discoverer: bee.discoverer,
        discoveredYear: bee.discoveredYear.toString(),
      });
      setPreviews([
        bee.images?.bodyShape || "",
        bee.images?.wingShape || "",
        bee.images?.entranceShape || "",
        bee.images?.honeyPouchShape || "",
      ]);
      setFiles([null, null, null, null]);
    }
  }, [bee]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImgIdx !== null) {
      const newFiles = [...files];
      const newPreviews = [...previews];
      newFiles[activeImgIdx] = file;
      newPreviews[activeImgIdx] = URL.createObjectURL(file);
      setFiles(newFiles);
      setPreviews(newPreviews);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bee) return;
    setIsLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    files.forEach((file, i) => { if (file) data.append(imageKeys[i], file); });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bee/species/${bee.id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      if (res.ok) {
        alert("Data berhasil diperbarui!");
        setIsEditing(false);
        onSuccess();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Gagal memperbarui data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bee) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bee/species/${bee.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        alert("Data berhasil dihapus!");
        onOpenChange(false);
        onSuccess();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Gagal menghapus data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if(!open) setIsEditing(false); }}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl bg-[#F4B740] border-none rounded-[15px] p-6 md:p-10 shadow-2xl outline-none overflow-hidden font-inder">
        <DialogTitle className="sr-only">Detail {bee?.name}</DialogTitle>
        <DialogDescription className="sr-only">Informasi lengkap mengenai spesifikasi lebah.</DialogDescription>
        
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center md:items-stretch w-full">
          
          {/* GALERI GAMBAR */}
          <div className="w-full md:w-[45%] grid grid-cols-2 gap-3 h-fit self-center">
            {previews.map((src, i) => (
              <div 
                key={i} 
                onClick={() => isEditing && (setActiveImgIdx(i), fileInputRef.current?.click())} 
                className={cn(
                  "relative aspect-square w-full bg-[#FFF8E1] rounded-[15px] overflow-hidden shadow-md border-2 border-[#FFF8E1] transition-all", 
                  isEditing ? "cursor-pointer hover:border-[#4B2E05]/40 group/img" : "cursor-default"
                )}
              >
                <Image src={src || "/Image/Lebah1.png"} alt="Bee Part" fill className="object-cover" unoptimized />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* KOTAK INFORMASI */}
          <div className="flex-1 w-full bg-[#FFF8E1] rounded-[15px] p-6 md:p-8 shadow-xl text-[#4B2E05] flex flex-col justify-between overflow-hidden border border-black/5">
            {!isEditing ? (
              <>
                <div className="space-y-3.5 text-[15px] lg:text-base">
                  <DetailRow label="Nama" value={bee?.name} />
                  <DetailRow label="Nama Latin" value={bee?.scientificName} isItalic />
                  <DetailRow label="Sub-Genus" value={bee?.subGenus} />
                  <DetailRow label="Genus" value={bee?.genus} />
                  <DetailRow label="Persebaran" value={bee?.distribution} />
                  <DetailRow label="Penemu" value={bee?.discoverer} />
                  <DetailRow label="Tahun" value={bee?.discoveredYear?.toString()} />
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-[15px] px-8 h-9 font-bold border-none shadow-md transition-transform active:scale-95">Hapus</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#FFF8E1] border-none rounded-[15px] font-inder text-[#4B2E05]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">Hapus Data Lebah?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#4B2E05]/80 text-sm">Tindakan ini permanen dan data tidak bisa dikembalikan.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="rounded-[15px] border-2 border-[#4B2E05] font-bold">Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-[15px] font-bold px-6">Ya, Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button onClick={() => setIsEditing(true)} className="bg-[#34581B] hover:bg-[#2c4b17] text-white rounded-[15px] px-8 h-9 font-bold border-none shadow-md transition-all active:scale-95">Edit</Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-2.5">
                <EditField label="Nama" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <EditField label="Nama Latin" id="scientificName" value={formData.scientificName} onChange={(e) => setFormData({...formData, scientificName: e.target.value})} />
                <EditField label="Sub-Genus" id="subGenus" value={formData.subGenus} onChange={(e) => setFormData({...formData, subGenus: e.target.value})} />
                <EditField label="Genus" id="genus" value={formData.genus} onChange={(e) => setFormData({...formData, genus: e.target.value})} />
                <EditField label="Persebaran" id="distribution" value={formData.distribution} onChange={(e) => setFormData({...formData, distribution: e.target.value})} />
                <EditField label="Penemu" id="discoverer" value={formData.discoverer} onChange={(e) => setFormData({...formData, discoverer: e.target.value})} />
                <EditField label="Tahun" id="discoveredYear" value={formData.discoveredYear} onChange={(e) => setFormData({...formData, discoveredYear: e.target.value})} />
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" onClick={() => setIsEditing(false)} className="bg-[#8E4117] text-white rounded-[15px] px-8 h-9 font-bold shadow-md">Batal</Button>
                  <Button type="submit" disabled={isLoading} className="bg-[#34581B] text-white rounded-[15px] px-8 h-9 font-bold shadow-md">
                    {isLoading ? <Loader2 className="animate-spin size-4" /> : "Simpan"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value, isItalic = false }: { label: string, value: string | undefined, isItalic?: boolean }) {
  return (
    <div className="grid grid-cols-[90px_15px_1fr] md:grid-cols-[100px_20px_1fr] items-start w-full text-left">
      <span className="opacity-60 whitespace-nowrap uppercase text-[10px] md:text-[12px] font-bold tracking-wider pt-0.5">{label}</span>
      <span className="text-center">:</span>
      <span className={cn("font-bold break-words", isItalic && "italic")}>{value || "-"}</span>
    </div>
  );
}

function EditField({ label, id, value, onChange }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="grid grid-cols-[85px_1fr] md:grid-cols-[95px_1fr] items-center gap-2">
      <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest text-left">{label}</span>
      <Input 
        id={id} 
        value={value || ""} 
        onChange={onChange} 
        className="h-8 rounded-[15px] border-none bg-[#F4B740]/10 shadow-inner text-[#4B2E05] font-bold focus-visible:ring-1 px-4 text-sm" 
      />
    </div>
  );
}