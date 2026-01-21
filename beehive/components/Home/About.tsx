"use client";

import React from "react";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12 md:gap-20">
      
      <div className="flex-1 flex flex-col items-center md:items-end text-[#4B2E05]">
        <h2 className="text-5xl md:text-6xl font-bold tracking-widest uppercase mb-8">
          BeeVra
        </h2>
        <p className="text-lg md:text-2xl text-center md:text-right leading-relaxed opacity-90">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industries standard dummy text ever since the 1500s, 
          when an unknown printer took a galley of type and scrambled it to make a 
          type specimen book. It has survived not only five centuries, but also the 
          leap into electronic typesetting, remaining essentially unchanged. It was 
          popularised in the 1960s with the release of Letraset sheets containing 
          Lorem Ipsum passages, and more recently with desktop publishing software 
          like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-full max-w-[600px] aspect-square">
          <Image
            src="/Image/logo-secondary.png"
            alt="BeeVra"
            fill
            className="object-contain"
          />
        </div>
      </div>

    </section>
  );
}