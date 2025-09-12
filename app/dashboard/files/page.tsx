import React from "react";
import { auth } from "@clerk/nextjs/server";

import DashboardContent from "@/components/dashboardContent";
import NavbarPage from "@/components/Navbar";

async function FilePage() {
  const { userId } = await auth();
  if (!userId) return <p>Unauthorized</p>;
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#EAE7DD] via-[#D9D4C7] to-[#F5F5F0] p-2">
      <NavbarPage />
      <DashboardContent />
    </div>
  );
}

export default FilePage;
