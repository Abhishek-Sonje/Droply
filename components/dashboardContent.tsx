import React, { useState } from "react";
import FileUploader from "./fileUploader";
import FilesList from "./filesList";

import { useUser } from "@clerk/clerk-react";

function DashboardContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useUser();
  const userId = user?.id;
  if (!userId) return <p>Unauthorized</p>;
  return (
    <div className="flex justify-center items-center gap-4 h-screen bg-slate-950 ">
      <FileUploader userId={userId} setRefreshTrigger={setRefreshTrigger} />
      <FilesList userId={userId} refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default DashboardContent;
