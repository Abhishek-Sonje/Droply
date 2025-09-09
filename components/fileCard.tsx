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
import { Star, Download, Trash, Info } from "lucide-react";
import { useState, useCallback } from "react";
import { File } from "@/lib/db/schema";
import axios from "axios";

interface FileCardProps {
  item: File;
  handleOpen: () => void;
    handleStar: () => void;
    handleTrash: () => void;
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
const FileCard = ({ item, handleOpen, handleStar ,handleTrash }: FileCardProps) => {
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

  return (
    <Card shadow="sm" className="p-1 w-full bg-white min-h-[200px]">
      <CardBody className="p-0 flex justify-center" onClick={handleOpen}>
        <Image
          alt={item.name}
          className="w-full object-cover hover:cursor-pointer"
          radius="lg"
          shadow="sm"
          src={item.type.startsWith("image/") ? item.fileUrl : "/pdf.png"}
          isZoomed // Optional zoom effect; remove if not needed
          loading="lazy" // Lazy load images
        />
      </CardBody>
      <b className="text-default-800 pt-2 px-2">
        {item.name.split(".")[0].length > 20
          ? item.name.split(".")[0].slice(0, 10) + "..."
          : item.name.split(".")[0]}
      </b>
      <Divider />
      <CardFooter className="flex justify-evenly">
        <Button
          isIconOnly
          size="sm"
          className="bg-slate-950 text-white"
          onClick={handleStar}
        >
          {item.isStarred ? (
            <Star size={19} color="orange" fill="gold" className="" />
          ) : (
            <Star size={19} />
          )}
        </Button>
        <Button
          className="bg-slate-950 text-white"
          isIconOnly
          size="sm"
          onClick={() => handleDownload(item.fileUrl, item.name)}
        >
          <Download size={19} />
        </Button>
        <Button isIconOnly size="sm" onClick={handleTrash} className="bg-slate-950 text-white">
          <Trash size={19} />
        </Button>
        {/* Popover triggered by Info icon */}
        <Popover
          key={item.id}
          isOpen={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          placement="right"
          motionProps={{
            variants: {
              enter: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
              exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
            },
          }}
        >
          <PopoverTrigger>
            <Button
              isIconOnly
              size="sm"
              onMouseEnter={debouncedOpen}
              onMouseLeave={debouncedClose}
              className="bg-slate-950 text-white"
            >
              <Info size={19} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            onMouseEnter={debouncedOpen}
            onMouseLeave={debouncedClose}
          >
            <div className="px-1 py-2">
              <div className="text-small font-bold">{item.name}</div>
              <div className="text-tiny">
                <ul>
                  <li className="text-tiny">Size: {item.size / 1000000} MB</li>
                  <li className="text-tiny">File Type: {item.type}</li>
                  <li className="text-tiny">
                    Uploaded: {new Date(item.createdAt).toDateString()}
                  </li>
                  <li className="text-tiny">
                    Modified: {new Date(item.updatedAt).toDateString()}
                  </li>
                </ul>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
