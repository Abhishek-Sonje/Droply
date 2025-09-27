"use client";
import LoadingSpinner from "@/components/loading";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#06202B]">
      <LoadingSpinner label="Loading..." color="#7AE2CF" />
    </div>
  );
}
