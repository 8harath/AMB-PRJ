"use server";

import { env } from "@/env";

export type ImageModelList =
  | "black-forest-labs/FLUX1.1-pro"
  | "black-forest-labs/FLUX.1-schnell"
  | "black-forest-labs/FLUX.1-schnell-Free"
  | "black-forest-labs/FLUX.1-pro"
  | "black-forest-labs/FLUX.1-dev";

export async function generateImageAction(
  prompt: string,
  model: ImageModelList = "black-forest-labs/FLUX.1-schnell-Free",
) {
  if (!env.TOGETHER_AI_API_KEY) {
    return {
      success: false,
      error: "TOGETHER_AI_API_KEY is not configured",
    };
  }

  if (!env.UPLOADTHING_TOKEN) {
    return {
      success: false,
      error: "UPLOADTHING_TOKEN is not configured",
    };
  }

  try {
    const { default: Together } = await import("together-ai");
    const together = new Together({ apiKey: env.TOGETHER_AI_API_KEY });

    const response = (await together.images.create({
      model: model,
      prompt: prompt,
      width: 1024,
      height: 768,
      steps: model.includes("schnell") ? 4 : 28,
      n: 1,
    })) as unknown as {
      id: string;
      model: string;
      object: string;
      data: { url: string }[];
    };

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // Return the Together AI URL directly (no DB storage, no UploadThing)
    return {
      success: true,
      image: { id: `img-${Date.now()}`, url: imageUrl, prompt },
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}
