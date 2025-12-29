import { Inder } from "next/font/google";

const inder = Inder({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inder.className} min-h-screen w-full flex items-center justify-center bg-[#FFF8E1] p-4`}>
      {children}
    </div>
  );
}