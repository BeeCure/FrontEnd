"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SiSimplelogin } from "react-icons/si";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Link reset kata sandi telah dikirim ke email anda.");
      } else {
        alert(result.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col md:flex-row w-[90%] md:w-[85%] h-auto md:h-[80vh] max-w-[1100px] bg-[#F4B740] rounded-[15px] shadow-2xl overflow-hidden border border-black/5">
        
        <div className="hidden md:flex md:flex-1 flex-col items-center justify-center p-12 text-[#4B2E05]">
          <div className="mb-14 flex flex-col gap-2 items-center -mt-8">
            <div className="space-y-[8px] flex flex-col items-center transform scale-125">
              <div className="w-28 h-[14px] bg-[#4B2E05] rounded-full" />
              <div className="flex gap-2">
                <div className="w-16 h-[14px] bg-[#4B2E05] rounded-full" />
                <div className="w-12 h-[14px] bg-[#4B2E05] rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-[14px] bg-[#4B2E05] rounded-full" />
                <div className="w-24 h-[14px] bg-[#4B2E05] rounded-full" />
              </div>
              <div className="w-32 h-[14px] bg-[#4B2E05] rounded-full" />
              <div className="w-24 h-[14px] bg-[#4B2E05] rounded-full" />
            </div>
          </div>
          <h1 className="text-6xl font-medium tracking-tight mb-6">Bee HIVE</h1>
          <div className="text-center text-2xl font-medium leading-relaxed opacity-90">
            <p>Solusi Pelihara Lebah</p>
            <p>Madu Sendiri</p>
          </div>
        </div>

        <div className="hidden md:block w-[1px] bg-[#FFF8E1]/60 my-20" />

        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-[#4B2E05]">
          <div className="mb-10 text-center">
             <SiSimplelogin size={110} className="text-[#4B2E05]/90 drop-shadow-sm mx-auto" />
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
                className="w-48 h-10 bg-[#3D2504] hover:bg-[#2a1a03] text-[#FFF8E1] rounded-full text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
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