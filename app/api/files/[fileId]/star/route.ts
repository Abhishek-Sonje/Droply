import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileId = (await props.params).fileId;
    if (!fileId) {
      return NextResponse.json({ error: "File id not found" }, { status: 400 });
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const selectedFile = await db
      .update(files)
      .set({ isStarred: !file.isStarred })
      .where(and(eq(files.userId, userId), eq(files.id, fileId)))
      .returning();

    console.log(selectedFile[0]);

    return NextResponse.json({ success: true, file: selectedFile[0] });
  } catch (e) {
    return NextResponse.json(
      { error: "File update unsuccessful" },
      { status: 500 }
    );
  }
}
