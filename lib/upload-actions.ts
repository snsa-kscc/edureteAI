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

function getBaseUrl() {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function uploadFileToR2(formData: FormData) {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    console.log("Base URL:", baseUrl);
    console.log("Vercel branch:", process.env.VERCEL_BRANCH_URL);
    const resizeResponse = await fetch(`${baseUrl}/api/resize`, {
      method: "POST",
      body: formData,
    });

    // Clone the response before reading
    const responseClone = resizeResponse.clone();

    let resizeData;
    try {
      resizeData = await resizeResponse.json();
    } catch (parseError) {
      const responseText = await responseClone.text();
      console.error("Response status:", resizeResponse.status);
      console.error("Response headers:", Object.fromEntries(resizeResponse.headers.entries()));
      console.error("Raw response content:", responseText);
      throw new Error(`Invalid response from server: ${responseText}`);
    }

    if (!resizeResponse.ok || !resizeData.success) {
      throw new Error(resizeData?.error || `Server error: ${resizeResponse.status}`);
    }

    return {
      success: true,
      filename: resizeData.filename,
      url: resizeData.url,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
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
