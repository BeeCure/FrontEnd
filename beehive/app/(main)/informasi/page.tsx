"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import AddDataBee from "@/components/Information/add"; 
import EditDeleteBeeDialog from "@/components/Information/Edit-Delete";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "motion/react";

interface BeeImages {
  bodyShape?: string;
  wingShape?: string;
  entranceShape?: string;
  honeyPouchShape?: string;
}

export interface Bee {
  id: string;
  name: string;
  scientificName: string;
  genus: string;
  subGenus: string;
  discoverer: string;
  discoveredYear: number;
  distribution: string;
  images?: BeeImages;
}

type FilterType = "Semua" | "Trigona" | "Apis";

export default function InformasiPage() {
  const [bees, setBees] = useState<Bee[]>([]);
  const [filter, setFilter] = useState<FilterType>("Semua");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBee, setSelectedBee] = useState<Bee | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const itemsPerPage = 8;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        setUserRole(result.data.role);
      } else {
        setUserRole(null);
      }
    } catch (error) {
      setUserRole(null);
      console.error("Gagal mengambil profil:", error);
    }
  };

  const fetchBees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bee/species?search=${search}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) setBees(result.data);
    } catch (error) {
      console.error("Gagal memuat data lebah:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(fetchBees, 500);
    return () => clearTimeout(debounceTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filteredData = bees.filter((bee) => {
    const matchesFilter = filter === "Semua" || bee.genus?.toLowerCase() === filter.toLowerCase();
    const s = search.toLowerCase();
    const matchesSearch = 
      bee.name.toLowerCase().includes(s) || 
      bee.scientificName.toLowerCase().includes(s) || 
      bee.genus.toLowerCase().includes(s);

    return matchesFilter && matchesSearch;
  });

  const finalFilteredData = userRole ? filteredData : filteredData.slice(0, 4);

  const totalPages = Math.ceil(finalFilteredData.length / itemsPerPage);
  const currentItems = finalFilteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filterButtons: FilterType[] = ["Semua", "Trigona", "Apis"];
  const canAdd = userRole === "PRACTITIONER" || userRole === "SUPER_ADMIN";

  return (
    <main className="h-100vh w-full bg-[#FFF8E1] px-4 md:mt-1 mt-0 md:px-16 flex flex-col justify-between py-6 overflow-hidden font-inder text-[#4B2E05]">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto w-full px-2 md:px-10 flex flex-col md:flex-row justify-between items-center mt-4 mb-0 gap-4"
      >
        <div className="flex w-full md:w-auto justify-between gap-2">
          {filterButtons.map((btn) => (
            <Button 
              key={btn}
              onClick={() => {setFilter(btn); setCurrentPage(1);}}
              className={cn(
                "flex-1 md:w-32 rounded-[15px] text-[11px] md:text-lg font-bold shadow-sm transition-all h-10 border-none",
                filter === btn 
                  ? "bg-[#4B2E05] text-[#F4B740] hover:bg-[#4B2E05]" 
                  : "bg-[#F4B740]/40 text-[#4B2E05]/60 hover:bg-[#4B2E05] hover:text-[#F4B740]"
              )}
            >
              {btn}
            </Button>
          ))}
        </div>
        
        <div className="flex w-full md:flex-1 items-center gap-3 md:ml-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-[#4B2E05]" size={18} />
            <Input 
              placeholder="Cari lebah berdasarkan nama, spesies, atau genus..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-[15px] border-none bg-[#F4B740]/20 pl-10 focus-visible:ring-1 focus-visible:ring-[#4B2E05] shadow-inner text-[#4B2E05]"
            />
          </div>
          {canAdd && <AddDataBee onSuccess={fetchBees} />}
        </div>
      </motion.div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-10 overflow-y-auto scrollbar-hide py-4">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin opacity-20" size={48} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 justify-items-start">
              <svg width="0" height="0" className="absolute">
                  <defs>
                      <clipPath id="smoothHexagon" clipPathUnits="objectBoundingBox">
                          <path d="M0.5,0.015 C0.543,0.015 0.88,0.208 0.92,0.23 C0.963,0.255 0.985,0.285 0.985,0.335 L0.985,0.665 C0.985,0.715 0.963,0.745 0.92,0.77 C0.88,0.792 0.543,0.985 0.5,0.985 C0.457,0.985 0.12,0.792 0.08,0.77 C0.037,0.745 0.015,0.715 0.015,0.665 L0.015,0.335 C0.015,0.285 0.037,0.255 0.08,0.23 C0.12,0.208 0.457,0.015 0.5,0.015 Z" />
                      </clipPath>
                  </defs>
              </svg>
              {currentItems.length > 0 ? currentItems.map((bee, idx) => (
                <motion.div 
                  key={bee.id} 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => { setSelectedBee(bee); setIsDetailOpen(true); }}
                  className="group relative flex flex-col items-center w-full max-w-[200px] md:max-w-[240px] cursor-pointer"
                >
                  <div
                    className="relative w-full aspect-[4/4.2] transition-all duration-500 group-hover:scale-[1.02]"
                    style={{ clipPath: "url(#smoothHexagon)", WebkitClipPath: "url(#smoothHexagon)" }}
                  >
                    <Image src={bee.images?.bodyShape || "/Image/Lebah1.png"} alt={bee.name} fill unoptimized priority={idx < 4} className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  <div className="w-[85%] bg-[#F4B740] rounded-[22px] py-3 px-2 text-center -mt-14 md:-mt-17 relative z-10 shadow-lg border border-white/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-[#4B2E05]">
                    <h3 className="text-[#FFF8E1] text-sm md:text-xl font-bold leading-tight drop-shadow-sm group-hover:text-[#F4B740] truncate px-1">{bee.name}</h3>
                    <p className="text-[#FFF8E1] text-[10px] md:text-base italic opacity-90 leading-tight group-hover:text-[#FFF8E1] truncate px-1">{bee.scientificName}</p>
                  </div>
                </motion.div>
              )) : <p className="opacity-30 py-10 w-full text-center md:text-left">Data lebah tidak ditemukan.</p>}
            </div>

            {/* Pesan untuk pengguna yang belum login */}
            {!userRole && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full text-center mt-12 mb-6 mt-6 text-[#4B2E05]/60 italic text-sm md:text-base"
              >
                silahkan login atau registrasi untuk dapat melihat informasi jenis lebah secara lengkap.
              </motion.p>
            )}
          </>
        )}
      </div>

      <EditDeleteBeeDialog 
        bee={selectedBee} 
        isOpen={isDetailOpen} 
        onOpenChange={setIsDetailOpen} 
        onSuccess={fetchBees} 
        userRole={userRole}
      />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-0"
      >
        {/* Pagination hanya muncul jika login dan halaman > 1 */}
        {userRole && totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if(currentPage > 1) setCurrentPage(currentPage - 1) }} className={cn("text-[#4B2E05] font-bold", currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-[#F4B740]/20")} /></PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i} className="hidden sm:block">
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }} className={cn("rounded-[10px] font-bold transition-all border-none", currentPage === i + 1 ? "bg-[#4B2E05] text-[#F4B740] hover:bg-[#4B2E05]" : "text-[#4B2E05] hover:bg-[#F4B740]/20")}>{i + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) setCurrentPage(currentPage + 1) }} className={cn("text-[#4B2E05] font-bold", currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-[#F4B740]/20")} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </motion.div>
    </main>
  );
}