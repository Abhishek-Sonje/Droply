import React from "react";
import { auth } from "@clerk/nextjs/server";

import DashboardContent from "@/components/dashboardContent";
import NavbarPage from "@/components/Navbar";

async function FilePage() {
  const { userId } = await auth();
  if (!userId) return <p>Unauthorized</p>;
  return (
    <>
      <DashboardContent />
    </>
  );
}

export default FilePage;