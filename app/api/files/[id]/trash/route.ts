import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get current file to toggle trash status
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, id), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Toggle trash status
    const [updatedFile] = await db
      .update(files)
      .set({ isTrash: !file.isTrash, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error("Error toggling trash:", error);
    return NextResponse.json(
      { error: "Failed to toggle trash" },
      { status: 500 }
    );
  }
}
