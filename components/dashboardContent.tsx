"use client";

import React from "react";
import FilesList from "./filesList";

import { useUser } from "@clerk/clerk-react";
import LoadingSpinner from "./loading";

function DashboardContent() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <LoadingSpinner label="Loading..." color="#38bdf8" />;
  const userId = user?.id;
  if (!userId) {
    return <h1>Unauthorized</h1>;
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <FilesList 
        userId={userId} 
      />
    </div>
  );
}

export default DashboardContent;
