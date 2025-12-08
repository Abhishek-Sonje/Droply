"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Tooltip, User } from "@heroui/react";
import { 
  LayoutGrid, 
  File, 
  Star, 
  Trash2, 
  Settings, 
  Cloud, 
  LogOut,
  Plus
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";

import UploadModal from "./UploadModal";
import { useState } from "react";
import { useRefresh } from "@/contexts/RefreshContext";

export default function Sidebar() {
      const pathname = usePathname();
    const tab = useSearchParams().get("tab") || "files";
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { triggerRefresh } = useRefresh();

  const menuItems = [
    { name: "My Files", icon: LayoutGrid, path: "/dashboard/files", tab:"files", id: "files" },
    { name: "Starred", icon: Star, path: "/dashboard/files?tab=starred",tab:"starred", id: "starred" }, 
    { name: "Trash", icon: Trash2, path: "/dashboard/files?tab=trash",tab:"trash", id: "trash" },
  ];

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  return (
    <div className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 transition-all duration-300 hidden md:flex">
      {/* Brand & Action */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
           <Cloud className="text-sky-500" size={32} />
           <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Droply</h1>
        </div>

        <Button 
            className="w-full bg-sky-600 text-white font-medium hover:bg-sky-500 shadow-md shadow-sky-900/20"
            startContent={<Plus size={20}/>}
            size="lg"
            radius="lg"
            onPress={() => setIsUploadOpen(true)}
        >
            New Upload
        </Button>
        <UploadModal 
            isOpen={isUploadOpen} 
            onOpenChange={setIsUploadOpen} 
            onUploadComplete={() => {
                // Trigger file list refresh
                triggerRefresh();
                setIsUploadOpen(false);
            }} 
        />

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">Storage</p>
            {menuItems.map((item) => (
                <Button
                    key={item.id}
                    variant={tab === item.tab ? "flat" : "light"}
                    className={`justify-start h-12 text-md gap-4 px-4 ${
                        tab === item.tab 
                        ? "bg-slate-800 text-sky-400 font-semibold" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                    onClick={() => router.push(item.path)}
                >
                    <item.icon size={20} />
                    {item.name}
                </Button>
            ))}
        </nav>
      </div>

      {/* Bottom Section: Profile */}
      <div className="flex flex-col gap-4">
         <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-medium">Storage</span>
                <span className="text-xs text-sky-400 font-bold">75%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 w-[75%]"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">7.5 GB of 10 GB used</p>
         </div>

         <div className="flex items-center justify-between pt-4 border-t border-slate-800">
             <div className="flex items-center gap-3 overflow-hidden">
                {/* <User 
                    name={user?.fullName}
                    description={user?.primaryEmailAddress?.emailAddress}
                    avatarProps={{ src: user?.imageUrl }}
                    classNames={{
                        name: "text-slate-200 font-medium",
                        description: "text-slate-500 text-xs truncate w-32"
                    }}
                /> */}
                {/* Temporarily simple user block to avoid complexity */}
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-500 font-bold">
                    {user?.firstName?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-200 truncate">{user?.firstName}</span>
                    <span className="text-xs text-slate-500 truncate w-24">Settings</span>
                </div>
             </div>
             <Tooltip content="Sign Out">
                <Button isIconOnly variant="light" size="sm" onClick={handleSignOut} className="text-slate-400 hover:text-red-400">
                    <LogOut size={18} />
                </Button>
             </Tooltip>
         </div>
      </div>
    </div>
  );
}
