"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HiOutlineMail } from "react-icons/hi";
import { CiRead, CiUnread } from "react-icons/ci";
import Image from "next/image";
import { showToast } from "@/components/Toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const isFormValid = formData.email !== "" && formData.password !== "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    const toastId = showToast.loading("Sedang memverifikasi...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        showToast.success(result.message || "Berhasil masuk!", toastId);
        
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        showToast.error(result.message || "Email atau password salah.", toastId);
      }
    } catch (error) {
      showToast.error("Gagal terhubung ke server.", toastId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full h-full">
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
          <div className="mb-10">
            <HiOutlineMail size={110} className="text-[#4B2E05]/90 drop-shadow-sm" />
          </div>
          <form onSubmit={handleLogin} className="w-full max-w-[340px] space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xl font-bold ml-1">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xl font-bold ml-1">Kata Sandi</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05] pr-12 text-lg" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-[#4B2E05]/60 hover:text-[#4B2E05] transition-colors">
                  {showPassword ? <CiUnread /> : <CiRead />}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center px-1 text-[13px] font-medium text-[#4B2E05]">
              <p>Belum Punya Akun? <Link href="/register" className="font-bold hover:underline">Daftar</Link></p>
              <Link href="/lupakatasandi" className="cursor-pointer hover:underline">Lupa Kata Sandi?</Link>
            </div>
            <div className="flex justify-center pt-8">
              <Button type="submit" disabled={!isFormValid || isLoading} className="w-48 h-10 bg-[#3D2504] hover:bg-[#2a1a03] text-[#FFF8E1] rounded-[15px] text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50">
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}