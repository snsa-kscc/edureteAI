import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadGraphToR2(base64Image: string, description?: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Convert base64 to buffer
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uniqueFilename = `graphs/graph-${timestamp}-${uuidv4()}.png`;
    
    // Upload to R2
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: uniqueFilename,
        Body: buffer,
        ContentType: 'image/png',
        Metadata: {
          description: description || 'Generated matplotlib graph',
          generatedAt: new Date().toISOString(),
        },
      },
    });

    await upload.done();

    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${uniqueFilename}`;
    
    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error('Error uploading graph to R2:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload graph to R2',
    };
  }
}
