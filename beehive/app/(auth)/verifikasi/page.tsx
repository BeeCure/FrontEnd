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

export default function RoleVerificationPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("Pilih Peran");
  const [socialLink, setSocialLink] = useState("");

  // validasi role
  const isFormValid = 
    role === "Pengguna Biasa" || 
    (role === "Praktisi" && socialLink.trim() !== "");

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
          <h2 className="text-3xl font-bold mb-12 tracking-widest uppercase text-center leading-tight">
            Verifikasi Peran
          </h2>

          <form className="w-full max-w-[340px] space-y-8">
            <div className="space-y-2">
              <Label className="text-xl font-bold ml-1">Peran Pengguna</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex h-11 w-full items-center justify-between rounded-[15px] border-none bg-[#FFF8E1] px-4 py-2 text-lg shadow-md hover:bg-[#FFF8E1] focus:ring-2 focus:ring-[#4B2E05]"
                  >
                    <span className={role === "Pilih Peran" ? "opacity-50" : ""}>{role}</span>
                    <ChevronDown className="h-5 w-5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[360px] rounded-[15px] border-none bg-[#FFF8E1] shadow-xl"
                  align="start"
                >
                  <DropdownMenuItem 
                    onClick={() => {
                        setRole("Praktisi");
                        setSocialLink(""); 
                    }}
                    className="text-lg font-medium text-[#4B2E05] focus:bg-[#F4B740] focus:text-[#4B2E05] cursor-pointer rounded-[10px] m-1"
                  >
                    Praktisi
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setRole("Pengguna Biasa")}
                    className="text-lg font-medium text-[#4B2E05] focus:bg-[#F4B740] focus:text-[#4B2E05] cursor-pointer rounded-[10px] m-1"
                  >
                    Pengguna Biasa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {role === "Praktisi" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="text-xl font-bold ml-1">Link Sosial Media</Label>
                    <Input 
                        value={socialLink}
                        onChange={(e) => setSocialLink(e.target.value)}
                        className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md focus-visible:ring-2 focus-visible:ring-[#4B2E05] text-lg"
                    />
                </div>
            )}

            <div className="flex justify-center pt-6">
              <Button 
                type="button"
                disabled={!isFormValid}
                onClick={() => router.push("/login")}
                className="w-48 h-10 bg-[#3D2504] hover:bg-[#2a1a03] text-[#FFF8E1] rounded-full text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                Selesai
              </Button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}