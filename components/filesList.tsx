"use client";
import { addToast, Button, Input, Select, SelectItem, Tooltip, Breadcrumbs, BreadcrumbItem, useDisclosure } from "@heroui/react";
import axios from "axios";
import { File as FileType } from "@/lib/db/schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { FolderSearch, Trash2, Search, LayoutGrid, List as ListIcon, FolderPlus, ArrowLeft } from "lucide-react";
import FileCard from "./fileCard";
import FolderModal from "./FolderModal";

import LoadingSpinner from "./loading";

interface fileListProps {
  userId: string;
}

function FilesList({ userId }: fileListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentFolderId = searchParams.get("folder");
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam || "files";

  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Breadcrumb tracking (local state for display names)
  // When deeply linking, this might be empty, so we might need to fetch folder details.
  // For now, assume simplified breadcrumbs: Root > Current. 
  // TODO: Fetch full path from API.
  const [folderName, setFolderName] = useState("Root");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/files?userId=${userId}`;
      if (currentFolderId) {
        url += `&parentId=${currentFolderId}`;
      }
      
      const response = await axios.get(url);
      setFiles(response.data);
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
  }, [userId, currentFolderId]);

  // Fetch folder name if we are deep in a folder (rudimentary check)
  useEffect(() => {
     if (currentFolderId) {
         // Optionally fetch folder details to set name correctly
         // For now, we rely on the clicked item name if possible, or just "Folder"
         // If we refreshed, we might lose the name. 
         // Let's rely on finding the folder in the PREVIOUS file list? No.
         // Let's just keep it simple or user interactions will feel weird.
         // Ideally, the API response for files should include "parent folder metadata".
     } else {
         setFolderName("Root");
     }
  }, [currentFolderId]);

  useEffect(() => {
    fetchFiles();
  }, [userId, fetchFiles]); 

  // Handle Folder Navigation
  const handleFolderClick = (folder: FileType) => {
    if (!folder.isFolder) return;
    setFolderName(folder.name); // Optimistic update
    const params = new URLSearchParams(searchParams);
    params.set("folder", folder.id);
    router.push(`?${params.toString()}`);
    setSearchQuery(""); // Clear search on nav
  };

  const handleBack = () => {
    router.back();
  };

  const processedFiles = useMemo(() => {
    let filtered = [...files];

    // 1. Tab Filter
    switch (activeTab) {
      case "starred":
        filtered = filtered.filter((file) => file.isStarred && !file.isTrash);
        break;
      case "trash":
        filtered = filtered.filter((file) => file.isTrash);
        break;
      case "files":
      default:
        filtered = filtered.filter((file) => !file.isTrash);
        break;
    }

    // 2. Search Filter
    if (searchQuery) {
        filtered = filtered.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 3. Sort
    filtered.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1; // Folders always first
        if (!a.isFolder && b.isFolder) return 1;

        switch (sortOption) {
            case "name":
                return a.name.localeCompare(b.name);
            case "size":
                return b.size - a.size;
            case "date":
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    return filtered;
  }, [files, activeTab, searchQuery, sortOption]);

  const handleOpen = (file: FileType) => {
    if (file.isFolder) {
        handleFolderClick(file);
    } else {
        if (!file.fileUrl) return;
        window.open(file.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  // ... Existing Handlers ...
  const handleStar = async (fileId: string) => {
    if (!fileId) return;
    try {
      await axios.patch(`/api/files/${fileId}/star`);
      setFiles(files.map((file) => file.id === fileId ? { ...file, isStarred: !file.isStarred } : file));
      const file = files.find((file) => file.id === fileId);
      addToast({ title: "Success", description: `${file?.name} ${file?.isStarred ? "removed from" : "added to"} starred`, color: "success" });
    } catch (error) {
       addToast({ title: "Action Failed", description: "Could not update star status", color: "danger" });
    }
  };
  const handleTrash = async (fileId: string) => {
      if (!fileId) return;
      try {
        await axios.patch(`/api/files/${fileId}/trash`);
        setFiles(files.map((file) => file.id === fileId ? { ...file, isTrash: !file.isTrash } : file));
        addToast({ title: "Success", description: "File moved to trash", color: "success" });
      } catch (error) {
        addToast({ title: "Action Failed", description: "Could not trash file", color: "danger" });
      }
  };
  const handleEmptyTrash = async () => {
    try {
      await axios.delete(`/api/files/empty-trash`);
      setFiles(files.filter((file) => !file.isTrash));
      addToast({ title: "Empty Trash", description: "Trash is now empty", color: "success" });
    } catch (error) {
      addToast({ title: "Action Failed", description: "Could not empty trash", color: "danger" });
    }
  };
   const handleDelete = async (fileId: string) => {
    try {
      await axios.delete(`/api/files/${fileId}/delete`);
      setFiles(files.filter((file) => file.id !== fileId));
      addToast({ title: "Deleted File", description: "File deleted successfully", color: "success" });
    } catch (error) {
      addToast({ title: "Action Failed", description: "Could not delete file", color: "danger" });
    }
  };

  const getPageTitle = () => {
      if (activeTab === "starred") return "Starred";
      if (activeTab === "trash") return "Trash";
      return currentFolderId ? folderName : "My Files";
  }

  return (
    <div className="flex flex-col w-full h-full">
        {loading && <LoadingSpinner label="Loading Files" color="#38bdf8" />}
        
        {/* Header / Toolbar */}
        <div className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-md pb-4 flex flex-col gap-4">
             {/* Simplified Title & Actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    {currentFolderId && (
                         <Button isIconOnly variant="light" size="sm" onClick={() => router.back()} className="text-slate-400 -ml-2"><ArrowLeft size={24}/></Button>
                    )}
                    {getPageTitle()}
                </h2>

                <div className="flex gap-2">
                    <Tooltip content="New Folder"><Button isIconOnly size="sm" variant="flat" className="bg-slate-800 text-sky-500 hover:bg-slate-700" onClick={onOpen}><FolderPlus size={20} /></Button></Tooltip>
                    {activeTab === "trash" && (
                        <Button color="danger" isIconOnly size="sm" variant="flat" onClick={() => handleEmptyTrash()}><Trash2 size={20}/></Button>
                    )}
                </div>
            </div>

            {/* Search & Sort Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-2 flex-1 w-full">
                     <Input 
                        placeholder="Search..." 
                        classNames={{
                            base: "w-full", 
                            inputWrapper: "h-10 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200 group-data-[focus=true]:bg-slate-800"
                        }} 
                        startContent={<Search size={16} className="text-slate-500"/>} 
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        isClearable
                     />
                 </div>

                 <div className="flex items-center gap-2 w-full md:w-auto">
                     <Select 
                        selectionMode="single" 
                        defaultSelectedKeys={["date"]}
                        onChange={(e) => setSortOption(e.target.value)}
                        classNames={{
                            base: "w-32", 
                            trigger: "h-10 bg-slate-800 border-slate-700 text-slate-300",
                            popoverContent: "bg-slate-800 border-slate-700 text-slate-300"
                        }}
                        aria-label="Sort by"
                     >
                        <SelectItem key="date">Date</SelectItem>
                        <SelectItem key="name">Name</SelectItem>
                        <SelectItem key="size">Size</SelectItem>
                     </Select>
                     <div className="border border-slate-700 rounded-lg flex overflow-hidden">
                        <Button isIconOnly size="sm" radius="none" variant={viewMode==="grid"?"solid":"light"} className={`w-10 h-10 ${viewMode==="grid"? "bg-slate-700 text-sky-400" : "text-slate-500 hover:text-slate-200"}`} onClick={()=>setViewMode("grid")}><LayoutGrid size={18}/></Button>
                        <Button isIconOnly size="sm" radius="none" variant={viewMode==="list"?"solid":"light"} className={`w-10 h-10 ${viewMode==="list"? "bg-slate-700 text-sky-400" : "text-slate-500 hover:text-slate-200"}`} onClick={()=>setViewMode("list")}><ListIcon size={18}/></Button>
                     </div>
                 </div>
            </div>
        </div>

        {/* File Content */}
        <div className="flex-1 pb-20">
            {processedFiles && processedFiles.length > 0 ? (
                <div className={`gap-4 grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}>
                    {processedFiles.map((item) => (
                    <FileCard
                        key={item.id}
                        item={item}
                        handleOpen={() => handleOpen(item)}
                        handleStar={() => handleStar(item.id)}
                        handleTrash={() => handleTrash(item.id)}
                        handleDelete={()=>handleDelete(item.id)}
                    />
                    ))}
                </div>
            ) : (
            <div className="flex justify-center items-center h-64 flex-col gap-4 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                <div className="p-4 bg-slate-800 rounded-full">
                    <FolderSearch size={48} className="text-slate-600" />
                </div>
                <div className="text-center">
                    <p className="text-slate-400 font-medium">
                        {searchQuery ? `No results for "${searchQuery}"` : "This folder is empty"}
                    </p>
                    {activeTab === "files" && !currentFolderId && (
                        <p className="text-slate-600 text-sm mt-1">Upload files to get started</p>
                    )}
                </div>
            </div>
            )}
        </div>
      <FolderModal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        userId={userId} 
        parentId={currentFolderId} 
        onFolderCreated={fetchFiles}
      />
    </div>
  );
}

export default FilesList;
