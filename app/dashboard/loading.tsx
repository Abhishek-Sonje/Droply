"use client";

import { Skeleton } from "@heroui/react";
import React from "react";

export default function Loading() {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center w-full">
         <div className="flex gap-4 w-full">
             <Skeleton className="w-24 h-10 rounded-lg bg-slate-800" />
             <Skeleton className="w-24 h-10 rounded-lg bg-slate-800" />
         </div>
         <div className="flex gap-4">
             <Skeleton className="w-64 h-10 rounded-lg bg-slate-800 hidden md:block" />
             <Skeleton className="w-10 h-10 rounded-lg bg-slate-800" />
         </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
             <Skeleton className="w-full h-32 rounded-xl bg-slate-800" />
             <div className="flex justify-between items-center mt-2">
                 <Skeleton className="w-32 h-4 rounded-lg bg-slate-800" />
                 <Skeleton className="w-6 h-6 rounded-lg bg-slate-800" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
