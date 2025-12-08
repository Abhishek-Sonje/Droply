import Sidebar from "@/components/Sidebar";
import React, { Suspense } from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#0f172a] overflow-hidden text-slate-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header Placeholder (TODO: Add mobile sidebar toggle) */}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full h-full p-4 md:p-6 scrollbar-hide">
            {children}
        </main>
      </div>
    </div>
  );
}
