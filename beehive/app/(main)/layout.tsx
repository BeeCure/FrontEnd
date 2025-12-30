import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      <Navbar />
      <main className=" min-h-screen pt-20 md:pt-0">
        {children}
      </main>
    </div>
  );
}