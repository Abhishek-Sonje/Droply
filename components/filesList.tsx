"use client";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
} from "@heroui/react";
import axios from "axios";
import { File as FileType } from "@/lib/db/schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import FileTabs from "./tabs";
import {
  Download,
  File,
  FolderSearch,
  Star,
  Trash,
  Trash2,
} from "lucide-react";
import FileCard from "./fileCard";
import Link from "next/link";

interface fileListProps {
  userId: string;
  refreshTrigger?: number;
}
function FilesList({ userId, refreshTrigger = 0 }: fileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

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
      <div className="bg-blue-950 w-3xl px-7 rounded-2xl min-h-96 max-h-[480px] overflow-y-auto scrollbar-hide ">
        <div className="sticky top-0 z-100 bg-blue-950 flex justify-center gap-3 align-center items-center">
          {" "}
          <FileTabs
            onTabChange={(tab) => setActiveTab(tab)}
            activeTab={activeTab}
          />
          {activeTab === "trash" && (
            <Button color="danger" isIconOnly onClick={() => handleEmptyTrash()}>
              <Trash2 />
            </Button>
          )}
        </div>

        {filterFiles && filterFiles.length > 0 ? (
          <ScrollShadow hideScrollBar>
            <div className="gap-2 grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4  ">
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
          </ScrollShadow>
        ) : (
          <div className="flex justify-center items-center h-full">
            <FolderSearch size={100} color="white" />
          </div>
        )}
      </div>
    </div>
  );
}

export default FilesList;
