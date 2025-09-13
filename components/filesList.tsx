"use client";
import { addToast, Button } from "@heroui/react";
import axios from "axios";
import { File as FileType } from "@/lib/db/schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import FileTabs from "./tabs";
import { FolderSearch, Trash2 } from "lucide-react";
import FileCard from "./fileCard";

import LoadingSpinner from "./loading";

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

  const handleOpen = (fileUrl: string) => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };
  const handleStar = async (fileId: string) => {
    if (!fileId) return;

    try {
      await axios.patch(`/api/files/${fileId}/star`);

      setFiles(
        files.map((file) => {
          return file.id === fileId
            ? { ...file, isStarred: !file.isStarred }
            : file;
        })
      );

      const file = files.find((file) => file.id === fileId);
      addToast({
        title: file?.isStarred ? "Removed from Starred" : "Added to Starred",
        description: `${file?.name} ${file?.isStarred ? "added to starred" : "removed from starred"}`,
        color: "success",
      });
    } catch (error) {
      console.error("Error fetching files:", error);
      addToast({
        title: "Action Failed",
        description: "We could'nt update the star status,please try again",
        color: "danger",
      });
    }
  };
  const handleTrash = async (fileId: string) => {
    if (!fileId) return;

    try {
      await axios.patch(`/api/files/${fileId}/trash`);

      setFiles(
        files.map((file) => {
          return file.id === fileId
            ? { ...file, isTrash: !file.isTrash }
            : file;
        })
      );

      const file = files.find((file) => file.id === fileId);
      addToast({
        title: file?.isTrash ? "Removed from Trash" : "Moved to Trash",
        description: `${file?.name} ${file?.isTrash ? "Removed from Trash" : "Moved to Trash"}`,
        color: "success",
      });
    } catch (error) {
      console.error("Error trashing file:", error);
      addToast({
        title: "Action Failed",
        description: "We could'nt trash the file,please try again",
        color: "danger",
      });
    }
  };
  const handleEmptyTrash = async () => {
    try {
      console.log("Emptying trash");
      await axios.delete(`/api/files/empty-trash`);

      setFiles(files.filter((file) => !file.isTrash));

      addToast({
        title: "Empty Trash",
        description: "Trash is now empty",
        color: "success",
      });
    } catch (error) {
      console.log("Error emptying trash:", error);
      addToast({
        title: "Action Failed",
        description: "We could'nt empty the trash,please try again",
        color: "danger",
      });
    }
  };

  return (
    <div className="flex">
      <div className="bg-[#F5EEDD] w-3xl px-7 rounded-2xl min-h-96 max-h-[480px] overflow-hidden border-b-8 border-[#F5EEDD]  ">
        {loading && <LoadingSpinner label="Loading Files" color="#06202B" />}
        <div className="sticky top-0 z-100 flex justify-center gap-3 align-center items-center">
          {" "}
          <FileTabs
            onTabChange={(tab) => setActiveTab(tab)}
            activeTab={activeTab}
          />
          {activeTab === "trash" && (
            <Button
              color="danger"
              isIconOnly
              onClick={() => handleEmptyTrash()}
            >
              <Trash2 />
            </Button>
          )}
        </div>

        {filterFiles && filterFiles.length > 0 ? (
          <div className="gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  max-h-full overflow-y-auto scrollbar-hide pb-20  ">
            {filterFiles.map((item) => (
              <FileCard
                key={item.id}
                item={item}
                handleOpen={() => handleOpen(item.fileUrl)}
                handleStar={() => handleStar(item.id)}
                handleTrash={() => handleTrash(item.id)}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex
           justify-center items-center h-full
           flex-col gap-2
           "
          >
            <FolderSearch size={100} color="#06202B" />

            <p className="text-[#06202B] text-xl font-semibold">
              No Files Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilesList;
