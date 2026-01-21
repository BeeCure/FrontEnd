import type { Metadata } from "next";
import { Inder } from "next/font/google";
import "./globals.css";

const inder = Inder({ 
  weight: "400", 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeeVra",
  description: "Pelestarian Lebah Madu",
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
      </body>
    </html>
  );
}