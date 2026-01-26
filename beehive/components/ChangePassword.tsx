"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CiRead, CiUnread } from "react-icons/ci";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChangePassword({ 
  children, 
  email 
}: { 
  children: React.ReactNode;
  email: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const isMatch = formData.newPassword === formData.confirmNewPassword;
  const isFormValid = 
    formData.oldPassword !== "" && 
    formData.newPassword !== "" && 
    isMatch && 
    formData.newPassword.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Kata sandi berhasil diubah!");
        setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
        window.location.reload();
      } else {
        alert(result.message || "Gagal mengubah kata sandi.");
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
        <DialogTitle className="sr-only">Ganti Kata Sandi</DialogTitle>
        <DialogDescription className="sr-only">Masukkan kata sandi lama dan baru Anda untuk memperbarui keamanan akun.</DialogDescription>

        <h2 className="text-2xl font-bold text-[#4B2E05] text-center mb-6 uppercase tracking-wider">
          Ganti Kata Sandi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-[#4B2E05]">
          {/* Kata Sandi Lama */}
          <div className="space-y-1">
            <Label className="text-lg font-bold ml-1">Kata Sandi Lama</Label>
            <div className="relative">
              <Input
                type={showOld ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 pr-12 focus-visible:ring-2 focus-visible:ring-[#4B2E05]"
              />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl opacity-60">
                {showOld ? <CiUnread /> : <CiRead />}
              </button>
            </div>
          </div>

          {/* Kata Sandi Baru */}
          <div className="space-y-1">
            <Label className="text-lg font-bold ml-1">Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 pr-12 focus-visible:ring-2 focus-visible:ring-[#4B2E05]"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl opacity-60">
                {showNew ? <CiUnread /> : <CiRead />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Kata Sandi Baru */}
          <div className="space-y-1">
            <Label className="text-lg font-bold ml-1">Konfirmasi Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={formData.confirmNewPassword}
                onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                className={cn(
                  "h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 pr-12 focus-visible:ring-2 focus-visible:ring-[#4B2E05]",
                  formData.confirmNewPassword && !isMatch && "ring-2 ring-red-500"
                )}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl opacity-60">
                {showConfirm ? <CiUnread /> : <CiRead />}
              </button>
            </div>
            {formData.confirmNewPassword && !isMatch && (
              <p className="text-xs text-red-700 font-bold ml-2">Kata sandi tidak cocok</p>
            )}
          </div>

          <div className="flex gap-4 w-full justify-center pt-6">
            <DialogClose asChild>
              <button type="button" className="w-32 h-10 bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-[15px] text-lg font-bold shadow-md transition-all active:scale-95">
                Batal
              </button>
            </DialogClose>
            
            <Button 
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-32 h-10 bg-[#34581B] hover:bg-[#2c4b17] text-white rounded-[15px] text-lg font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}