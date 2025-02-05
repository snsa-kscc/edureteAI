"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function uploadFileToR2(formData: FormData) {
  try {
    const resizeUrl = new URL("/api/resize", getBaseUrl());
    const resizeResponse = await fetch(resizeUrl, {
      method: "POST",
      body: formData,
    });

    const resizeData = await resizeResponse.json();

    if (!resizeResponse.ok || !resizeData.success) {
      throw new Error(resizeData.error || "Failed to resize image");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const fullBase64Data = resizeData.data.join("");
    // Convert base64 back to buffer for upload
    const buffer = Buffer.from(fullBase64Data, "base64");
    const uniqueFilename = `${uuidv4()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: resizeData.contentType,
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

export async function deleteFileFromR2(fileUrl: string) {
  try {
    const filename = fileUrl.split("/").pop();

    if (!filename) {
      throw new Error("Invalid file URL");
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: filename,
    });

    await S3.send(command);

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      error: "Failed to delete file",
    };
  }
}
