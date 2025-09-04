"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  form,
  User,
} from "@heroui/react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

function FileUploader({userId}:{userId:string}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);
    console.log(formData);

    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
  }
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

    if (file && file.type.startsWith("image/")) {
      const objUrl = URL.createObjectURL(file);
      setPreview(objUrl);
    } else {
      {
        setPreview(null);
      }
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
            variant="ghost"
            className="mx-3"
            isDisabled={!selectedFile}
            onClick={handleSubmit}
          >
            Upload
          </Button>
          <Button
            size="lg"
            color="primary"
            variant="ghost"
            fullWidth
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
                      ? (selectedFile?.size / 1000000).toFixed(2)
                      : 0}{" "}
                    mb
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
