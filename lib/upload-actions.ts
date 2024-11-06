"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToR2(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.type.startsWith("image/") || !["image/jpeg", "image/png"].includes(file.type)) {
      throw new Error("Only JPG and PNG files are allowed");
    }

    let buffer = Buffer.from(await file.arrayBuffer());

    // Process image with Sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (metadata.width && metadata.height && (metadata.width > 700 || metadata.height > 700)) {
      const resizedBuffer = await image
        .resize(700, 700, {
          fit: "inside", // Maintains aspect ratio
          withoutEnlargement: true, // Don't enlarge if smaller than 700px
        })
        .toBuffer();

      buffer = resizedBuffer;
    }

    const uniqueFilename = `${uuidv4()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: file.type,
    });

    await S3.send(command);

    return {
      success: true,
      filename: uniqueFilename,
      url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${uniqueFilename}`,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: "Failed to upload file",
    };
  }
}
