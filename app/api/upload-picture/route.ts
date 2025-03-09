import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const cronToken = headersList.get("authorization");

  if (cronToken !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    let resizedBuffer;
    if (metadata.width && metadata.height && (metadata.width > 1500 || metadata.height > 1500)) {
      resizedBuffer = await image
        .resize(1500, 1500, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();
    }

    const uniqueFilename = `${uuidv4()}-${file.name}`;
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: uniqueFilename,
        Body: resizedBuffer || buffer,
        ContentType: file.type,
      },
    });

    await upload.done();

    return NextResponse.json({
      success: true,
      filename: uniqueFilename,
      url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${uniqueFilename}`,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ success: false, error: "Failed to process image" }, { status: 500 });
  }
}
