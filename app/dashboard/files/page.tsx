import React from "react";
import { auth } from "@clerk/nextjs/server";

import DashboardContent from "@/components/dashboardContent";
import NavbarPage from "@/components/Navbar";

async function FilePage() {
  const { userId } = await auth();
  if (!userId) return <p>Unauthorized</p>;
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br bg-[#06202B] p-2">
      <NavbarPage activeTab="files" />
      <DashboardContent />
    </div>
  );
}

export default FilePage;