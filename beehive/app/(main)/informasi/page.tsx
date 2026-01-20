"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function InformasiPage() {
  const allBeeData = Array(21).fill({
    name: "Lebah Klanceng",
    latinName: "Trigona sp.",
    image: "/Image/Lebah1.png",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allBeeData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allBeeData.slice(startIndex, endIndex);

  return (
    <main className=" w-full bg-[#FFF8E1] px-4 py-12 md:px-10 flex flex-col items-center">
      <div className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-2 gap-y-6 justify-items-center mb-8">
        {currentItems.map((bee, index) => (
          <div 
            key={index} 
            className="group relative w-full max-w-[180px] md:max-w-[210px] flex flex-col items-center cursor-pointer"
          >
            <div className="relative w-full aspect-[4/4.5] overflow-hidden rounded-t-[80px] rounded-b-2xl shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
              <Image
                src={bee.image}
                alt={bee.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E05]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="w-[90%] -mt-8 relative z-10 bg-[#F4B740] p-3 rounded-xl shadow-md border border-white/10 flex flex-col items-center text-center transition-all duration-500 group-hover:bg-[#4B2E05]">
              <h3 className="text-[#4B2E05] group-hover:text-[#FFF8E1] font-bold text-sm md:text-base leading-tight transition-colors duration-500">
                {bee.name}
              </h3>
              <p className="text-[#4B2E05]/70 group-hover:text-[#F4B740] italic text-[10px] md:text-xs mt-0.5 transition-colors duration-500">
                {bee.latinName}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Pagination>
        <PaginationContent className="bg-[#F4B740] rounded-full px-4 py-1 shadow-md text-[#4B2E05]">
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-[#4B2E05] hover:text-[#FFF8E1] rounded-full"}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i} className="hidden sm:inline-block">
              <PaginationLink 
                href="#"
                isActive={currentPage === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
                className={currentPage === i + 1 
                  ? "bg-[#4B2E05] text-[#FFF8E1] rounded-full" 
                  : "hover:bg-[#4B2E05]/20 rounded-full"
                }
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-[#4B2E05] hover:text-[#FFF8E1] rounded-full"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}