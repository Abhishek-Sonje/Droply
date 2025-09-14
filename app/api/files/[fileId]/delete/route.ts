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

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Getting file id from params
    const fileId = (await props.params).fileId;
    if (!fileId) {
      return NextResponse.json({ error: "File id not found" }, { status: 400 });
    }

    //Fetching file data
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not Found" }, { status: 404 });
    }

    if (!file.imagekitFileId) {
      return NextResponse.json(
        { error: "ImageKit file ID not found" },
        { status: 400 }
      );
    }

    db.transaction(async (tx) => {
      //Deleting file from imagekit
      await imagekit.deleteFile(file.imagekitFileId ?? "");

      //Deleting file from DB
      await tx.delete(files).where(eq(files.id, fileId));
    });

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting file :`, error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
