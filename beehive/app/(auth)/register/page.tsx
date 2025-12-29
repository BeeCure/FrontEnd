"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CiRead, CiUnread } from "react-icons/ci";

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isPasswordMatch = password === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !isPasswordMatch;

  const isFormValid = 
    name !== "" && 
    email !== "" && 
    phone !== "" && 
    password !== "" && 
    isPasswordMatch;

  const handleRegister = () => {
    router.push("/verifikasi");
  };

  return (
    <main className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col md:flex-row-reverse w-[90%] md:w-[85%] h-auto md:h-[80vh] max-w-[1100px] bg-[#F4B740] rounded-[15px] shadow-2xl overflow-hidden border border-black/5">
        
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-[5%] text-[#4B2E05]">
          <div className="mb-14 flex flex-col gap-2 items-center">
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
          <h2 className="text-3xl font-bold mb-6 tracking-widest uppercase">Registrasi</h2>

          <form className="w-full max-w-[360px] space-y-3">
            <div className="space-y-1">
              <Label className="text-base font-bold ml-1">Nama Lengkap</Label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-base font-bold ml-1">Email</Label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-base font-bold ml-1">No Telepon</Label>
              <Input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-base font-bold ml-1">Kata Sandi</Label>
              <div className="relative">
                <Input 
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md pr-10 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl opacity-60">
                  {showPass ? <CiUnread /> : <CiRead />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-base font-bold ml-1">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Input 
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md pr-10 focus-visible:ring-2 focus-visible:ring-[#4B2E05] ${showMatchError ? 'ring-2 ring-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl opacity-60">
                  {showConfirmPass ? <CiUnread /> : <CiRead />}
                </button>
              </div>
              {showMatchError && (
                <p className="text-[10px] text-red-600 font-bold ml-2">Kata sandi tidak cocok</p>
              )}
            </div>

            <div className="flex justify-end px-1 pt-1">
              <p className="text-[13px] font-medium text-[#4B2E05]">
                Sudah Punya Akun?{" "}
                <Link href="/login" className="font-bold cursor-pointer hover:underline">
                  Masuk
                </Link>
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                type="button"
                disabled={!isFormValid}
                onClick={handleRegister}
                className="w-40 h-10 bg-[#3D2504] hover:bg-[#2a1a03] text-[#FFF8E1] rounded-full text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                Daftar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}