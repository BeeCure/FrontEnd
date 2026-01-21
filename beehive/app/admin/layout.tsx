import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      <Navbar />
      <main className=" min-h-screen pt-15 md:pt-10">
        {children}
      </main>
    </div>
  );
}