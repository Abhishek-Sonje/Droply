import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardBody,
  CardFooter,
  Button,
  Image,
  Divider,
  addToast,
} from "@heroui/react";
import { Star, Download, Trash, Info, ArchiveRestore, Folder, Files, File as FileIcon } from "lucide-react";
import { useState, useCallback } from "react";
import { File } from "@/lib/db/schema";
import axios from "axios";

interface FileCardProps {
  item: File;
  handleOpen: () => void;
  handleStar: () => void;
  handleTrash: () => void;
  handleDelete: () => void;
  viewMode?: "grid" | "list";
}

// Custom debounce function
const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) => {
  let timeout: number | NodeJS.Timeout | null = null;
  return (...args: unknown[]) => {
    clearTimeout(timeout as number);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Individual card component with popover on info icon
const FileCard = ({
  item,
  handleOpen,
  handleStar,
  handleTrash,
  handleDelete,
  viewMode = "grid",
}: FileCardProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Debounce hover handlers
  const debouncedOpen = useCallback(() => {
    const debounce = <T extends (...args: unknown[]) => unknown>(
      func: T,
      wait: number
    ) => {
      let timeout: number | NodeJS.Timeout | null = null;
      return (...args: unknown[]) => {
        clearTimeout(timeout as number);
        timeout = setTimeout(() => func(...args), wait);
      };
    };
    return debounce(() => setIsPopoverOpen(true), 100);
  }, []);

  const debouncedClose = useCallback(() => {
    const debounce = <T extends (...args: unknown[]) => unknown>(
      func: T,
      wait: number
    ) => {
      let timeout: number | NodeJS.Timeout | null = null;
      return (...args: unknown[]) => {
        clearTimeout(timeout as number);
        timeout = setTimeout(() => func(...args), wait);
      };
    };
    return debounce(() => setIsPopoverOpen(false), 100);
  }, []);

  const handleDownload = async (fileUrl: string, fileName: string) => {
    if (!fileUrl || !fileName) {
      console.error("Invalid file URL or name:", { fileUrl, fileName });
      return;
    }

    try {
      // Fetch the file to handle CORS and ensure accessibility
      const response = await fetch(fileUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Convert response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Use download attribute for cleaner syntax
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Free memory
    } catch (error) {
      console.error("Download failed:", error);
      // Optional: Show user feedback (e.g., toast notification)

      addToast({
        title: "Download failed",
        description: "An error occurred while downloading files.",
        color: "danger",
      });
    }
  };

  // List view rendering
  if (viewMode === "list") {
    return (
      <div className="w-full bg-slate-800 border border-slate-700 hover:border-sky-500/50 transition-all duration-200 group rounded-lg overflow-hidden">
        <div className="flex items-center gap-4 p-3">
          {/* Thumbnail */}
          <div 
            className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-slate-900 cursor-pointer"
            onClick={handleOpen}
          >
            {item.isFolder ? (
              <div className="w-full h-full flex items-center justify-center text-sky-500">
                <Folder size={24} fill="currentColor" />
              </div>
            ) : (
              <Image
                alt={item.name}
                className="w-full h-full object-cover"
                radius="none"
                src={item.type.startsWith("image/") ? item.fileUrl : "/pdf.png"}
                loading="lazy"
              />
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={handleOpen}>
            <div className="flex items-center gap-2">
              {item.isFolder ? (
                <Folder size={14} className="text-sky-500 flex-shrink-0" fill="currentColor"/>
              ) : (
                <FileIcon size={14} className="text-sky-500 flex-shrink-0" fill="currentColor"/>
              )}
              <p className="text-sm font-medium text-slate-200 truncate" title={item.name}>
                {item.name}
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {(item.size / 1024 / 1024).toFixed(2)} MB • {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {!item.isTrash ? (
              <>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className={`hover:bg-slate-700 ${item.isStarred ? "text-yellow-400" : "text-slate-400 hover:text-yellow-400"}`}
                  onClick={handleStar}
                >
                  <Star size={16} fill={item.isStarred ? "currentColor" : "none"} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-slate-400 hover:text-sky-400 hover:bg-slate-700"
                  onClick={() => handleDownload(item.fileUrl, item.name)}
                >
                  <Download size={16} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                  onClick={handleTrash}
                >
                  <Trash size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-slate-400 hover:text-green-400 hover:bg-slate-700"
                  onClick={handleTrash}
                >
                  <ArchiveRestore size={16} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                  onClick={handleDelete}
                >
                  <Trash size={16} />
                </Button>
              </>
            )}

            {/* Info Popover */}
            <Popover
              isOpen={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              placement="left"
              showArrow
              classNames={{
                content: "bg-slate-800 border-slate-700 text-slate-300"
              }}
            >
              <PopoverTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onMouseEnter={debouncedOpen}
                  onMouseLeave={debouncedClose}
                  className="text-slate-500 hover:text-sky-400 hover:bg-slate-700"
                >
                  <Info size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-slate-100 truncate">{item.name}</p>
                  <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-400">
                    <span>Size:</span> <span className="text-slate-300 text-right">{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>Type:</span> <span className="text-slate-300 text-right truncate">{item.type}</span>
                    <span>Created:</span> <span className="text-slate-300 text-right">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    );
  }

  // Grid view rendering (default)
  return (
    <Card
      shadow="sm"
      className="w-full bg-slate-800 border border-slate-700 hover:border-sky-500/50 transition-all duration-200 group relative"
    >
      <CardBody
        className="p-0 overflow-hidden bg-slate-900 relative aspect-[4/3]"
        onClick={handleOpen}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {item.isFolder ? (
           <div className="w-full h-full flex items-center justify-center bg-slate-800/50 group-hover:bg-slate-800 transition-colors cursor-pointer text-sky-500">
              <Folder size={64} fill="currentColor" className="opacity-80 group-hover:opacity-100" />
           </div>
        ) : (
          <Image
            alt={item.name}
            className="w-full h-full object-cover"
            radius="none"
            src={item.type.startsWith("image/") ? item.fileUrl : "/pdf.png"}
            loading="lazy"
          />
        )}
      </CardBody>
      
      <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
             {item.isFolder ? (
                <Folder size={16} className="text-sky-500 flex-shrink-0"  /> 
             ) : (
                // <div className="w-4 h-4 rounded bg-slate-700 flex-shrink-0" /> // Placeholder for file type icon
                <FileIcon size={16} className="text-sky-500 flex-shrink-0"  /> 
             )}
             <p className="text-sm font-medium text-slate-200 truncate flex-1" title={item.name}>
                {item.name}
             </p>
          </div>

          <Divider className="bg-slate-700/50 my-2" />

          <CardFooter className="p-0 flex justify-between gap-1">
            {!item.isTrash ? (
              <>
                 <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className={`hover:bg-slate-700 ${item.isStarred ? "text-yellow-400" : "text-slate-400 hover:text-yellow-400"}`}
                    onClick={handleStar}
                >
                    <Star size={18} fill={item.isStarred ? "currentColor" : "none"} />
                </Button>
                <div className="flex gap-1">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-slate-400 hover:text-sky-400 hover:bg-slate-700"
                        onClick={() => handleDownload(item.fileUrl, item.name)}
                    >
                        <Download size={18} />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                        onClick={handleTrash}
                    >
                        <Trash size={18} />
                    </Button>
                </div>
              </>
            ) : (
                <div className="flex w-full justify-end gap-2">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-slate-400 hover:text-green-400 hover:bg-slate-700"
                        // Restore functionality not implemented yet, using trash for now implies restore context usually or just restore button needed
                        onClick={handleTrash} 
                    >
                        <ArchiveRestore size={18} />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                        onClick={handleDelete}
                    >
                        <Trash size={18} />
                    </Button>
                </div>
            )}

            {/* Popover triggered by Info icon - simplified for new design */}
            <Popover
              isOpen={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              placement="top"
              showArrow
              classNames={{
                content: "bg-slate-800 border-slate-700 text-slate-300"
              }}
            >
              <PopoverTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onMouseEnter={debouncedOpen}
                  onMouseLeave={debouncedClose}
                  className="text-slate-500 hover:text-sky-400 hover:bg-slate-700"
                >
                  <Info size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-slate-100 truncate">{item.name}</p>
                  <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-400">
                      <span>Size:</span> <span className="text-slate-300 text-right">{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>Type:</span> <span className="text-slate-300 text-right truncate">{item.type}</span>
                      <span>Created:</span> <span className="text-slate-300 text-right">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardFooter>
      </div>
    </Card>
  );
};

export default FileCard;
