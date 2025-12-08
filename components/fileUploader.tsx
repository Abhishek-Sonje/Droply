"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  User,
  ScrollShadow
} from "@heroui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import LoadingSpinner from "./loading";
import { File as FileIcon, X } from "lucide-react";

type Props = {
  userId: string;
  parentId?: string | null;
  onUploadComplete: () => void;
};

function FileUploader({ userId, parentId = null, onUploadComplete }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Clean up previews if we had them (removed image preview for simplicity in multi-file)
  
  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);
    try {
      // Upload sequentially to avoid overwhelming server/network, or parallel if preferred
      // Using Promise.all for parallel
      const uploadPromises = selectedFiles.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("userId", userId);
          if (parentId) formData.append("parentId", parentId);
          return axios.post("/api/files/upload", formData);
      });

      await Promise.all(uploadPromises);

      onUploadComplete?.();
      setSelectedFiles([]);
      addToast({
        title: "Upload Complete",
        description: `${selectedFiles.length} files uploaded successfully.`,
        color: "success",
      });
      
    } catch (error) {
      console.error("Upload error:", error);
      addToast({
        title: "Failed to upload",
        description: `Some files failed to upload. Please try again.`,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    const validFiles = acceptedFiles.filter(file => {
        if (file.size > maxSize) {
            addToast({
                title: "File too large",
                description: `${file.name} exceeds 10 MB limit.`,
                color: "danger",
            });
            return false;
        }
        return true;
    });
    
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/*": [],
      "application/msword": [], 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": []
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card
      className="py-0 w-full bg-transparent border-none shadow-none"
      isDisabled={loading}
    >
      <CardBody className="p-0 overflow-visible">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl h-24 text-center items-center justify-center flex cursor-pointer transition-all duration-200 group
            ${isDragActive 
                ? "border-sky-500 bg-sky-500/10" 
                : "border-slate-700 hover:border-sky-400/50 hover:bg-slate-800/50"
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-1 p-2">
              {loading ? (
                <LoadingSpinner label="Uploading..." color="#38bdf8" />
              ) : (
                <>
                    <div className="p-2 rounded-full bg-slate-800 text-slate-400 group-hover:text-sky-400 transition-colors">
                        <FileIcon size={20} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                        Drag files or <span className="text-sky-400 underline decoration-sky-400/30">browse</span>
                    </p>
                </>
              )}
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
            <div className="mt-4 animate-appearance-in">
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ready to Upload</span>
                    <span className="text-xs text-slate-500">{selectedFiles.length} files</span>
                </div>
                <ScrollShadow className="max-h-40 w-full bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex flex-col p-1 gap-1">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex justify-between items-center bg-slate-800/80 p-2 rounded-md border border-slate-700/30">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0">
                                       <FileIcon size={14} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs font-medium truncate text-slate-200">{file.name}</span>
                                        <span className="text-[10px] text-slate-500">{formatFileSize(file.size)}</span>
                                    </div>
                                </div>
                                <Button isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-red-400 h-6 w-6 min-w-6" onClick={() => removeFile(index)} isDisabled={loading}>
                                    <X size={12} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollShadow>
                
                <div className="flex gap-2 mt-3">
                    <Button
                        size="sm"
                        fullWidth
                        className="bg-sky-600 text-white font-medium hover:bg-sky-500 shadow-lg shadow-sky-900/20"
                        isDisabled={selectedFiles.length === 0 || loading}
                        onClick={handleSubmit}
                        isLoading={loading}
                    >
                        {loading ? "Uploading..." : "Upload All"}
                    </Button>
                    <Button
                        size="sm"
                        isIconOnly
                        variant="flat"
                        className="bg-slate-800 text-slate-400 hover:text-red-400"
                        onClick={() => setSelectedFiles([])}
                        isDisabled={selectedFiles.length === 0 || loading}
                    >
                        <X size={16}/>
                    </Button>
                </div>
            </div>
        )}
      </CardBody>
    </Card>
  );
}

export default FileUploader;
