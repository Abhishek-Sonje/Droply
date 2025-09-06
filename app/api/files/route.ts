import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorize" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    // const queryUserId = searchParams.get("userId");
    const parentId = searchParams.get("parentId");

    const filter = searchParams.get("filter") || "files";

    // if (!queryUserId || queryUserId !== userId) {
    //   return NextResponse.json({ error: "Unauthorize" }, { status: 401 });
    // }

    const condition = [eq(files.userId, userId)];

    if (parentId) {
      condition.push(eq(files.parentId, parentId));
    } else {
      condition.push(isNull(files.parentId));
    }

    // Filter condition
    if (filter === "starred") {
      condition.push(eq(files.isStarred, true));
    } else if (filter === "trash") {
      condition.push(eq(files.isTrash, true));
    } else {
      // default: normal files, exclude trash
      condition.push(eq(files.isTrash, false));
    }

    const userFiles = await db
      .select()
      .from(files)
      .where(and(...condition ));

    return NextResponse.json(userFiles);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching files !" },
      { status: 401 }
    );
  }
}
