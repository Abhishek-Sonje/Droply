"use client";
import LoadingSpinner from "@/components/loading";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#EAE7DD] via-[#D9D4C7] to-[#F5F5F0]">
      <LoadingSpinner label="Loading..." color="#7AE2CF" />
    </div>
  );
}
