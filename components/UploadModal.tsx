"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import FileUploader from "./fileUploader";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface UploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUploadComplete?: () => void;
}

export default function UploadModal({ isOpen, onOpenChange, onUploadComplete }: UploadModalProps) {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folder");
  const { user } = useUser();

  if (!user) return null;

  return (
    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        size="2xl"
        classNames={{
            base: "bg-slate-900 border border-slate-700",
            header: "border-b border-slate-800 text-slate-100",
            closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Upload Files
            </ModalHeader>
            <ModalBody className="pb-6">
                <FileUploader 
                    userId={user.id} 
                    parentId={folderId} 
                    onUploadComplete={() => {
                        onUploadComplete?.();
                        onClose();
                    }}
                />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
