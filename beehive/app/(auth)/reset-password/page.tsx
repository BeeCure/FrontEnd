"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CiRead, CiUnread } from "react-icons/ci";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { showToast } from "@/components/Toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const isMatch = newPassword === confirmNewPassword;
  const isFormValid = newPassword.length >= 8 && isMatch && token;
  const showError = confirmNewPassword.length > 0 && !isMatch;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    const toastId = showToast.loading("Sedang memperbarui kata sandi...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast.success(result.message || "Kata sandi berhasil diperbarui!", toastId);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        showToast.error(result.message || "Gagal memperbarui password.", toastId);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error("Terjadi kesalahan koneksi ke server.", toastId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-[90%] md:w-[85%] h-auto md:h-[80vh] max-w-[1100px] bg-[#F4B740] rounded-[15px] shadow-2xl overflow-hidden border border-black/5">
      <div className="hidden md:flex md:flex-1 flex-col items-center justify-center p-12">
          <Image 
            src="/Image/logo-secondary-choco.png" 
            alt="Bee HIVE Logo" 
            width={400} 
            height={400} 
            className="w-full max-w-[320px] object-contain"
            priority
          />
        </div>

      <div className="hidden md:block w-[1px] bg-[#FFF8E1]/60 my-20" />

      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-[#4B2E05]">
        <h2 className="text-3xl font-bold mb-12 tracking-widest uppercase text-center leading-tight">
          Ganti Kata <br /> Sandi
        </h2>

        <form onSubmit={handleResetPassword} className="w-full max-w-[340px] space-y-8">
          <div className="space-y-2">
            <Label className="text-xl font-bold ml-1">Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05] pr-12 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-[#4B2E05]/60 hover:text-[#4B2E05] transition-colors"
              >
                {showNewPass ? <CiUnread /> : <CiRead />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xl font-bold ml-1">Konfirmasi Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                type={showConfirmPass ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={`h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05] pr-12 text-lg ${showError ? 'ring-2 ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-[#4B2E05]/60 hover:text-[#4B2E05] transition-colors"
              >
                {showConfirmPass ? <CiUnread /> : <CiRead />}
              </button>
            </div>
            {showError && (
              <p className="text-xs text-red-600 font-bold ml-2">Kata sandi tidak cocok</p>
            )}
          </div>

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-48 h-10 bg-[#3D2504] hover:bg-[#2a1a03] text-[#FFF8E1] rounded-[15px] text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Selesai"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex items-center justify-center w-full h-full">
      <Suspense fallback={<div className="text-[#4B2E05] font-bold">Memuat...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}