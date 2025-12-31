"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Beef, Hexagon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function Hero() {
  const banners = ["/Image/banner1.png", "/Image/banner2.png"];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full relative overflow-hidden rounded-[15px] shadow-sm border border-[#4B2E05]/5">
        <Carousel
          plugins={[Autoplay({ delay: 5000 })]}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-[200px] md:h-[350px]">
                  <Image
                    src={src}
                    alt="Hero Banner"
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex justify-center gap-12 md:gap-32 mt-16 w-full px-4">
        <div className="flex flex-col items-center justify-center w-full max-w-[200px] md:max-w-[280px] h-[150px] md:h-[210px] bg-[#F4B740] rounded-[15px] shadow-lg transition-all hover:scale-105 cursor-pointer p-4 group">
          <div className="mb-2">
            <Beef 
              className="w-14 h-14 md:w-20 md:h-20 text-[#4B2E05] transition-transform group-hover:rotate-12" 
            />
          </div>
          <span className="text-base md:text-xl font-bold text-[#4B2E05] text-center leading-tight">
            Informasi Lebah
          </span>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-[200px] md:max-w-[280px] h-[150px] md:h-[210px] bg-[#F4B740] rounded-[15px] shadow-lg transition-all hover:scale-105 cursor-pointer p-4 group">
          <div className="mb-2">
            <Hexagon 
              className="w-14 h-14 md:w-20 md:h-20 text-[#4B2E05] transition-transform group-hover:scale-110" 
            />
          </div>
          <span className="text-base md:text-xl font-bold text-[#4B2E05] text-center leading-tight">
            Klasifikasi Jenis
          </span>
        </div>
      </div>
    </section>
  );
}