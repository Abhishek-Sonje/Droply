import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
} from "@heroui/react";
import axios from "axios";

interface FolderModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId: string;
  parentId: string | null;
  onFolderCreated: () => void;
}

export default function FolderModal({
  isOpen,
  onOpenChange,
  userId,
  parentId,
  onFolderCreated,
}: FolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (onClose: () => void) => {
    if (!folderName.trim()) return;

    setLoading(true);
    try {
      await axios.post("/api/files/create-folder", {
        name: folderName,
        userId,
        parentId,
      });

      addToast({
        title: "Success",
        description: "Folder created successfully",
        color: "success",
      });
      setFolderName("");
      onFolderCreated();
      onClose();
    } catch (error) {
      console.error("Error creating folder:", error);
      addToast({
        title: "Error",
        description: "Failed to create folder",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        placement="center"
        backdrop="blur"
        classNames={{
            base: "bg-slate-900 border border-slate-700",
            header: "border-b border-slate-800",
            footer: "border-t border-slate-800",
            closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
    >
      <ModalContent className="text-slate-200">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-slate-100">
              Create New Folder
            </ModalHeader>
            <ModalBody className="py-4">
              <Input
                autoFocus
                label="Folder Name"
                placeholder="Enter folder name"
                variant="bordered"
                classNames={{
                    inputWrapper: "border-slate-700 hover:border-sky-500 focus-within:border-sky-500 bg-slate-800",
                    label: "text-slate-400",
                    input: "text-slate-200"
                }}
                value={folderName}
                onValueChange={setFolderName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate(onClose);
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-sky-600 text-white shadow-lg shadow-sky-900/20"
                onPress={() => handleCreate(onClose)}
                isLoading={loading}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
