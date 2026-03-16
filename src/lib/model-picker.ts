import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { type LanguageModelV1 } from "ai";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-pro";

export function modelPicker(modelId?: string): LanguageModelV1 {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY ?? "",
  });
  return google(modelId ?? DEFAULT_GEMINI_MODEL) as unknown as LanguageModelV1;
}
