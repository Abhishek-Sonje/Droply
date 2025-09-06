import { useQuery } from "@tanstack/react-query";

async function fetchFiles(filter: string) {
  const res = await fetch(`/api/files?filter=${filter}`);
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json();
}

export function useFiles(filter: string) {
  return useQuery({
    queryKey: ["files", filter],
    queryFn: () => fetchFiles(filter),
  });
}
