"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";

interface FileTabsProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}
function FileTabs({ onTabChange, activeTab }: FileTabsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Tabs
        aria-label="File Options"
        selectedKey={activeTab}
        onSelectionChange={(key) => onTabChange(key as string)}
      >
        <Tab key="files" title="Files" />
        <Tab key="starred" title="Starred" />
        <Tab key="trash" title="Trash" />
      </Tabs>
    </div>
  );
}

export default FileTabs;
