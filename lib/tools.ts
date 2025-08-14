import { tool } from "ai";
import { z } from "zod";
import { uploadFileToR2 } from "@/lib/upload-actions";

export const generateGraphTool = tool({
  description: "Generate a mathematical graph using matplotlib. Call this when user asks for plotting functions, graphs, charts, or visualizations.",
  inputSchema: z.object({
    code: z.string().describe("Python matplotlib code to generate the graph. Should include proper imports and create a complete visualization."),
    description: z.string().describe("Brief description of what the graph shows or represents."),
  }),
  execute: async ({ code, description }) => {
    try {
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/generate-graph`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error,
          description,
        };
      }

      // Upload the generated image to R2 storage using existing robust infrastructure
      let r2Url = null;
      try {
        const uploadResult = await uploadFileToR2({
          base64Image: result.image,
          filename: `graph-${Date.now()}.png`,
          description: description,
        });

        if (uploadResult.success) {
          r2Url = uploadResult.url;
        } else {
          console.warn("Failed to upload graph to R2:", uploadResult.error);
        }
      } catch (uploadError) {
        console.warn("Error uploading to R2:", uploadError);
      }

      // Only return R2 URL if upload was successful, otherwise fallback to base64
      if (r2Url) {
        return {
          success: true,
          imageUrl: r2Url,
          description,
          stdout: result.stdout,
          stderr: result.stderr,
        };
      } else {
        // Fallback to base64 if R2 upload failed
        return {
          success: true,
          image: result.image,
          description,
          stdout: result.stdout,
          stderr: result.stderr,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to execute Python code: ${error.message}`,
        description,
      };
    }
  },
});

export const tools = {
  generateGraph: generateGraphTool,
};
