"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CiRead, CiUnread } from "react-icons/ci";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const showMatchError = formData.confirmPassword.length > 0 && !isPasswordMatch;

  const isFormValid = 
    formData.name !== "" && 
    formData.email !== "" && 
    formData.phone !== "" && 
    formData.password !== "" && 
    isPasswordMatch;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    sessionStorage.setItem("registrasi_data", JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    }));

    router.push("/verifikasi");
  };

  return (
    <main className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col md:flex-row-reverse w-[90%] md:w-[85%] h-auto md:h-[80vh] max-w-[1100px] bg-[#F4B740] rounded-[15px] shadow-2xl overflow-hidden border border-black/5">
        
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
          <h2 className="text-3xl font-bold mb-6 tracking-widest uppercase">Registrasi</h2>

          <form onSubmit={handleRegister} className="w-full max-w-[360px] space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-base font-bold ml-1">Nama Lengkap</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-base font-bold ml-1">Email</Label>
              <Input 
                id="email"
                type="email" 
                value={formData.email}
                onChange={handleInputChange}
                className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-base font-bold ml-1">No Telepon</Label>
              <Input 
                id="phone"
                type="tel" 
                value={formData.phone}
                onChange={handleInputChange}
                className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-base font-bold ml-1">Kata Sandi</Label>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-10 rounded-[15px] border-none bg-[#FFF8E1] shadow-md pr-10 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl opacity-60">
                  {showPass ? <CiUnread /> : <CiRead />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-base font-bold ml-1">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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
                Sudah Punya Akun? <Link href="/login" className="font-bold cursor-pointer hover:underline">Masuk</Link>
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                type="submit"
                disabled={!isFormValid}
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