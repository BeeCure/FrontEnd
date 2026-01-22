"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, KeyRound, LogOut, Clock } from "lucide-react";
import EditProfile from "@/components/EditProfile";
import ChangePassword from "@/components/ChangePassword";
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
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    address?: string;
    avatarUrl: string | null;
    lastLogin: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile?t=${Date.now()}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setUser(result.data);
        } else {
          router.push("/login");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      window.location.href = "/";
    }
  };

  if (!user) return null;

  const avatarSrc = user.avatarUrl 
    ? `${user.avatarUrl}${user.avatarUrl.includes('?') ? '&' : '?'}t=${new Date().getTime()}` 
    : "https://github.com/shadcn.png";

  return (
    <main className="h-[calc(100vh-80px)] w-full bg-[#FFF8E1] flex items-center justify-center p-4 md:p-0 overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-[#4B2E05]">          
          <div className="flex flex-col items-center w-full">
            <Avatar className="w-36 h-36 md:w-40 md:h-40 border-4 border-[#F4B740] mb-8 md:mb-12 shadow-lg">
              <AvatarImage src={avatarSrc} alt={user.name} className="object-cover" />
              <AvatarFallback className="bg-gray-300 text-3xl">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="w-full space-y-1">
              <EditProfile initialData={user}>
                <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all px-2">
                  <Pencil size={22} />
                  <span className="text-lg font-medium">Edit Profil</span>
                </div>
              </EditProfile>
              
              <ChangePassword email={user.email}>
                <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all px-2">
                  <KeyRound size={22} />
                  <span className="text-lg font-medium">Ganti Kata Sandi</span>
                </div>
              </ChangePassword>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all text-red-700 md:text-[#4B2E05] px-2">
                    <LogOut size={22} />
                    <span className="text-lg font-medium">Keluar</span>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%] sm:w-full max-w-[450px] bg-[#FFF8E1] border-none rounded-[15px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#4B2E05] font-bold text-2xl text-left">Apakah Anda yakin ingin keluar?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#4B2E05]/80 text-left">
                      Tindakan ini akan mengakhiri sesi Anda dan Anda harus login ulang untuk mengakses sistem.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full border-[#4B2E05] text-[#4B2E05]">Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleLogout}
                      className="bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-full"
                    >
                      Keluar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {user.lastLogin && (
                <div className="flex items-center gap-2 pt-4 opacity-60 px-2">
                  <Clock size={14} />
                  <span className="text-[10px] md:text-xs">Terakhir masuk: <br/> {user.lastLogin}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden md:block w-[4px] h-[450px] bg-[#4B2E05] rounded-full self-center opacity-80" />

        <div className="w-full md:w-2/3 bg-[#F4B740] rounded-[15px] p-6 md:p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-[#4B2E05] mb-4">Profil</h2>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1 text-left">
              <Label className="text-base font-bold text-[#4B2E05] ml-1">Nama Lengkap</Label>
              <Input 
                readOnly 
                value={user.name}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-base px-5 focus-visible:ring-0 cursor-default"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-base font-bold text-[#4B2E05] ml-1">Email</Label>
              <Input 
                readOnly 
                value={user.email}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-base px-5 focus-visible:ring-0 cursor-default"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-base font-bold text-[#4B2E05] ml-1">No Telepon</Label>
              <Input 
                readOnly 
                value={user.phone || "-"}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-base px-5 focus-visible:ring-0 cursor-default"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-base font-bold text-[#4B2E05] ml-1">Alamat</Label>
              <Input 
                readOnly 
                value={user.address || "-"}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-base px-5 focus-visible:ring-0 cursor-default"
              />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}