"use server";

import { z } from "zod";

const themeSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  themeData: z.any(),
  logoUrl: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
});

export type ThemeFormData = z.infer<typeof themeSchema>;

// Theme persistence is not available without a database.
// Custom themes are applied in-memory via Zustand state.

export async function createCustomTheme(formData: ThemeFormData) {
  return {
    success: true,
    themeId: `theme-${Date.now()}`,
    message: "Theme created (in-memory only)",
  };
}

export async function updateCustomTheme(themeId: string, formData: ThemeFormData) {
  return { success: true, message: "Theme updated (in-memory only)" };
}

export async function deleteCustomTheme(themeId: string) {
  return { success: true, message: "Theme deleted" };
}

export async function getUserCustomThemes() {
  return { success: true, themes: [] };
}

export async function getPublicCustomThemes() {
  return { success: true, themes: [] };
}

export async function getCustomThemeById(themeId: string) {
  return { success: false, message: "Custom themes require a database" };
}
