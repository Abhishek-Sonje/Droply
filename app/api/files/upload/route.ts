import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const { userId } = await auth();
    console.log("[API] Authenticated userId:", userId);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: No user ID" },
        { status: 401 }
      );
    }

    // Step 2: Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const formUserId = formData.get("userId") as string | null;
    const parentId = (formData.get("parentId") as string) || null;

    console.log("[API] FormData:", {
      formUserId,
      parentId,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
    });

    if (!formUserId || formUserId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid user ID" },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Step 3: Validate parent folder (if provided)
    if (parentId) {
      console.log("[API] Checking parent folder:", parentId);
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true)
          )
        );
      console.log("[API] Parent folder result:", parentFolder);
      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 }
        );
      }
    }

    // Step 4: Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and images (jpg, png, gif, webp) are supported" },
        { status: 400 }
      );
    }

    const originalFileName = file.name;
    const fileExtension =
      originalFileName.split(".").pop()?.toLowerCase() || "";
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "webp"];
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Only PDF and images (jpg, png, gif, webp) are supported" },
        { status: 400 }
      );
    }

    // Step 5: Prepare file for upload
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const folderPath = parentId
      ? `droply/${userId}/folder/${parentId}`
      : `droply/${userId}`;
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    console.log("[API] Uploading to ImageKit:", {
      fileName: uniqueFileName,
      folder: folderPath,
    });

    // Step 6: Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFileName,
      folder: folderPath,
      useUniqueFileName: false,
    });
    console.log("[API] ImageKit response:", {
      fileId: uploadResponse.fileId,
      url: uploadResponse.url,
      filePath: uploadResponse.filePath,
      thumbnailUrl: uploadResponse.thumbnailUrl,
    });

    // Step 7: Save to database
    const fileData = {
      name: originalFileName,
      path: uploadResponse.filePath,
      type: file.type,
      size: file.size,
      fileUrl: uploadResponse.url,
      imagekitFileId: uploadResponse.fileId,
      thumbnailUrl: uploadResponse.thumbnailUrl || null,
      userId: userId,
      parentId: parentId,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };
    console.log("[API] Saving to database:", fileData);
    const [newFile] = await db.insert(files).values(fileData).returning();
    console.log("[API] Database insert result:", newFile);

    return NextResponse.json(newFile, { status: 201 });
  } catch (error: any) {
    console.error("[API] Upload error:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
