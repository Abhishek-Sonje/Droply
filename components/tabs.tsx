"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";

interface FileTabsProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}
function FileTabs({ onTabChange, activeTab }: FileTabsProps) {
  return (
    <div className="flex justify-center">
      <div className="my-4 gap-2 w-md">
        <Tabs
          aria-label="File Options"
          selectedKey={activeTab}
          radius="full"
          fullWidth
          variant="solid"
          color="primary"
          size="md"
          onSelectionChange={(key) => onTabChange(key as string)}
        >
          <Tab key="files" title="Files" />
          <Tab key="starred" title="Starred" />
          <Tab key="trash" title="Trash" />
        </Tabs>
      </div>
    </div>
  );
}

export default FileTabs;
