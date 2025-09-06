"use client"
import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";

function FileTabs({ onChange }: { onChange: (tab: string) => void }) {
  const [selected, setSelected] = useState("files");

  return (
    <div className="flex flex-wrap gap-4">
      <Tabs
        aria-label="File Options"
        selectedKey={selected}
        onSelectionChange={(key) => {
          setSelected(key as string);
          onChange(key as string);
        }}
      >
        <Tab key="files" title="Files" />
        <Tab key="starred" title="Starred" />
        <Tab key="trash" title="Trash" />
      </Tabs>
    </div>
  );
}

export default FileTabs;
