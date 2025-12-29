"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export default function ResetPassword({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90%] sm:w-full max-w-[400px] bg-[#FFF8E1] border-none rounded-[15px] p-8 shadow-2xl text-center">
        <div className="flex flex-col items-center gap-5 py-4">

          <div className="w-20 h-20 bg-[#F4B740] rounded-full flex items-center justify-center shadow-md mb-2">
            <MailCheck size={45} className="text-[#4B2E05]" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#4B2E05]">Email Terkirim!</h2>
            <p className="text-[#4B2E05] font-medium leading-relaxed opacity-90">
              Link untuk mereset kata sandi telah dikirim ke email Anda. 
              Silakan cek kotak masuk atau folder spam Anda.
            </p>
          </div>

          <div className="pt-6 w-full flex justify-center">
            <DialogClose asChild>
              <Button 
                type="button"
                className="w-36 h-10 bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-full text-lg font-bold shadow-md transition-transform active:scale-95"
              >
                Selesai
              </Button>
            </DialogClose>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}