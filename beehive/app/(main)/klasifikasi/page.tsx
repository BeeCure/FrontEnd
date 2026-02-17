"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RiUploadCloud2Line, RiLoader4Line, RiDeleteBin6Line, RiCheckboxCircleLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/Toast";
import HistorySection from "@/components/Classification/history";
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

interface ClassificationResult {
  species: string;
  confidence: number;
  similarity: number;
  decision: string;
  imageUrl: string;
}

export default function KlasifikasiPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [historyData, setHistoryData] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, { 
        credentials: "include" 
      });
      const result = await res.json();
      if (!result.success) {
        router.push("/login");
        return;
      }
      setIsVerifying(false);
      fetchHistory();
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classify/history`, { credentials: "include" });
      const resJson = await response.json();
      if (resJson.success) setHistoryData(resJson.data);
    } catch (error) {
      console.error("Gagal mengambil riwayat:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return showToast.error("File harus berupa gambar");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleStartClassification = async () => {
    if (!selectedFile) return showToast.error("Pilih gambar terlebih dahulu");
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classify/predict`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (response.status === 401) {
        router.push("/login");
        return showToast.error("Sesi telah berakhir, silakan login kembali.");
      }
      const resJson = await response.json();
      if (resJson.success) {
        setResult(resJson.data);
        showToast.success("Klasifikasi berhasil!");
        fetchHistory();
      } else {
        showToast.error(resJson.message || "Gagal memproses gambar");
      }
    } catch (error) {
      showToast.error("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isVerifying) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FFF8E1]">
        <RiLoader4Line className="animate-spin text-[#4B2E05]" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#FFF8E1] px-4 md:px-16 py-10 font-inder text-[#4B2E05]">
      <motion.div {...anim.base(0, 40)} className="max-w-7xl mx-auto">
        <section className="flex flex-col items-center text-center space-y-8">
          <div className="w-full max-w-2xl">
            <motion.div
              {...anim.base(0.2, 20)}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative w-full aspect-video md:h-[350px] bg-[#F4B740]/10 rounded-[15px] border-4 border-dashed border-[#F4B740] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#F4B740]/20 group overflow-hidden",
                previewUrl && "border-solid border-[#4B2E05]/20 bg-white"
              )}
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill unoptimized className="object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-5 bg-[#F4B740] rounded-[15px] text-[#FFF8E1] shadow-lg group-hover:scale-110 transition-transform">
                    <RiUploadCloud2Line size={48} />
                  </div>
                  <p className="text-xl font-bold px-4">Pilih Gambar lebah Anda untuk mengidentifikasi jenisnya.</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </motion.div>

            {result && (
              <motion.div {...anim.base(0, 20)} className="mt-8 p-6 bg-[#F4B740] rounded-[15px] text-left shadow-xl">
                <div className="flex items-center gap-2 mb-4 border-b border-[#4B2E05]/20 pb-2">
                  <RiCheckboxCircleLine size={24} className="text-[#34581B]" />
                  <h2 className="text-xl font-bold uppercase">Hasil Analisis</h2>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <ResultItem label="Spesies" value={result.species} />
                  <ResultItem label="Decision" value={result.decision} />
                  <ResultItem label="Akurasi" value={`${(result.confidence * 100).toFixed(2)}%`} />
                  <ResultItem label="Kemiripan" value={`${(result.similarity * 100).toFixed(2)}%`} />
                </div>
              </motion.div>
            )}

            <motion.div {...anim.base(0.3, 20)} className="mt-6 mb-10 flex justify-center gap-4">
              {previewUrl && (
                <Button onClick={handleReset} className="rounded-[15px] border-2 border-[#8E4117] bg-transparent text-[#8E4117] font-bold px-8 h-12 text-lg hover:bg-[#8E4117] hover:text-[#FFF8E1] transition-all">
                  <RiDeleteBin6Line className="mr-2" size={20} /> Hapus
                </Button>
              )}
              <Button
                disabled={!selectedFile || isProcessing}
                onClick={handleStartClassification}
                className="rounded-[15px] bg-[#34581B] hover:bg-[#2c4b17] text-white font-bold px-10 h-12 w-50 text-lg shadow-lg disabled:opacity-50 transition-all active:scale-95"
              >
                {isProcessing ? <><RiLoader4Line className="animate-spin mr-2" size={24} /> Memproses...</> : "Mulai Klasifikasi"}
              </Button>
            </motion.div>
          </div>
        </section>

        <motion.div {...anim.base(0.4, 30)}>
          <HistorySection historyData={historyData} isLoading={isHistoryLoading} />
        </motion.div>
      </motion.div>
    </main>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase opacity-60 font-bold">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}