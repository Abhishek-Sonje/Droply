import FileUploader from "@/components/fileUploader";
import React from "react";
import { auth } from "@clerk/nextjs/server";
// import UserFiles from "@/components/userFiles";
import FilesList from "@/components/filesList";

async function FilePage ()  {
  const { userId } = await auth();
    if (!userId) return <p>Unauthorized</p>;
    return (
      // <h1>hello</h1>
      <div className="flex justify-center items-center gap-4 h-screen bg-slate-950 ">
        <FileUploader userId={userId}  />
        <FilesList userId={userId} />
      </div>
    );
}

export default FilePage;
