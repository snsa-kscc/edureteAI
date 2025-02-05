import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/") || !["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json({ error: "Only JPG and PNG files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();

    let resizedBuffer = buffer;
    if (metadata.width && metadata.height && (metadata.width > 1500 || metadata.height > 1500)) {
      resizedBuffer = await image
        .resize(1500, 1500, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();
    }

    // Convert the buffer to base64 for safe transmission
    const base64Data = resizedBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      data: base64Data,
      contentType: file.type,
    });
  } catch (error) {
    console.error("Error resizing image:", error);
    return NextResponse.json({ success: false, error: "Failed to resize image" }, { status: 500 });
  }
}
