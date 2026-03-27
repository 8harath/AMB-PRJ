"use server";

// PPT export is handled client-side via convertPlateJSToPPTX in ExportButton.tsx.
// This server action is kept as a placeholder for future server-side export features (e.g. PDF).

export async function exportPresentation(
  _presentationId: string,
  _fileName?: string,
  _theme?: Partial<{
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    heading: string;
    muted: string;
  }>,
) {
  return {
    success: false,
    error: "Server-side export is not implemented. Use the client-side Export button instead.",
  };
}
