"use client"

import React, { useState } from "react";
import FileUploader from "./fileUploader";
import FilesList from "./filesList";

import { useUser } from "@clerk/clerk-react";
import NavbarPage from "./Navbar";

function DashboardContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useUser();
  const userId = user?.id;
  if (!userId) return <p>Unauthorized</p>;

  function handleRefresh() {
    console.log("Refresh triggered");
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
   
      
      <div className="flex justify-center items-center h-screen gap-4">
        <FileUploader userId={userId} onUploadComplete={handleRefresh} />
        <FilesList userId={userId} refreshTrigger={refreshTrigger} />
      </div>
    
  );
}

export default DashboardContent;
