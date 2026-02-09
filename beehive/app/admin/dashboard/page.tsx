"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RiFacebookCircleLine, RiMailLine, RiPhoneLine, RiUser3Line } from "react-icons/ri";
import { PieChart, Pie, Cell, ResponsiveContainer, PieLabelRenderProps } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "motion/react";

import PermintaanAkun from "@/components/Admin/permintaanAkun";
import AkunAktif from "@/components/Admin/akunAktif";
import AkunTidakAktif from "@/components/Admin/akunTidakAktif";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  approvalStatus: string;
}

interface PractitionerDetail {
  name: string;
  email: string;
  phone: string;
  facebookUrl: string;
}

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [practitioners, setPractitioners] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState<PractitionerDetail | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const checkAccess = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, { 
        credentials: "include" 
      });
      
      const result = await res.json();

      if (!result.success || result.data.role !== "SUPER_ADMIN") {
        router.push("/forbidden");
        return;
      }
      
      setIsVerifying(false);
      fetchData();
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/forbidden");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/practitioners`, { credentials: "include" });
      const result = await res.json();
      if (result.success) setPractitioners(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    checkAccess();
  }, [checkAccess]);

  const handleCardClick = async (userId: string) => {
    setIsDetailOpen(true);
    setIsFetchingDetail(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/practitioner/${userId}`, { credentials: "include" });
      const result = await res.json();
      if (result.success) setSelectedPractitioner(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  if (isVerifying || isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FFF8E1]">
        <Loader2 className="animate-spin text-[#4B2E05]" size={48} />
      </div>
    );
  }

  const pendingRequests = practitioners.filter(p => p.approvalStatus === "PENDING");
  const activeList = practitioners.filter(p => p.status === "ACTIVE" && p.approvalStatus === "APPROVED");
  const inactiveList = practitioners.filter(p => p.status === "INACTIVE");
  const total = practitioners.length;

  const chartData: ChartItem[] = [
    { name: "Permintaan", value: pendingRequests.length, color: "#F4B740" },
    { name: "Aktif", value: activeList.length, color: "#4B2E05" },
    { name: "Tidak Aktif", value: inactiveList.length, color: "#8E4117" },
  ].filter(item => item.value > 0);

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
    const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + radius * Math.cos(-Number(midAngle) * (Math.PI / 180));
    const y = Number(cy) + radius * Math.sin(-Number(midAngle) * (Math.PI / 180));
    const ma = Number(midAngle);
    const color = ma > -120 && ma < 0 ? "#FFF8E1" : (ma < -240 ? "#4B2E05" : "#FFF8E1");
    return (
      <text x={x} y={y} fill={color} textAnchor="middle" dominantBaseline="central" className="text-[10px] font-black">
        {`${(Number(percent) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <main className="min-h-full lg:h-full w-full bg-[#FFF8E1] p-4 md:px-12 md:py-8 mt-4 md:mt-2 font-inder text-[#4B2E05] flex flex-col overflow-hidden">
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-6 lg:space-y-10 min-h-0"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 items-center shrink-0">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#F4B740] rounded-[15px] p-4 md:p-6 flex flex-col justify-center h-28 md:h-36 shadow-sm"
          >
            <h2 className="text-3xl md:text-5xl font-bold leading-none">{pendingRequests.length}</h2>
            <p className="text-xs md:text-lg font-bold mt-1 opacity-80 uppercase tracking-wider">Permintaan</p>
          </motion.div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#4B2E05] rounded-[15px] p-4 md:p-6 flex flex-col justify-center h-28 md:h-36 shadow-sm text-[#FFF8E1]"
          >
            <h2 className="text-3xl md:text-5xl font-bold leading-none">{activeList.length}</h2>
            <p className="text-xs md:text-lg font-bold mt-1 opacity-80 uppercase tracking-wider">Aktif</p>
          </motion.div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-[#8E4117] rounded-[15px] p-4 md:p-6 flex flex-col justify-center h-28 md:h-36 shadow-sm text-[#FFF8E1]"
          >
            <h2 className="text-3xl md:text-5xl font-bold leading-none">{inactiveList.length}</h2>
            <p className="text-xs md:text-lg font-bold mt-1 opacity-80 uppercase tracking-wider">Tidak Aktif</p>
          </motion.div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative w-28 h-28 md:w-40 md:h-40 mx-auto shrink-0"
          >
            {mounted && (
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={chartData} cx="50%" cy="50%" innerRadius="55%" outerRadius="100%" paddingAngle={0} dataKey="value" stroke="none" labelLine={false} label={renderCustomizedLabel}>{chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie></PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Total</span>
              <span className="text-lg font-bold">{total}</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 flex-1 min-h-0 items-start pb-4">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-full min-h-0"
          >
            <PermintaanAkun list={pendingRequests} onCardClick={handleCardClick} refreshData={fetchData} />
          </motion.div>
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="h-full min-h-0"
          >
            <AkunAktif list={activeList} onCardClick={handleCardClick} refreshData={fetchData} />
          </motion.div>
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="h-full min-h-0"
          >
            <AkunTidakAktif list={inactiveList} onCardClick={handleCardClick} refreshData={fetchData} />
          </motion.div>
        </div>
      </motion.div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[#F4B740] border-none rounded-[15px] w-[92%] sm:w-full max-w-[450px] p-8 shadow-2xl font-inder text-[#4B2E05]">
          <DialogHeader><DialogTitle className="text-2xl font-bold text-center pb-4 uppercase tracking-widest">Detail Praktisi</DialogTitle><DialogDescription className="sr-only">Detail profil.</DialogDescription></DialogHeader>
          {isFetchingDetail ? (<div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#4B2E05]" size={32} /></div>) : selectedPractitioner && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4 bg-[#FFF8E1] p-4 rounded-2xl shadow-sm"><RiUser3Line size={24} /><div className="flex flex-col"><span className="text-[10px] uppercase opacity-60 font-bold text-left">Nama</span><span className="font-bold text-lg leading-tight">{selectedPractitioner.name}</span></div></div>
              <div className="flex items-center gap-4 bg-[#FFF8E1] p-4 rounded-2xl shadow-sm"><RiMailLine size={24} /><div className="flex flex-col"><span className="text-[10px] uppercase opacity-60 font-bold text-left">Email</span><span className="font-medium truncate max-w-[280px]">{selectedPractitioner.email}</span></div></div>
              <div className="flex items-center gap-4 bg-[#FFF8E1] p-4 rounded-2xl shadow-sm"><RiPhoneLine size={24} /><div className="flex flex-col"><span className="text-[10px] uppercase opacity-60 font-bold text-left">Telepon</span><span className="font-medium">{selectedPractitioner.phone}</span></div></div>
              <div className="flex items-center gap-4 bg-[#FFF8E1] p-4 rounded-2xl shadow-sm overflow-hidden"><RiFacebookCircleLine size={24} /><div className="flex flex-col overflow-hidden w-full"><span className="text-[10px] uppercase opacity-60 font-bold text-left">Sosial Media</span><a href={selectedPractitioner.facebookUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline truncate font-medium">{selectedPractitioner.facebookUrl}</a></div></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}