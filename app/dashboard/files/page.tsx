import FileUploader from "@/components/fileUploader";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import UserFiles from "@/components/userFiles";

async function FilePage ()  {
  const { userId } = await auth();
    if (!userId) return <p>Unauthorized</p>;
    return (
      // <h1>hello</h1>
      <div className="flex justify-center items-center h-screen bg-black">
        <FileUploader userId={userId} />
        <UserFiles/>
      </div>
    );
}

export default FilePage;
