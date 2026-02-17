"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { showToast } from "@/components/Toast";
import { motion } from "motion/react";

export default function RoleVerificationPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("Pilih Peran");
  const [socialLink, setSocialLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRoleValid = role === "Pengguna Biasa" || (role === "Praktisi" && socialLink.trim() !== "");

  const handleRegister = async () => {
    const savedData = sessionStorage.getItem("registrasi_data");
    if (!savedData) return router.push("/register");

    const basicData = JSON.parse(savedData);
    setIsLoading(true);
    const toastId = showToast.loading("Sedang memproses pendaftaran...");

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
        showToast.success("Registrasi berhasil! Cek email Anda untuk kode OTP.", toastId);
        // Redirect ke halaman verifikasi yang baru
        router.push("/otp");
      } else {
        showToast.error(result.message || "Gagal melakukan registrasi.", toastId);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error("Gagal terhubung ke server.", toastId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full h-full font-inder">
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row-reverse w-[90%] md:w-[85%] h-auto md:h-[80vh] max-w-[1100px] bg-[#F4B740] rounded-[15px] shadow-2xl overflow-hidden border border-black/5"
      >
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex md:flex-1 flex-col items-center justify-center p-12"
        >
          <Image 
            src="/Image/logo-secondary-choco.png" 
            alt="Bee HIVE Logo" 
            width={400} 
            height={400} 
            className="w-full max-w-[320px] object-contain"
            priority
          />
        </motion.div>

        <div className="hidden md:block w-[1px] bg-[#FFF8E1]/60 my-20" />

        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-[#4B2E05]"
        >
          <div className="w-full max-w-[340px] flex flex-col items-center">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold mb-12 tracking-widest uppercase text-center leading-tight"
            >
              Verifikasi Peran
            </motion.h2>
            <div className="w-full space-y-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="space-y-2"
              >
                <Label className="text-xl font-bold ml-1">Peran Pengguna</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex h-11 w-full items-center justify-between rounded-[15px] border-none bg-[#FFF8E1] px-4 text-lg shadow-md hover:bg-[#FFF8E1]">
                      <span className={role === "Pilih Peran" ? "opacity-50" : ""}>{role}</span>
                      <ChevronDown className="h-5 w-5 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[340px] rounded-[15px] border-none bg-[#FFF8E1] shadow-xl">
                    <DropdownMenuItem onClick={() => { setRole("Praktisi"); setSocialLink(""); }} className="text-lg font-medium text-[#4B2E05] focus:bg-[#F4B740] cursor-pointer rounded-[15px] m-1">Praktisi</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setRole("Pengguna Biasa"); setSocialLink(""); }} className="text-lg font-medium text-[#4B2E05] focus:bg-[#F4B740] cursor-pointer rounded-[15px] m-1">Pengguna Biasa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              {role === "Praktisi" && (
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-2"
                >
                  <Label className="text-xl font-bold ml-1">Link Sosial Media</Label>
                  <Input value={socialLink} onChange={(e) => setSocialLink(e.target.value)} className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05] text-lg px-4" />
                </motion.div>
              )}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex justify-center w-full"
              >
                <Button disabled={!isRoleValid || isLoading} onClick={handleRegister} className="w-40 h-10 mt-6 bg-[#3D2504] text-[#FFF8E1] rounded-[15px] text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50">
                  {isLoading ? "Memproses..." : "Selesai"}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}