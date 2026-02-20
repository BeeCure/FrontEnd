"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showToast } from "@/components/Toast"; 
import { 
  RiMailLine, 
  RiPhoneLine, 
  RiInstagramLine, 
  RiFacebookCircleLine 
} from "react-icons/ri";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = name.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    const toastId = showToast.loading("Sedang mengirim pesan...");

    const templateParams = {
      title: "Kontak Masuk",
      name: name,
      email: email,
      message: message,
    };

    emailjs.send(
      "service_5ou2tnc",
      "template_gq7yetb",
      templateParams,
      "Ecu4nP1XPg_l7PzFF"
    )
    .then(() => {
      showToast.success("Pesan berhasil dikirim!", toastId);
      setName("");
      setEmail("");
      setMessage("");
    })
    .catch(() => {
      showToast.error("Gagal mengirim pesan.", toastId);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  function ContactInfo({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg border-[1.5px] border-[#4B2E05] text-[#4B2E05] flex items-center justify-center">
          {icon}
        </div>
        <span className="text-base lg:text-lg font-bold truncate">{text}</span>
      </div>
    );
  }

  return (
    <section id="contact" className="w-full max-w-7xl mx-auto px-6 py-16 font-inder">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
        <div className="w-full md:flex-[2] bg-[#F4B740] rounded-[15px] p-6 lg:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#4B2E05] text-center mb-6 uppercase tracking-widest">
            Hubungi Kami
          </h2>

          <form onSubmit={handleSendEmail} className="space-y-4 text-[#4B2E05]">
            <div className="space-y-1.5">
              <Label className="text-base font-bold ml-1">Nama</Label>
              <Input 
                required
                value={name}
                suppressHydrationWarning
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-[12px] border-none bg-[#FFF8E1] shadow-sm text-base px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-base font-bold ml-1">Email</Label>
              <Input 
                required
                type="email"
                value={email}
                suppressHydrationWarning
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-[12px] border-none bg-[#FFF8E1] shadow-sm text-base px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-base font-bold ml-1">Pesan</Label>
              <Textarea 
                required
                value={message}
                suppressHydrationWarning
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] rounded-[12px] border-none bg-[#FFF8E1] shadow-sm text-base p-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05] resize-none"
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-28 h-9 bg-[#34581B] hover:bg-[#2c4b17] rounded-[15px] text-white text-base font-bold shadow-md transition-transform active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Memproses" : "Kirim"}
              </Button>
            </div>
          </form>
        </div>

        <div className="w-full md:flex-[3] flex flex-col gap-8">
          <div className="w-full h-[280px] lg:h-[320px] rounded-[15px] overflow-hidden shadow-lg border border-[#4B2E05]/10">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.841630996472!2d105.2066029698308!3d-5.441005016893219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40d19ce092af23%3A0x505c844664c34005!2sLEMBAH%20SUHITA%2C%20SUHITA%20BEE%20FARM%20(eduwisata%20lebah%2C%20ecoprint%2C%20healing%20place)!5e0!3m2!1sid!2sid!4v1767146631181!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-[#4B2E05]">
            <ContactInfo icon={<RiMailLine size={20} />} text="lembahsuhita@gmail.com" />
            <ContactInfo icon={<RiPhoneLine size={20} />} text="+62123 4567 8910" />
            <ContactInfo icon={<RiInstagramLine size={20} />} text="@Lembah.suhita" />
            <ContactInfo icon={<RiFacebookCircleLine size={20} />} text="suhitabeefarm" />
          </div>
        </div>
      </div>
    </section>
  );
}