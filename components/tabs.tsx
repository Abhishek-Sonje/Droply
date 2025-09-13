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
          // color={"primary"}
          size="md"
          classNames={{
            tabWrapper: "bg-slate-950",
            tabContent: "text-[#7AE2CF] font-semibold text-[15px] ",
            tabList: "bg-[#06202B]",
            // tab: "bg-[#7AE2CF ] text-[#7AE2CF]",
            cursor: "bg-[#7AE2CF]",
            panel: "text-[#7AE2CF]",
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
