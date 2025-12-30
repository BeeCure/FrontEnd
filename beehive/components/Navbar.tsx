"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beef, Menu, Home, BookOpen, Info, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="w-[95%] max-w-7xl h-16 md:h-20 backdrop-blur-md flex items-center justify-between ">
        <Link href="/" className="flex items-center gap-2 text-[#4B2E05]">
          <Beef strokeWidth={2.5} className="w-[30px] h-[30px] md:w-[35px] md:h-[35px]" />
          <span className="text-xl md:text-2xl font-bold tracking-tighter">Bee HIVE</span>
        </Link>

        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-[#4B2E05] text-lg font-medium hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                  Beranda
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-transparent border-none shadow-none">
                  <ul className="flex flex-col w-[200px] p-2 bg-[#FFF8E1] rounded-[18px] border border-[#4B2E05]/10 shadow-xl">
                    <ListItem href="/fitur" title="Fitur" />
                    <ListItem href="/diagram" title="Diagram Lebah" />
                    <ListItem href="/hubungi" title="Hubungi Kami" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/klasifikasi" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-[#4B2E05] text-lg font-medium hover:bg-transparent",
                    pathname === "/klasifikasi" && "font-bold border-b-2 border-[#4B2E05] rounded-none"
                  )}>
                    Klasifikasi Lebah
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/informasi" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-[#4B2E05] text-lg font-medium hover:bg-transparent",
                    pathname === "/informasi" && "font-bold border-b-2 border-[#4B2E05] rounded-none"
                  )}>
                    Informasi Lebah
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-[#4B2E05] outline-none">
                  <Menu size={28} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#FFF8E1] border-none text-[#4B2E05] w-[300px] sm:w-[350px]">
                <SheetHeader className="text-left border-b border-[#4B2E05]/10 pb-6">
                  <SheetTitle className="flex items-center gap-2 text-[#4B2E05]">
                    <Beef strokeWidth={2.5} size={28} />
                    <span className="text-xl font-bold tracking-tighter">Bee HIVE</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-8">
                  <div className="py-2">
                    <div className="flex items-center gap-3 px-3 py-2 font-bold opacity-50 uppercase text-xs tracking-widest">
                      Menu Utama
                    </div>
                    <Link href="/" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F4B740]/20 font-semibold text-lg">
                      <Home size={20} /> Beranda
                    </Link>
                    <div className="ml-9 flex flex-col gap-1 border-l-2 border-[#4B2E05]/10 mt-1">
                      <Link href="/fitur" className="px-4 py-2 hover:text-[#F4B740]">Fitur</Link>
                      <Link href="/diagram" className="px-4 py-2 hover:text-[#F4B740]">Diagram Lebah</Link>
                      <Link href="/hubungi" className="px-4 py-2 hover:text-[#F4B740]">Hubungi Kami</Link>
                    </div>
                  </div>
                  <Link href="/klasifikasi" className="flex items-center justify-between px-3 py-4 rounded-xl hover:bg-[#F4B740]/20 font-semibold text-lg">
                    <div className="flex items-center gap-3"><BookOpen size={20} /> Klasifikasi Lebah</div>
                    <ChevronRight size={18} className="opacity-40" />
                  </Link>
                  <Link href="/informasi" className="flex items-center justify-between px-3 py-4 rounded-xl hover:bg-[#F4B740]/20 font-semibold text-lg">
                    <div className="flex items-center gap-3"><Info size={20} /> Informasi Lebah</div>
                    <ChevronRight size={18} className="opacity-40" />
                  </Link>
                </div>
                <div className="absolute bottom-8 left-6 right-6 p-4 bg-[#F4B740] rounded-2xl flex items-center gap-4 shadow-md">
                  <Avatar className="w-10 h-10 border-2 border-[#FFF8E1]">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AE</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm leading-none">Arswendo Erza</span>
                    <span className="text-[10px] opacity-70">Lihat Profil</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/profile">
            <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-[#F4B740] shadow-sm hover:scale-105 transition-transform">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback className="bg-[#4B2E05] text-[#FFF8E1]">AE</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; href: string }
>(({ className, title, href, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        ref={ref}
        href={href}
        className={cn("block select-none rounded-[12px] p-3 text-[#4B2E05] transition-all group", className)}
        {...props}
      >
        <div className="text-sm font-bold leading-none inline-block relative">
          {title}
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#4B2E05] transition-all duration-300 group-hover:w-full" />
        </div>
      </Link>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";