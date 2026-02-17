"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { showToast } from "@/components/Toast";
import { motion } from "motion/react";

export default function VerifikasiPage() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300); // Set default timer saat masuk

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const getSavedEmail = () => {
    const data = sessionStorage.getItem("registrasi_data");
    return data ? JSON.parse(data).email : null;
  };

  const handleVerifyOTP = async () => {
    const email = getSavedEmail();
    if (!email) {
      showToast.error("Email tidak ditemukan, silakan register ulang.");
      return router.push("/register");
    }

    setIsLoading(true);
    const toastId = showToast.loading("Sedang memverifikasi kode...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const result = await response.json();
      if (response.ok) {
        showToast.success("Verifikasi Berhasil!", toastId);
        sessionStorage.removeItem("registrasi_data");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        showToast.error(result.message || "Kode OTP salah.", toastId);
      }
    } catch (error) {
      showToast.error("Terjadi kesalahan verifikasi.", toastId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0 || isLoading) return;
    const email = getSavedEmail();
    if (!email) return;

    setIsLoading(true);
    const toastId = showToast.loading("Mengirim ulang kode OTP...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-token-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        showToast.success(result.message || "Kode baru telah dikirim.", toastId);
        setTimer(300);
      } else {
        showToast.error(result.message || "Gagal mengirim ulang OTP.", toastId);
      }
    } catch (error) {
      showToast.error("Gagal mengirim ulang kode.", toastId);
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
        {/* Sisi Logo Tetap Sama */}
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
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[340px] flex flex-col items-center"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-[#4B2E05]/10 p-4 rounded-[15px] mb-6 text-[#4B2E05]"
            >
              <Mail size={40} />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-bold mb-2 text-center"
            >
              Verifikasi Kode
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-center mb-8 opacity-80"
            >
              Masukkan 6 digit kode yang kami kirimkan ke email Anda
            </motion.p>
            <div className="space-y-8 flex flex-col items-center w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="w-10 h-12 md:w-12 md:h-14 rounded-xl border-none bg-[#FFF8E1] shadow-md text-xl font-bold text-[#4B2E05]" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button disabled={otpValue.length < 6 || isLoading} onClick={handleVerifyOTP} className="w-40 h-10 bg-[#3D2504] text-[#FFF8E1] rounded-[15px] text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50">
                  {isLoading ? "Memproses..." : "Verifikasi"}
                </Button>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-xs font-medium opacity-70"
              >
                Tidak menerima kode?{" "}
                <button 
                  type="button" 
                  disabled={timer > 0 || isLoading} 
                  onClick={handleResendOTP} 
                  className={`font-bold underline transition-colors ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:text-[#3D2504]'}`}
                >
                  {timer > 0 ? `Kirim Ulang (${timer}s)` : "Kirim Ulang"}
                </button>
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}