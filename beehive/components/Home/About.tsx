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
          BeeVra adalah sistem berbasis AI yang dikembangkan untuk membantu dalam mengenali dan memahami berbagai jenis lebah madu Indo-Malaya melalui citra gambar.
          Selain melakukan klasifikasi secara otomatis, 
          BeeVra juga menyediakan informasi terkait setiap jenis lebah madu, sehingga pengguna tidak hanya mengetahui hasil identifikasi,
          tetapi juga memperoleh pengetahuan tambahan mengenai karakteristik datri lebah madu tersebut.
          Dengan BeeVra, proses yang sebelumnya dilakukan secara manual menjadi lebih cepat, konsisten, dan terdokumentasi dengan baik pada sistem.
        </p>
      </div>

      <div className="flex-1 flex justify-center items-center w-full">
        <div className="w-full max-w-[500px]">
          <Image
            src="/Image/logo-secondary.png"
            alt="BeeVra"
            width={500}
            height={500}
            className="w-full h-auto object-contain rounded-[15px]"
            priority
          />
        </div>
      </div>

    </section>
  );
}
