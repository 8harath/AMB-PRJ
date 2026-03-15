"use client";

import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { PresentationControls } from "./PresentationControls";
import { PresentationExamples } from "./PresentationExamples";
import { PresentationHeader } from "./PresentationHeader";
import { PresentationInput } from "./PresentationInput";

export function PresentationDashboard({
  sidebarSide,
}: {
  sidebarSide?: "left" | "right";
}) {
  const router = useRouter();
  const {
    presentationInput,
    isGeneratingOutline,
    setCurrentPresentation,
    setIsGeneratingOutline,
    language,
    theme,
    setShouldStartOutlineGeneration,
  } = usePresentationState();

  useEffect(() => {
    setCurrentPresentation("", "");
    // Make sure to reset any generation flags when landing on dashboard
    setIsGeneratingOutline(false);
    setShouldStartOutlineGeneration(false);
  }, []);

  const handleGenerate = async () => {
    if (!presentationInput.trim()) {
      toast.error("Please enter a topic for your presentation");
      return;
    }

    // Set UI loading state
    setIsGeneratingOutline(true);

    try {
      const tempId = `session-${Date.now()}`;
      const tempTitle = presentationInput.substring(0, 50) || "Untitled Presentation";
      setCurrentPresentation(tempId, tempTitle);
      router.push(`/presentation/generate/${tempId}`);
    } catch (error) {
      setIsGeneratingOutline(false);
      console.error("Error starting presentation:", error);
      toast.error("Failed to start presentation generation");
    }
  };

  return (
    <div className="notebook-section relative h-full w-full">
      <div className="mx-auto max-w-4xl space-y-12 px-6 py-12">
        <PresentationHeader />

        <div className="space-y-8">
          <PresentationInput handleGenerate={handleGenerate} />
          <PresentationControls />

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerate}
                disabled={!presentationInput.trim() || isGeneratingOutline}
                variant={isGeneratingOutline ? "loading" : "default"}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Generate Presentation
              </Button>
            </div>
          </div>
        </div>

        <PresentationExamples />
      </div>
    </div>
  );
}
