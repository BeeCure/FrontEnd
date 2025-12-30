"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, KeyRound, LogOut } from "lucide-react";
import EditProfile from "@/components/EditProfile";
import ResetPassword from "@/components/ResetPassword";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const router = useRouter();

  const user = {
    name: "Arswendo Erza Sadewa",
    email: "aarswendoerza00@gmail.com",
    phone: "081234567890",
    address: "Jl. Madu Murni No. 123, MLampung Tengah, Lamping",
    image: "https://github.com/shadcn.png",
  };

  return (
    <main className="min-h-screen w-full bg-[#FFF8E1] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-start gap-8 md:gap-12">
        
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-[#4B2E05]">          
          <div className="flex flex-col items-center w-full">
            <Avatar className="w-40 h-40 border-4 border-[#F4B740] mb-12 shadow-lg">
              <AvatarImage src={user.image} alt={user.name} className="object-cover" />
              <AvatarFallback className="bg-gray-300 text-3xl">AE</AvatarFallback>
            </Avatar>

            <div className="w-full space-y-2">
              <EditProfile>
                <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all">
                  <Pencil size={24} />
                  <span className="text-lg font-medium">Edit Profil</span>
                </div>
              </EditProfile>
              
              <ResetPassword>
                <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all">
                  <KeyRound size={24} />
                  <span className="text-lg font-medium">Ganti Kata Sandi</span>
                </div>
              </ResetPassword>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all text-red-700 md:text-[#4B2E05]">
                    <LogOut size={24} />
                    <span className="text-lg font-medium">Keluar</span>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%] sm:w-full max-w-[450px] bg-[#FFF8E1] border-none rounded-[15px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#4B2E05] font-bold text-2xl">Apakah Anda yakin ingin keluar?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#4B2E05]/80">
                      Tindakan ini akan mengakhiri sesi Anda dan Anda harus login ulang untuk mengakses sistem.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full border-[#4B2E05] text-[#4B2E05]">Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => router.push("/login")}
                      className="bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-full"
                    >
                      Keluar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-[4px] h-[470px] bg-[#4B2E05] rounded-full self-center opacity-80" />

        <div className="w-full md:w-2/3 bg-[#F4B740] rounded-[15px] p-8 md:p-7 shadow-2xl">
          <h2 className="text-3xl font-bold text-[#4B2E05] mb-4">Profil</h2>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-lg font-bold text-[#4B2E05] ml-1">Nama Lengkap</Label>
              <Input 
                readOnly 
                value={user.name}
                className="h-12 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-lg px-5 focus-visible:ring-0 cursor-default"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-bold text-[#4B2E05] ml-1">Email</Label>
              <Input 
                readOnly 
                value={user.email}
                className="h-12 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-lg px-5 focus-visible:ring-0 cursor-default"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-bold text-[#4B2E05] ml-1">No Telepon</Label>
              <Input 
                readOnly 
                value={user.phone}
                className="h-12 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-lg px-5 focus-visible:ring-0 cursor-default"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-bold text-[#4B2E05] ml-1">Alamat</Label>
              <Input 
                readOnly 
                value={user.address}
                className="h-12 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-lg px-5 focus-visible:ring-0 cursor-default"
              />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}