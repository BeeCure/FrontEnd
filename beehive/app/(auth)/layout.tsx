export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-[#FFF8E1] p-4 relative overflow-hidden`}>
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: "url('/Image/pattern-warna.png')", 
          backgroundRepeat: "repeat",
          backgroundSize: "400px" 
        }}
      />

      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}