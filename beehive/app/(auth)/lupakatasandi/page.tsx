"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HiOutlineMail } from "react-icons/hi";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { showToast } from "@/components/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    const toastId = showToast.loading("Sedang mengirim link reset...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast.success(result.message || "Link reset kata sandi telah dikirim ke email anda.", toastId);
      } else {
        showToast.error(result.message || "Terjadi kesalahan.", toastId);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          <div className="mb-10 text-center">
             <HiOutlineMail size={110} className="text-[#4B2E05]/90 drop-shadow-sm mx-auto" />
             <h2 className="text-2xl font-bold mt-4 uppercase tracking-wider">Lupa Kata Sandi</h2>
             <p className="text-sm mt-2 opacity-80">Masukkan email anda untuk menerima link reset.</p>
          </div>

          <form onSubmit={handleForgotPassword} className="w-full max-w-[340px] space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xl font-bold ml-1">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05]"
                required
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                disabled={!email || isLoading}
                className="w-40 h-10 bg-[#3D2504] hover:bg-[#2a1a03] text-[#FFF8E1] rounded-[15px] text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Mengirim..." : "Kirim Link"}
              </Button>
            </div>

            <div className="flex justify-center pt-2">
              <Link href="/login" className="flex items-center gap-1 text-sm font-bold hover:underline">
                <ChevronLeft size={16} /> Kembali ke Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}