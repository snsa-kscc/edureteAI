"use server";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToR2(data: FormData | { base64Image: string; filename?: string; description?: string }) {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // Determine if we're dealing with FormData (user upload) or JSON (generated image)
    const isFormData = data instanceof FormData;
    
    const response = await fetch(`${baseUrl}/api/upload-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    return {
      success: true,
      filename: result.filename,
      url: result.url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
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
