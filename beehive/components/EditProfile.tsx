"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function EditProfile({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("Arswendo Erza Sadewa");
  const [phone, setPhone] = useState("081234567890");
  const [email, setEmail] = useState("aarswendoerza00@gmail.com");
  const [address, setAddress] = useState("Jl. Madu Murni No. 123, MLampung Tengah, Lamping");

  const isFormValid = name !== "" && phone !== "" && email !== "" && address !== "";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] sm:w-full max-w-[450px] bg-[#F4B740] border-none rounded-[15px] p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-6">
          
          <div className="relative group cursor-pointer">
            <Avatar className="w-32 h-32 border-4 border-[#FFF8E1] shadow-lg">
              <AvatarImage src="https://github.com/shadcn.png" className="object-cover" />
              <AvatarFallback>AE</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <Pencil size={40} className="text-white opacity-80" />
            </div>
          </div>

          <div className="w-full space-y-4 text-[#4B2E05]">
            <div className="space-y-1">
              <Label className="text-lg font-bold ml-1">Nama Lengkap</Label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-bold ml-1">No Telepon</Label>
              <Input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-bold ml-1">Email</Label>
              <Input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-lg font-bold ml-1">Alamat</Label>
              <Input 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11 rounded-[15px] border-none bg-[#FFF8E1] shadow-inner text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#4B2E05]" 
              />
            </div>
          </div>

          <div className="flex gap-4 w-full justify-center pt-4">
            <DialogClose asChild>
              <Button type="button" className="w-32 h-10 bg-[#8E4117] hover:bg-[#7a3713] text-white rounded-full text-lg font-bold shadow-md">
                Batal
              </Button>
            </DialogClose>
            <Button 
              disabled={!isFormValid}
              type="submit" 
              className="w-32 h-10 bg-[#34581B] hover:bg-[#2c4b17] text-white rounded-full text-lg font-bold shadow-md disabled:opacity-50"
            >
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}