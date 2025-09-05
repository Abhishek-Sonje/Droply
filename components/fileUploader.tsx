"use client";

import {
  Button,
  Card,
  CardBody,
  
  Divider,
  
  User,
} from "@heroui/react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  userId: string;
  parentId?: string | null;
};
function FileUploader({ userId, parentId = null }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

 const handleSubmit = async () => {
   if (!selectedFile) return;
   try {
     const formData = new FormData();
     formData.append("file", selectedFile);
     formData.append("userId", userId);
     if (parentId) formData.append("parentId", parentId);

     const response = await fetch("/api/files/upload", {
       method: "POST",
       body: formData,
     });

     if (!response.ok) {
       throw new Error("Upload failed");
     }

     const data = await response.json();
     console.log(data);
     // Optionally notify user of success
     alert("File uploaded successfully!");
   } catch (error) {
     console.error("Upload error:", error);
     // Notify user of error
     alert("Failed to upload file. Please try again.");
   }
 };
const onDrop = (acceptedFiles: File[]) => {
  const file = acceptedFiles[0];
  setSelectedFile(file);

  if (preview) {
    URL.revokeObjectURL(preview); // Revoke previous URL
  }

  if (file && file.type.startsWith("image/")) {
    const objUrl = URL.createObjectURL(file);
    setPreview(objUrl);
  } else {
    setPreview(null);
  }
};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  return (
    <Card className="py-4 max-h-96 w-96 ">
      <CardBody>
        <div
          {...getRootProps()}
          className="border-2 border-gray-400 rounded-2xl h-40 mb-1   text-center items-center justify-center flex cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>
              Drag &#39;n&#39; drop some files here
              <br /> or
              <br /> click to select files
            </p>
          )}
        </div>

        <div className="flex justify-around py-4">
          <Button
            size="lg"
            fullWidth
            color="primary"
            variant="solid"
            className="flex-1 mr-2"
            isDisabled={!selectedFile}
            onClick={handleSubmit}
          >
            Upload
          </Button>
          <Button
            size="lg"
            color="primary"
            variant="solid"
            className="flex-1 ml-2"
            onClick={() => {
              if (preview) {
                URL.revokeObjectURL(preview!);
                setPreview(null);
              }
              setSelectedFile(null);
            }}
            isDisabled={!selectedFile}
          >
            Cancel
          </Button>
        </div>

        {selectedFile && (
          <div className="overflow-hidden">
            <Divider className="my-2 " />
            <User
              avatarProps={{
                src: preview ? preview : "/pdf.png",
                radius: "sm", // Changed from default "full" to make it rectangular
              }}
              description={
                <div>
                  <p>
                    {selectedFile?.size
                      ? formatFileSize(selectedFile.size)
                      : "0 bytes"}
                  </p>
                  <p>{selectedFile?.type}</p>
                </div>
              }
              name={selectedFile?.name}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default FileUploader;
