import { createOpenAI } from "@ai-sdk/openai";

export const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const groq = createOpenAI({
  name: "groq",
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY ?? "",
});

export function modelPicker(modelId?: string) {
  return groq(modelId ?? DEFAULT_MODEL);
}
