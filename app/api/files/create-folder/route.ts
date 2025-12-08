import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
        return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const [newFolder] = await db
      .insert(files)
      .values({
        name: name,
        type: "folder",
        size: 0,
        fileUrl: "/folder-icon.png", // Placeholder, logic should handle this
        path: parentId ? "" : "/", // Simplified path logic for now
        userId: userId,
        parentId: parentId || null,
        isFolder: true,
        isStarred: false,
        isTrash: false,
      })
      .returning();

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Error creating folder" },
      { status: 500 }
    );
  }
}
