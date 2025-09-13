"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  User,
} from "@heroui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { set } from "zod";
import LoadingSpinner from "./loading";
import { on } from "events";

type Props = {
  userId: string;
  parentId?: string | null;
  onUploadComplete: () => void;
};
function FileUploader({ userId, parentId = null, onUploadComplete }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);
      if (parentId) formData.append("parentId", parentId);

      const response = await axios.post("/api/files/upload", formData);

      if (response.status === 201 || response.status === 200) {
        console.log("on upload complete type....", typeof onUploadComplete);
        onUploadComplete?.();
        setSelectedFile(null);
        setPreview(null);
        addToast({
          title: "File uploaded succesfully!",
          description: `${response.data.name} uploaded successfully.`,
          color: "success",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Notify user of error
      addToast({
        title: "Failed to upload file.",
        description: `Failed to upload ${selectedFile.name}, Please try again.`,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    if (file.size > maxSize) {
      addToast({
        title: "File too large",
        description: "File size exceeds 10 MB limit.",
        color: "danger",
      });
      return;
    }
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
    <Card
      className="py-4 w-md bg-[#F5EEDD] text-[#06202B]     "
      isDisabled={loading}
    >
      <CardBody>
        <div
          {...getRootProps()}
          className={`border-2  rounded-2xl h-40 mb-1 text-center text-lg  items-center justify-center flex cursor-pointer ${isDragActive ? "border-[#7AE2CF]" : "border-[#077A7D]"}`}
        >
          <input {...getInputProps()} />
          {loading ? (
            <LoadingSpinner label="Uploading..." color="#06202B" />
          ) : isDragActive ? (
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
            // color="primary"
            variant="solid"
            className="flex-1 mr-2 bg-[#077A7D] text-[#F5EEDD] font-semibold hover:bg-[#7AE2CF] hover:text-[#06202B] hover:shadow-md/100  shadow-[#06202B]"
            isDisabled={!selectedFile}
            onClick={handleSubmit}
          >
            Upload
          </Button>
          <Button
            size="lg"
            // color="primary"
            variant="solid"
            className="flex-1 ml-2 bg-[#077A7D] text-[#F5EEDD] font-semibold hover:bg-[#7AE2CF] hover:text-[#06202B] hover:shadow-md/100  shadow-[#06202B]"
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
                <div className="text-[#08232e8c]">
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
      <Divider />
      <CardFooter>
        <ul className="list-disc list-inside text-sm text-[#06202B] space-y-1">
          <li>Allowed types → Images (JPG, PNG), PDFs, and Docs only.</li>
          <li>Max size → 10 MB per file.</li>
          <li>
            Naming → Use clear names (no special characters like #, $, %).
          </li>
          <li>Safe content → No harmful, copyrighted, or illegal files.</li>
        </ul>
      </CardFooter>
    </Card>
  );
}

export default FileUploader;
