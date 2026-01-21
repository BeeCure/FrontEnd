"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function Hero() {
  const banners = ["/Image/banner1.png", "/Image/banner2.png"];

  const menuItems = [
    {
      icon: (
        <Image 
          src="/Image/ikon-informasi.png" 
          alt="Ikon Informasi" 
          width={512} 
          height={512} 
          className="w-12 h-12 md:w-20 md:h-20 transition-transform group-hover:rotate-12 object-contain" 
        />
      ),
      label: "Informasi Lebah",
    },
    {
      icon: (
        <Image 
          src="/Image/ikon-klasifikasi.png" 
          alt="Ikon Klasifikasi" 
          width={512} 
          height={512} 
          className="w-12 h-12 md:w-20 md:h-20 transition-transform group-hover:scale-110 object-contain" 
        />
      ),
      label: "Klasifikasi Jenis",
    },
    {
      icon: (
        <Image 
          src="/Image/ikon-monitoring2.png" 
          alt="Ikon Monitoring" 
          width={512} 
          height={512} 
          className="w-12 h-12 md:w-20 md:h-20 transition-transform group-hover:-translate-y-2 object-contain" 
        />
      ),
      label: "Monitoring Pengguna",
    },
  ];

  return (
    <section id="hero" className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full relative overflow-hidden rounded-[15px] shadow-sm border border-[#4B2E05]/5">
        <Carousel plugins={[Autoplay({ delay: 5000 })]} className="w-full">
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

      <div className="flex flex-wrap justify-center gap-4 md:gap-16 mt-16 w-full px-4">
        {menuItems.map((item, idx) => (
          <MenuCard key={idx} icon={item.icon} label={item.label} />
        ))}
      </div>
    </section>
  );
}

function MenuCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-[calc(50%-8px)] md:w-full md:max-w-[280px] h-[140px] md:h-[210px] bg-[#F4B740] rounded-[15px] shadow-lg transition-all hover:scale-105 cursor-pointer p-4 group text-[#4B2E05]">
      <div className="mb-2">
        {icon}
      </div>
      <span className="text-sm md:text-xl font-bold text-center leading-tight">
        {label}
      </span>
    </div>
  );
}