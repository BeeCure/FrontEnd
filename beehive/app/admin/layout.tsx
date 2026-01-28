import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />
      <main className="flex-1 min-h-0 pt-10 overflow-y-auto lg:overflow-hidden">
        {children}
        <Toaster position="top-center" />
      </main>
    </div>
  );
}