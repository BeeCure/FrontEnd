"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Home, BookOpen, Info, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; avatarUrl: string | null; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile?t=${Date.now()}`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setUser(result.data);
        } else {
          setUser(null);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [pathname]);

  if (!mounted) return null;

  const getInitials = (name: string) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) : "??";
  };

  const avatarSrc = user?.avatarUrl 
    ? `${user.avatarUrl}${user.avatarUrl.includes('?') ? '&' : '?'}t=${Date.now()}` 
    : undefined;

  const navItemStyle = "group bg-transparent text-[#4B2E05] text-lg font-medium px-4 py-2 flex items-center justify-center hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent border-none shadow-none ring-0 outline-none transition-none cursor-pointer";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2">
      <div className="w-[95%] max-w-7xl h-16 md:h-18 bg-[#FFF8E1]/30 md:backdrop-blur-md rounded-[15px] px-4 md:px-8 flex items-center justify-between">
        
        <Link href="/" className="flex items-center">
          <Image src="/Image/logo-primary.png" alt="BeeVra" width={160} height={50} className="h-10 md:h-12 w-auto object-contain" priority />
        </Link>

        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem className="group/nav">
                <NavigationMenuTrigger className={navItemStyle}>
                  <span className="relative">Beranda<span className="absolute left-0 -bottom-1 w-0 h-[2.5px] bg-[#4B2E05] transition-all duration-300 group-hover/nav:w-full" /></span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-transparent border-none shadow-none">
                  <ul className="flex flex-col w-[200px] p-2 bg-[#FFF8E1] rounded-[18px] border border-[#4B2E05]/10 shadow-xl">
                    <ListItem href="/#hero" title="Layanan Utama" />
                    <ListItem href="/#about" title="Mengenal BeeVra" />
                    <ListItem href="/#contact" title="Hubungi Kami" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="group/nav">
                <NavigationMenuLink asChild>
                  <Link href="/klasifikasi" className={navItemStyle}>
                    <span className="relative">Klasifikasi Lebah<span className={cn("absolute left-0 -bottom-1 h-[2.5px] bg-[#4B2E05] transition-all duration-300 group-hover/nav:w-full", pathname === "/klasifikasi" ? "w-full" : "w-0")} /></span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="group/nav">
                <NavigationMenuLink asChild>
                  <Link href="/informasi" className={navItemStyle}>
                    <span className="relative">Informasi Lebah<span className={cn("absolute left-0 -bottom-1 h-[2.5px] bg-[#4B2E05] transition-all duration-300 group-hover/nav:w-full", pathname === "/informasi" ? "w-full" : "w-0")} /></span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {user?.role === "SUPER_ADMIN" && (
                <NavigationMenuItem className="group/nav">
                  <NavigationMenuLink asChild>
                    <Link href="/admin/dashboard" className={navItemStyle}>
                      <span className="relative">Monitoring<span className={cn("absolute left-0 -bottom-1 h-[2.5px] bg-[#4B2E05] transition-all duration-300 group-hover/nav:w-full", pathname === "/admin/dashboard" ? "w-full" : "w-0")} /></span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-[#4B2E05] outline-none"><Menu size={28} /></button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#FFF8E1] border-none text-[#4B2E05] w-[300px] sm:w-[350px]">
                <SheetHeader className="text-left border-b border-[#4B2E05]/10 pb-6">
                  <SheetTitle><Image src="/Image/logo-primary.png" alt="BeeVra" width={120} height={40} className="h-8 w-auto object-contain" /></SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-8">
                  <Link href="/" className="flex items-center gap-3 px-3 py-4 rounded-xl hover:bg-[#F4B740]/20 font-semibold text-lg"><Home size={20} /> Beranda</Link>
                  <Link href="/klasifikasi" className="flex items-center justify-between px-3 py-4 rounded-xl hover:bg-[#F4B740]/20 font-semibold text-lg"><div className="flex items-center gap-3"><BookOpen size={20} /> Klasifikasi Lebah</div><ChevronRight size={18} className="opacity-40" /></Link>
                  <Link href="/informasi" className="flex items-center justify-between px-3 py-4 rounded-xl hover:bg-[#F4B740]/20 font-semibold text-lg"><div className="flex items-center gap-3"><Info size={20} /> Informasi Lebah</div><ChevronRight size={18} className="opacity-40" /></Link>
                  {user?.role === "SUPER_ADMIN" && (
                    <Link href="/admin/dashboard" className="flex items-center justify-between px-3 py-4 rounded-xl hover:bg-[#F4B740]/20 font-semibold text-lg"><div className="flex items-center gap-3"><LayoutDashboard size={20} /> Monitoring</div><ChevronRight size={18} className="opacity-40" /></Link>
                  )}
                </div>
                {!isLoading && (
                  <div className="absolute bottom-8 left-6 right-6">
                    {user ? (
                      <Link href="/profile" className="p-4 bg-[#F4B740] rounded-2xl flex items-center gap-4 shadow-md">
                        <Avatar className="w-10 h-10 border-2 border-[#FFF8E1]">
                          <AvatarImage src={avatarSrc} />
                          <AvatarFallback className="bg-[#4B2E05] text-[#FFF8E1] font-bold">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate"><span className="font-bold text-sm leading-none truncate">{user.name}</span><span className="text-[10px] opacity-70">Lihat Profil</span></div>
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button asChild className="w-full bg-[#3D2504] text-[#FFF8E1] rounded-full font-bold"><Link href="/login">Masuk</Link></Button>
                        <Button asChild variant="outline" className="w-full border-[#3D2504] text-[#3D2504] rounded-full font-bold"><Link href="/register">Daftar</Link></Button>
                      </div>
                    )}
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {!isLoading && (
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <Link href="/profile">
                  <Avatar className="w-11 h-11 border-2 border-[#F4B740] shadow-sm hover:scale-105 transition-transform">
                    <AvatarImage src={avatarSrc} alt={user.name} />
                    <AvatarFallback className="bg-[#4B2E05] text-[#FFF8E1] font-bold">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-[#4B2E05] font-bold hover:opacity-70 text-base">Masuk</Link>
                  <Button asChild className="bg-[#3D2504] hover:bg-[#2a1a03] text-[#FFF8E1] rounded-full font-bold px-6 h-10 shadow-md"><Link href="/register">Daftar</Link></Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<typeof Link> & { title: string }>(({ className, title, href, ...props }, ref) => (
  <li className="group/item">
    <NavigationMenuLink asChild>
      <Link ref={ref} href={href} className={cn("block select-none rounded-[12px] p-3 text-[#4B2E05] transition-all", className)} {...props}>
        <div className="text-sm font-bold leading-none inline-block relative">{title}<span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#4B2E05] transition-all duration-300 group-hover/item:w-full" /></div>
      </Link>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";