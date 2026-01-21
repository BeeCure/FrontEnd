"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";

interface EditProfileProps {
  children: React.ReactNode;
  initialData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    avatarUrl: string | null;
  };
}

export default function EditProfile({ children, initialData }: EditProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData.name,
    phone: initialData.phone || "",
    address: initialData.address || "",
  });

  const getBustedUrl = (url: string | null) => {
    if (!url) return null;
    return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(getBustedUrl(initialData.avatarUrl));

  useEffect(() => {
    setFormData({
      name: initialData.name,
      phone: initialData.phone || "",
      address: initialData.address || "",
    });
    setPreviewUrl(getBustedUrl(initialData.avatarUrl));
  }, [initialData]);

  const isFormValid = formData.name.trim() !== "" && formData.phone.trim() !== "" && formData.address.trim() !== "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    if (selectedFile) data.append("avatar", selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update-profile`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.reload();
      } else {
        alert(result.message || "Gagal memperbarui profil");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[92%] sm:w-full max-w-[450px] bg-[#F4B740] border-none rounded-[15px] p-8 shadow-2xl">
        <DialogTitle className="sr-only">Edit Profil</DialogTitle>
        <DialogDescription className="sr-only">Perbarui foto dan informasi data diri Anda.</DialogDescription>

        <form onSubmit={handleSave} className="flex flex-col items-center gap-6">
          <div 
            className="relative group cursor-pointer" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="w-32 h-32 border-4 border-[#FFF8E1] shadow-lg">
              <AvatarImage src={previewUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-[#FFF8E1] text-[#4B2E05] font-bold text-2xl">
                {formData.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Pencil size={35} className="text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="w-full space-y-4 text-[#4B2E05]">
            <div className="space-y-1">
              <Label className="text-lg font-bold ml-1">Nama Lengkap</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-bold ml-1">No Telepon</Label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1 opacity-70">
              <Label className="text-lg font-bold ml-1">Email (Tidak dapat diubah)</Label>
              <Input 
                value={initialData.email} 
                disabled 
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1]/60 cursor-not-allowed text-lg px-4" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-bold ml-1">Alamat</Label>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>
          </div>

          <div className="flex gap-4 w-full justify-center pt-4">
            <DialogClose asChild>
              <Button type="button" className="w-32 h-10 bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-full text-lg font-bold shadow-md">
                Batal
              </Button>
            </DialogClose>
            <Button 
              disabled={!isFormValid || isLoading} 
              type="submit" 
              className="w-32 h-10 bg-[#34581B] hover:bg-[#2c4b17] text-white rounded-full text-lg font-bold shadow-md disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}