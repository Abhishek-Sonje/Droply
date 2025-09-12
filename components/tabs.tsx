"use client";
import { Tab, Tabs } from "@heroui/react";
 

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
          color={"primary"}
          size="md"
          classNames={{
            tabWrapper: "bg-slate-950",
            tabContent: "text-[#ffffff] font-semibold text-[15px] ",
            // base: "bg-[#4B5563]",
            tabList:"bg-[#4B5563]",
          }}
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
