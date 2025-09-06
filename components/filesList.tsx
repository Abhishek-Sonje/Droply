"use client";

import React, { useState } from "react";
import { useFiles } from "../hooks/useFiles";
import Image from "next/image";
interface File {
  id: string;
  type: string;
  fileUrl: string;
  name: string;
}
function FilesList({ filter }: { filter: string }) {
  const { data, isLoading, error } = useFiles(filter);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-400">
      {data.map((file: File) => (
        <div key={file.id} className="border rounded p-2 bg-white shadow">
          {file.type.startsWith("image/") ? (
            <Image
              src={file.fileUrl}
              alt={file.name}
              width={200}
              height={200}
              className="h-32 w-full object-cover"
            />
          ) : file.type === "application/pdf" ? (
            <Image
              src="/pdf.png"
              alt="PDF"
              width={200}
              height={200}
              className="h-32 w-full object-cover"
            />
          ) : (
            <div className="h-32 flex items-center justify-center bg-gray-200">
              ❓
            </div>
          )}
          <p className="mt-2 text-sm truncate">{file.name}</p>
        </div>
      ))}
    </div>
  );
}

export default FilesList;
