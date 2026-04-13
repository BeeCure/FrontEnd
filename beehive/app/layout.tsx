import type { Metadata } from "next";
import { Inder } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inder = Inder({ 
  weight: "400", 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeeVra",
  description: "Sisten Informasi dan Klasifikasi Lebah Madu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inder.className} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}