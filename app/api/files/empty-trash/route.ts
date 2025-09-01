import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

if (
  !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
  !process.env.IMAGEKIT_PRIVATE_KEY ||
  !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
) {
  throw new Error("ImageKit configuration is missing");
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Fetching file data
    const trashFiles = await db
      .select({ imagekitFileId: files.imagekitFileId })
      .from(files)
      .where(and(eq(files.isTrash, true), eq(files.userId, userId)));

    if (trashFiles.length === 0) {
      return NextResponse.json({ error: "Files not found" }, { status: 404 });
    }

    // Filter valid ImageKit file IDs
    const imagekitIds: string[] = trashFiles
      .map((m) => m.imagekitFileId)
      .filter((id): id is string => !!id);

    if (imagekitIds.length === 0) {
      return NextResponse.json(
        { error: "No valid ImageKit file IDs found" },
        { status: 400 }
      );
    }

    // Perform deletions in a transaction
    await db.transaction(async (tx) => {
      // Delete files from ImageKit
      await imagekit.bulkDeleteFiles(imagekitIds);
      // Delete files from database
      await tx
        .delete(files)
        .where(and(eq(files.isTrash, true), eq(files.userId, userId)));
    });

    return NextResponse.json(
      { message: "Files deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting files :`, error);
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 }
    );
  }
}
