"use client";

import React, { useState } from "react";
import FileUploader from "./fileUploader";
import FilesList from "./filesList";

import { useUser } from "@clerk/clerk-react";
import NavbarPage from "./Navbar";
import LoadingSpinner from "./loading";

function DashboardContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <LoadingSpinner label="Loading..." />;
  const userId = user?.id;
  if (!userId) {
    return <h1>Unauthorize</h1>;
  }

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
