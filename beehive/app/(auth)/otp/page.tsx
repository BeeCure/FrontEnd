"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Image from "next/image";
import { showToast } from "@/components/Toast";
import { motion } from "motion/react";

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
  })
};

export default function VerifikasiPage() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerifyOTP = async () => {
    const data = sessionStorage.getItem("registrasi_data");
    const email = data ? JSON.parse(data).email : null;
    if (!email) return router.push("/register");

    setIsLoading(true);
    const toastId = showToast.loading("Memverifikasi...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      if (res.ok) {
        showToast.success("Verifikasi Berhasil!", toastId);
        sessionStorage.removeItem("registrasi_data");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        const result = await res.json();
        showToast.error(result.message || "Kode salah.", toastId);
      }
    } catch { showToast.error("Terjadi kesalahan.", toastId); } 
    finally { setIsLoading(false); }
  };

  return (
    <main className="flex items-center justify-center w-full h-full font-inder">
      <motion.div {...anim.base(0, 40)} className="flex flex-col md:flex-row-reverse w-[90%] md:w-[85%] h-auto md:h-[80vh] max-w-[1100px] bg-[#F4B740] rounded-[15px] shadow-2xl overflow-hidden border border-black/5">
        
        <motion.div {...anim.side(0.2, 50)} className="hidden md:flex md:flex-1 flex-col items-center justify-center p-12">
          <Image src="/Image/logo-secondary-choco.png" alt="Logo" width={400} height={400} className="w-full max-w-[320px] object-contain" priority />
        </motion.div>

        <div className="hidden md:block w-[1px] bg-[#FFF8E1]/60 my-20" />

        <motion.div {...anim.side(0.2, -50)} className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-[#4B2E05]">
          <div className="w-full max-w-[340px] flex flex-col items-center">
            <motion.div {...anim.base()} className="bg-[#4B2E05]/10 p-4 rounded-[15px] mb-6"><Mail size={40} /></motion.div>
            <motion.h2 {...anim.base(0.1)} className="text-2xl font-bold mb-2">Verifikasi Kode</motion.h2>
            <motion.p {...anim.base(0.2)} className="text-sm text-center mb-8 opacity-80">Masukkan 6 digit kode dari email Anda</motion.p>
            
            <div className="space-y-8 flex flex-col items-center w-full">
              <motion.div {...anim.base(0.3)}>
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup className="gap-2">
                    {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} className="w-10 h-12 md:w-12 md:h-14 rounded-xl border-none bg-[#FFF8E1] shadow-md text-xl font-bold" />)}
                  </InputOTPGroup>
                </InputOTP>
              </motion.div>

              <motion.div {...anim.base(0.4)}>
                <Button disabled={otpValue.length < 6 || isLoading} onClick={handleVerifyOTP} className="w-40 h-10 bg-[#3D2504] text-[#FFF8E1] rounded-[15px] font-bold shadow-lg active:scale-95">Verifikasi</Button>
              </motion.div>

              <motion.p {...anim.base(0.5)} className="text-xs font-medium opacity-70">
                Tidak menerima kode? <button type="button" disabled={timer > 0} className="font-bold underline">{timer > 0 ? `Kirim Ulang (${timer}s)` : "Kirim Ulang"}</button>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}