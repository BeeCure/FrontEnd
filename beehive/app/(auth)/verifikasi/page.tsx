"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function RoleVerificationPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "otp">("role");
  const [role, setRole] = useState<string>("Pilih Peran");
  const [socialLink, setSocialLink] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const isRoleValid = role === "Pengguna Biasa" || (role === "Praktisi" && socialLink.trim() !== "");

  const getSavedEmail = () => {
    const data = sessionStorage.getItem("registrasi_data");
    return data ? JSON.parse(data).email : null;
  };

  const handleRegister = async () => {
    const savedData = sessionStorage.getItem("registrasi_data");
    if (!savedData) return router.push("/register");

    const basicData = JSON.parse(savedData);
    setIsLoading(true);

    const payload = {
      ...basicData,
      role: role === "Praktisi" ? "PRACTITIONER" : "USER",
      facebookUrl: role === "Praktisi" ? socialLink : "none",
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        setStep("otp");
        setTimer(60);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const email = getSavedEmail();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        sessionStorage.removeItem("registrasi_data");
        router.push("/login");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan verifikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0 || isLoading) return;
    const email = getSavedEmail();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-token-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      alert(result.message);
      if (response.ok) setTimer(60);
    } catch (error) {
      alert("Gagal mengirim ulang kode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col md:flex-row-reverse w-[90%] md:w-[85%] h-auto md:h-[80vh] max-w-[1100px] bg-[#F4B740] rounded-[15px] shadow-2xl overflow-hidden border border-black/5">
        
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-[5%] text-[#4B2E05]">
          <div className="mb-14 flex flex-col gap-2 items-center">
            <div className="space-y-[8px] flex flex-col items-center transform scale-125">
              <div className="w-28 h-[14px] bg-[#4B2E05] rounded-full" />
              <div className="flex gap-2"><div className="w-16 h-[14px] bg-[#4B2E05] rounded-full" /><div className="w-12 h-[14px] bg-[#4B2E05] rounded-full" /></div>
              <div className="flex gap-2"><div className="w-12 h-[14px] bg-[#4B2E05] rounded-full" /><div className="w-24 h-[14px] bg-[#4B2E05] rounded-full" /></div>
              <div className="w-32 h-[14px] bg-[#4B2E05] rounded-full" />
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
          {step === "role" ? (
            <div className="w-full max-w-[340px] flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-12 tracking-widest uppercase text-center leading-tight">Verifikasi Peran</h2>
              <div className="w-full space-y-8">
                <div className="space-y-2">
                  <Label className="text-xl font-bold ml-1">Peran Pengguna</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex h-11 w-full items-center justify-between rounded-[15px] border-none bg-[#FFF8E1] px-4 text-lg shadow-md hover:bg-[#FFF8E1] focus:ring-2 focus:ring-[#4B2E05]">
                        <span className={role === "Pilih Peran" ? "opacity-50" : ""}>{role}</span>
                        <ChevronDown className="h-5 w-5 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[340px] rounded-[15px] border-none bg-[#FFF8E1] shadow-xl">
                      <DropdownMenuItem onClick={() => { setRole("Praktisi"); setSocialLink(""); }} className="text-lg font-medium text-[#4B2E05] focus:bg-[#F4B740] cursor-pointer rounded-[10px] m-1">Praktisi</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setRole("Pengguna Biasa"); setSocialLink(""); }} className="text-lg font-medium text-[#4B2E05] focus:bg-[#F4B740] cursor-pointer rounded-[10px] m-1">Pengguna Biasa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {role === "Praktisi" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="text-xl font-bold ml-1">Link Sosial Media</Label>
                    <Input value={socialLink} onChange={(e) => setSocialLink(e.target.value)} className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05] text-lg px-4" />
                  </div>
                )}
                <Button disabled={!isRoleValid || isLoading} onClick={handleRegister} className="w-full h-10 mt-6 bg-[#3D2504] text-[#FFF8E1] rounded-full text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50">
                  {isLoading ? "Memproses..." : "Selesai"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[340px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-[#4B2E05]/10 p-4 rounded-full mb-6 text-[#4B2E05]"><Mail size={40} /></div>
              <h2 className="text-2xl font-bold mb-2">Verifikasi Kode</h2>
              <p className="text-sm text-center mb-8 opacity-80">Masukkan 6 digit kode yang kami kirimkan ke email Anda</p>
              <div className="space-y-8 flex flex-col items-center w-full">
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="w-10 h-12 md:w-12 md:h-14 rounded-xl border-none bg-[#FFF8E1] shadow-md text-xl font-bold text-[#4B2E05]" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <Button disabled={otpValue.length < 6 || isLoading} onClick={handleVerifyOTP} className="w-full h-10 bg-[#3D2504] text-[#FFF8E1] rounded-full text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50">
                  {isLoading ? "Memproses..." : "Verifikasi"}
                </Button>
                <p className="text-xs font-medium opacity-70">
                  Tidak menerima kode?{" "}
                  <button 
                    type="button" 
                    disabled={timer > 0 || isLoading} 
                    onClick={handleResendOTP} 
                    className={`font-bold underline transition-colors ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:text-[#3D2504]'}`}
                  >
                    {timer > 0 ? `Kirim Ulang (${timer}s)` : "Kirim Ulang"}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}