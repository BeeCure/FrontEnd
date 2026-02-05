"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { RiHistoryLine, RiLoader4Line } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HistoryItem {
  id: string;
  imageUrl: string;
  species: string;
  createdAt: { _seconds: number };
}

interface HistoryDetail extends HistoryItem {
  confidence: number;
  similarity: number;
  decision: string;
}

interface HistoryProps {
  historyData: HistoryItem[];
  isLoading: boolean;
}

const formatDateTime = (seconds: number) => {
  return new Date(seconds * 1000).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HexagonClipPath = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <clipPath id="smoothHexagon" clipPathUnits="objectBoundingBox">
        <path d="M0.5,0.015 C0.543,0.015 0.88,0.208 0.92,0.23 C0.963,0.255 0.985,0.285 0.985,0.335 L0.985,0.665 C0.985,0.715 0.963,0.745 0.92,0.77 C0.88,0.792 0.543,0.985 0.5,0.985 C0.457,0.985 0.12,0.792 0.08,0.77 C0.037,0.745 0.015,0.715 0.015,0.665 L0.015,0.335 C0.015,0.285 0.037,0.255 0.08,0.23 C0.12,0.208 0.457,0.015 0.5,0.015 Z" />
      </clipPath>
    </defs>
  </svg>
);

const DialogRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="grid grid-cols-[90px_15px_1fr] md:grid-cols-[110px_20px_1fr] items-start w-full text-left">
    <span className="opacity-60 uppercase text-[10px] md:text-[12px] font-bold tracking-wider pt-0.5">{label}</span>
    <span className="text-center font-bold">:</span>
    <span className="font-bold break-words">{value}</span>
  </div>
);

export default function HistorySection({ historyData, isLoading }: HistoryProps) {
  const [selectedHistoryBee, setSelectedHistoryBee] = useState<HistoryDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 4 : 8);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleHistoryClick = async (id: string) => {
    setIsDetailOpen(true);
    setIsFetchingDetail(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classify/history/${id}`, { credentials: "include" });
      const resJson = await response.json();
      if (resJson.success) setSelectedHistoryBee(resJson.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error("Gagal memuat detail riwayat");
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const totalPages = Math.ceil(historyData.length / itemsPerPage);
  const currentItems = useMemo(() => {
    return historyData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [historyData, currentPage, itemsPerPage]);

  return (
    <section className="pb-10">
      <div className="flex items-center gap-3 border-b-2 border-[#4B2E05]/10 pb-4 mb-4">
        <RiHistoryLine size={32} className="text-[#F4B740]" />
        <h2 className="text-3xl font-bold uppercase tracking-widest">Riwayat</h2>
      </div>

      <HexagonClipPath />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <RiLoader4Line className="animate-spin opacity-20" size={40} />
        </div>
      ) : currentItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-y-16 justify-items-start">
          {currentItems.map((item) => (
            <div key={item.id} onClick={() => handleHistoryClick(item.id)} className="group relative flex flex-col items-center w-full max-w-[200px] md:max-w-[240px] cursor-pointer">
              <div className="relative w-full aspect-[4/4.2] transition-all duration-500 group-hover:scale-[1.02]" style={{ clipPath: "url(#smoothHexagon)", WebkitClipPath: "url(#smoothHexagon)" }}>
                <Image src={item.imageUrl} alt={item.species} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="w-[85%] bg-[#F4B740] rounded-[22px] py-3 px-2 text-center -mt-14 md:-mt-17 relative z-10 shadow-lg border border-white/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-[#4B2E05]">
                <h3 className="text-[#FFF8E1] text-sm md:text-xl font-bold truncate px-1 group-hover:text-[#F4B740]">{item.species}</h3>
                <p className="text-[#FFF8E1] text-[9px] md:text-xs opacity-90 truncate px-1">{formatDateTime(item.createdAt._seconds)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center opacity-40 italic py-10">Belum ada riwayat klasifikasi.</p>
      )}

      {/* DIALOG RIWAYAT */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-5xl bg-[#F4B740] border-none rounded-[15px] p-6 md:p-10 shadow-2xl outline-none overflow-hidden font-inder">
          <DialogTitle className="sr-only">Detail Klasifikasi {selectedHistoryBee?.species}</DialogTitle>
          <DialogDescription className="sr-only">Informasi hasil identifikasi lebah.</DialogDescription>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center md:items-stretch w-full">
            <div className="w-full md:w-[45%] flex justify-center">
              <div className="relative w-full aspect-square bg-[#FFF8E1] rounded-[15px] overflow-hidden shadow-md border-2 border-[#FFF8E1]">
                {isFetchingDetail ? (
                  <div className="w-full h-full flex items-center justify-center"><RiLoader4Line className="animate-spin text-[#4B2E05]" size={42} /></div>
                ) : (
                  <Image src={selectedHistoryBee?.imageUrl || ""} alt="Detail" fill unoptimized className="object-cover" />
                )}
              </div>
            </div>

            <div className="flex-1 w-full bg-[#FFF8E1] rounded-[15px] p-6 md:p-8 shadow-xl text-[#4B2E05] flex flex-col justify-between border border-black/5">
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase mb-1">Detail Klasifikasi</h2>
                <p className="text-sm opacity-70 mb-6">Informasi hasil identifikasi lebah</p>
                {isFetchingDetail ? (
                  <div className="space-y-3 animate-pulse">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 w-full bg-[#4B2E05]/10 rounded" />)}</div>
                ) : selectedHistoryBee && (
                  <div className="space-y-3.5 text-[15px] lg:text-base">
                    <DialogRow label="Spesies" value={selectedHistoryBee.species} />
                    <DialogRow label="Akurasi" value={selectedHistoryBee.confidence} />
                    <DialogRow label="Kemiripan" value={selectedHistoryBee.similarity} />
                    <DialogRow label="Decision" value={selectedHistoryBee.decision.toUpperCase()} />
                    <DialogRow label="Waktu" value={formatDateTime(selectedHistoryBee.createdAt._seconds)} />
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={() => setIsDetailOpen(false)} className="bg-[#4B2E05] hover:bg-[#2f1d03] text-[#FFF8E1] rounded-[15px] px-8 h-9 font-bold shadow-md active:scale-95">Tutup</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(v => v - 1); }} className={cn("text-[#4B2E05] font-bold", currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-[#F4B740]/20")} />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i} className="hidden sm:block">
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }} className={cn("rounded-[10px] font-bold border-none", currentPage === i + 1 ? "bg-[#4B2E05] text-[#F4B740]" : "text-[#4B2E05] hover:bg-[#F4B740]/20")}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(v => v + 1); }} className={cn("text-[#4B2E05] font-bold", currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-[#F4B740]/20")} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
}