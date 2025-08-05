import { tool } from "ai";
import { z } from "zod";
import { uploadGraphToR2 } from "@/lib/upload-graph";

export const generateGraphTool = tool({
  description: "Generate a mathematical graph using matplotlib. Call this when user asks for plotting functions, graphs, charts, or visualizations.",
  parameters: z.object({
    code: z.string().describe("Python matplotlib code to generate the graph. Should include proper imports and create a complete visualization."),
    description: z.string().describe("Brief description of what the graph shows or represents."),
  }),
  execute: async ({ code, description }) => {
    try {
      const response = await fetch(`/api/generate-graph`, {
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

      // Upload the generated image to R2 storage
      let r2Url = null;
      try {
        const uploadResult = await uploadGraphToR2(result.image, description);
        if (uploadResult.success) {
          r2Url = uploadResult.url;
        } else {
          console.warn("Failed to upload graph to R2:", uploadResult.error);
        }
      } catch (uploadError) {
        console.warn("Error uploading to R2:", uploadError);
      }

      return {
        success: true,
        image: result.image,
        r2Url,
        description,
        stdout: result.stdout,
        stderr: result.stderr,
      };
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
