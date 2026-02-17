"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiPencilLine, RiLockPasswordLine, RiLogoutBoxRLine, RiTimeLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import EditProfile from "@/components/Profil/EditProfile";
import ChangePassword from "@/components/Profil/ChangePassword";
import { showToast } from "@/components/Toast";
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
import { motion } from "motion/react";

// Variabel Animasi Reusable
const anim = {
  base: (delay = 0, y = 20) => ({
    initial: { y, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, delay }
  }),
  side: (delay = 0, x = 50) => ({
    initial: { x, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5, delay }
  }),
  scale: (delay = 0) => ({
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, delay }
  }),
  fade: (delay = 0, opacity = 0.6) => ({
    initial: { opacity: 0 },
    animate: { opacity: opacity },
    transition: { delay }
  })
};

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
      } catch (error) {
        router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    const toastId = showToast.loading("Sedang memproses keluar...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        showToast.success(result.message, toastId);
        setTimeout(() => { window.location.href = "/"; }, 1000);
      } else {
        showToast.error(result.message, toastId);
      }
    } catch (error) {
      showToast.error("Terjadi kesalahan koneksi.", toastId);
    }
  };

  if (!user) return null;

  const avatarSrc = user.avatarUrl 
    ? `${user.avatarUrl}${user.avatarUrl.includes('?') ? '&' : '?'}t=${new Date().getTime()}` 
    : null;

  return (
    <main className="h-[calc(100vh-80px)] w-full bg-[#FFF8E1] flex items-center justify-center p-4 md:p-0 overflow-hidden font-inder">
      <motion.div {...anim.base(0, 40)} className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        <motion.div {...anim.side(0.2, -50)} className="w-full md:w-1/3 flex flex-col items-center md:items-start text-[#4B2E05]">          
          <div className="flex flex-col items-center w-full">
            <motion.div {...anim.scale(0.4)}>
              <Avatar className="w-36 h-36 md:w-40 md:h-40 border-4 border-[#F4B740] mb-8 md:mb-12 shadow-lg bg-[#FFF8E1] flex items-center justify-center">
                {avatarSrc ? (
                  <>
                    <AvatarImage src={avatarSrc} alt={user.name} className="object-cover" />
                    <AvatarFallback className="bg-gray-300 text-3xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </>
                ) : (
                  <CgProfile className="w-full h-full text-[#F4B740]" />
                )}
              </Avatar>
            </motion.div>

            <div className="w-full space-y-1">
              <motion.div {...anim.base(0.5, 10)}>
                <EditProfile initialData={user}>
                  <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all px-2">
                    <RiPencilLine size={22} /><span className="text-lg font-medium">Edit Profil</span>
                  </div>
                </EditProfile>
              </motion.div>
              
              <motion.div {...anim.base(0.6, 10)}>
                <ChangePassword email={user.email}>
                  <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all px-2">
                    <RiLockPasswordLine size={22} /><span className="text-lg font-medium">Ganti Kata Sandi</span>
                  </div>
                </ChangePassword>
              </motion.div>
              
              <motion.div {...anim.base(0.7, 10)}>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="flex items-center gap-4 py-3 border-b-2 border-[#4B2E05] cursor-pointer hover:opacity-70 transition-all text-red-700 md:text-[#4B2E05] px-2">
                      <RiLogoutBoxRLine size={22} /><span className="text-lg font-medium">Keluar</span>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90%] sm:w-full max-w-[450px] bg-[#F4B740] border-none rounded-[15px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#4B2E05] font-bold text-2xl text-left">Apakah Anda yakin ingin keluar?</AlertDialogTitle>
                      <AlertDialogDescription className="text-[#4B2E05]/80 text-left">Tindakan ini akan mengakhiri sesi Anda dan Anda harus login ulang.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-[15px] border-[#4B2E05] text-[#4B2E05]">Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout} className="bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-[15px]">Keluar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>

              {user.lastLogin && (
                <motion.div {...anim.fade(0.8)} className="flex items-center gap-2 pt-4 opacity-60 px-2">
                  <RiTimeLine size={16} /><span className="text-[10px] md:text-xs">Terakhir masuk: <br/> {user.lastLogin}</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ duration: 1, delay: 0.3 }}
          className="hidden md:block w-[4px] h-[450px] bg-[#4B2E05] rounded-[15px] self-center opacity-80" 
        />

        <motion.div {...anim.side(0.2, 50)} className="w-full md:w-2/3 bg-[#F4B740] rounded-[15px] p-6 md:p-8 shadow-2xl">
          <motion.h2 {...anim.base(0.4, 10)} className="text-3xl font-bold text-[#4B2E05] mb-4">Profil</motion.h2>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Nama Lengkap", value: user.name, delay: 0.5 },
              { label: "Email", value: user.email, delay: 0.6 },
              { label: "No Telepon", value: user.phone || "-", delay: 0.7 },
              { label: "Alamat", value: user.address || "-", delay: 0.8 }
            ].map((item, idx) => (
              <motion.div key={idx} {...anim.base(item.delay, 10)} className="space-y-1 text-left">
                <Label className="text-base font-bold text-[#4B2E05] ml-1">{item.label}</Label>
                <Input readOnly value={item.value} className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-md text-[#4B2E05] text-base px-5 focus-visible:ring-0 cursor-default" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}