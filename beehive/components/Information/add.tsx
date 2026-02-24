"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showToast } from "@/components/Toast";

export default function AddDataBee({ onSuccess }: { onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    genus: "",
    subGenus: "",
    discoverer: "",
    discoveredYear: "",
    distribution: "",
  });

  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);

  const imageKeys = ["bodyShape", "wingShape", "entranceShape", "honeyPouchShape"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeIdx !== null) {
      const newFiles = [...files];
      const newPreviews = [...previews];
      newFiles[activeIdx] = file;
      newPreviews[activeIdx] = URL.createObjectURL(file);
      setFiles(newFiles);
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const toastId = showToast.loading("Sedang menambahkan data lebah...");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    files.forEach((file, index) => {
      if (file) data.append(imageKeys[index], file);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bee/add`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok) {
        showToast.success(result.message || "Data berhasil ditambahkan!", toastId);
        setIsOpen(false);
        setFormData({ name: "", scientificName: "", genus: "", subGenus: "", discoverer: "", discoveredYear: "", distribution: "" });
        setFiles([null, null, null, null]);
        setPreviews([null, null, null, null]);
        onSuccess();
      } else {
        showToast.error(result.message || "Gagal menambahkan data.", toastId);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error("Terjadi kesalahan koneksi.", toastId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#34581B] hover:bg-[#2c4b17] text-[#FFF8E1] rounded-[15px] px-6 h-10 text-lg font-bold shadow-md border-none transition-transform active:scale-95">
          Tambah Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] md:max-w-4xl bg-[#F4B740] border-none rounded-[15px] p-8 md:p-10 shadow-2xl outline-none overflow-hidden font-inder text-[#4B2E05]">
        <DialogTitle className="sr-only">Tambah Data Lebah</DialogTitle>
        <DialogDescription className="sr-only">
          Lengkapi formulir di bawah ini untuk menambahkan data spesies lebah baru ke dalam sistem.
        </DialogDescription>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start text-[#4B2E05]">
            <div className="flex-1 w-full space-y-4">
              <AddField label="Nama Lebah" id="name" value={formData.name} onChange={handleInputChange} />
              <AddField label="Spesies" id="scientificName" value={formData.scientificName} onChange={handleInputChange} />
              <AddField label="Genus" id="genus" value={formData.genus} onChange={handleInputChange} />
              <AddField label="Sub Genus" id="subGenus" value={formData.subGenus} onChange={handleInputChange} />
              <AddField label="Penemu" id="discoverer" value={formData.discoverer} onChange={handleInputChange} />
            </div>

            <div className="flex-[1.2] w-full space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AddField label="Persebaran" id="distribution" value={formData.distribution} onChange={handleInputChange} />
                <AddField label="Tahun" id="discoveredYear" value={formData.discoveredYear} onChange={handleInputChange} />
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-sm font-bold ml-1 opacity-80 uppercase tracking-tight">DOKUMENTASI FOTO</Label>
                <div className="grid grid-cols-2 gap-3">
                  <UploadBox label="Foto Tubuh Lebah" img={previews[0]} onClick={() => { setActiveIdx(0); fileInputRef.current?.click(); }} />
                  <UploadBox label="Foto Sayap Lebah" img={previews[1]} onClick={() => { setActiveIdx(1); fileInputRef.current?.click(); }} />
                  <UploadBox label="Foto Pintu Masuk" img={previews[2]} onClick={() => { setActiveIdx(2); fileInputRef.current?.click(); }} />
                  <UploadBox label="Foto Kantong Madu" img={previews[3]} onClick={() => { setActiveIdx(3); fileInputRef.current?.click(); }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" onClick={() => setIsOpen(false)} className="bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-[15px] px-10 h-10 font-bold border-none shadow-md">Batal</Button>
            <Button type="submit" disabled={isLoading} className="bg-[#34581B] hover:bg-[#2c4b17] text-white rounded-[15px] px-10 h-10 font-bold border-none shadow-md transition-all active:scale-95 disabled:opacity-50">
              {isLoading ? <Loader2 className="animate-spin" /> : "Simpan Data"}
            </Button>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddField({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-bold ml-1 opacity-90 uppercase tracking-tight">{label}</Label>
      <Input 
        id={id} 
        value={value} 
        onChange={onChange} 
        autoComplete="off"
        className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-[#4B2E05] font-semibold px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]/20 transition-all" 
      />
    </div>
  );
}

function UploadBox({ label, img, onClick }: { label: string; img: string | null; onClick: () => void }) {
  return (
    <div 
      onClick={onClick} 
      className="group relative flex flex-col items-center justify-center bg-[#FFF8E1] rounded-[15px] aspect-video cursor-pointer shadow-inner border-2 border-dashed border-[#4B2E05]/10 hover:border-[#4B2E05]/40 transition-all overflow-hidden"
    >
      {img ? (
        <Image src={img} alt="Preview" fill className="object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 bg-[#F4B740]/20 rounded-full text-[#4B2E05] group-hover:scale-110 transition-transform">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="text-[10px] font-bold uppercase text-[#4B2E05]/60">{label}</span>
        </div>
      )}
      {img && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={24} className="text-white" />
        </div>
      )}
    </div>
  );
}