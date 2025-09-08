"use client";
import { addToast } from "@heroui/react";
import axios from "axios";
import { File as FileType } from "@/lib/db/schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import FileTabs from "./tabs";
import { File } from "lucide-react";

interface fileListProps {
  userId: string;
  refreshTrigger?: number;
}
function FilesList({ userId, refreshTrigger = 0 }: fileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("files");
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/files?userId=${userId}`);
      setFiles(response.data);
      console.log("Files:", response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      addToast({
        title: "Error fetching files",
        description: "An error occurred while fetching files.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, fetchFiles]);

  const filterFiles = useMemo(() => {
    switch (activeTab) {
      case "starred":
        return files.filter((file) => file.isStarred && !file.isTrash);
      case "trash":
        return files.filter((file) => file.isTrash);
      case "files":
        return files.filter((file) => !file.isTrash);
    }
  }, [files, activeTab]);

  return (
    <div>
      <FileTabs
        onTabChange={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
      />
      <div className="gap-2 grid">
         
      </div>
    </div>
  );
}

export default FilesList;
