"use client";

import { ThinkingDisplay } from "@/components/presentation/dashboard/ThinkingDisplay";
import { Header } from "@/components/presentation/outline/Header";
import { OutlineList } from "@/components/presentation/outline/OutlineList";
import { PromptInput } from "@/components/presentation/outline/PromptInput";
import { ToolCallDisplay } from "@/components/presentation/outline/ToolCallDisplay";
import { ThemeBackground } from "@/components/presentation/theme/ThemeBackground";
import { ThemeSettings } from "@/components/presentation/theme/ThemeSettings";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  themes,
  type Themes,
} from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { ArrowLeft, Wand2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const PRESENTATION_GENERATION_COOKIE = "presentation_generation_pending";

function normalizeOutline(outline: unknown): string[] {
  if (!Array.isArray(outline)) {
    return [];
  }

  return outline.filter((item): item is string => typeof item === "string");
}

export default function PresentationGenerateWithIdPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const {
    currentPresentationId,
    currentPresentationTitle,
    presentationInput,
    outline,
    setCurrentPresentation,
    setPresentationInput,
    startPresentationGeneration,
    isGeneratingPresentation,
    isGeneratingOutline,
    outlineThinking,
    setOutline,
    setSearchResults,
    setShouldStartOutlineGeneration,
    setTheme,
    setImageSource,
    setPresentationStyle,
    setLanguage,
    setWebSearchEnabled,
  } = usePresentationState();

  // Track if this is a fresh navigation or a revisit
  const initialLoadComplete = useRef(false);
  const generationStarted = useRef(false);
  const syncComplete = useRef(false);

  // Function to clear the cookie
  const clearPresentationCookie = () => {
    if (typeof document === "undefined") return;

    const domain =
      window.location.hostname === "localhost" ? "localhost" : ".allweone.com";

    document.cookie = `${PRESENTATION_GENERATION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${domain !== "localhost" ? `domain=${domain}; ` : ""}`;
  };

  // Clear the cookie when the page loads
  useEffect(() => {
    clearPresentationCookie();
  }, []);

  // This effect handles the immediate startup of generation upon first mount
  // only if we're coming fresh from the dashboard (isGeneratingOutline === true)
  useEffect(() => {
    // Only run once on initial page load
    if (initialLoadComplete.current) return;
    initialLoadComplete.current = true;

    // If isGeneratingOutline is true but generation hasn't been started yet,
    // this indicates we just came from the dashboard and should start generation
    if (isGeneratingOutline && !generationStarted.current) {
      console.log("Starting outline generation after navigation");
      generationStarted.current = true;

      // Give the component time to fully mount and establish connections
      // before starting the generation process
      setTimeout(() => {
        setShouldStartOutlineGeneration(true);
      }, 100);
    }
  }, [isGeneratingOutline, setShouldStartOutlineGeneration]);

  // Sync state once on mount — normalizeOutline creates new arrays so this
  // must NOT re-run when outline/state changes or it infinite-loops.
  useEffect(() => {
    if (syncComplete.current) return;
    if (!currentPresentationId || currentPresentationId !== id) return;
    syncComplete.current = true;

    if (!(String(usePresentationState.getState().theme) in themes)) {
      setTheme("mystique" as Themes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPresentationId, id]);

  const handleGenerate = () => {
    router.push(`/presentation/${id}`);
    startPresentationGeneration();
  };

  if (currentPresentationId !== id) {
    return (
      <ThemeBackground>
        <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">No active presentation session</h2>
            <p className="text-muted-foreground">
              Start from the dashboard and generate a new presentation.
            </p>
          </div>
          <Button className="mt-6" onClick={() => router.push("/presentation")}>
            Back to dashboard
          </Button>
        </div>
      </ThemeBackground>
    );
  }
  return (
    <ThemeBackground>
      <Button
        variant="ghost"
        className="absolute left-4 top-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex flex-row justify-center">
        {/* <GoogleAdsBanner isVertical={true} /> */}

        <div className="max-w-4xl space-y-8 p-8 pt-6">
          <div className="space-y-8">
            <Header />
            <PromptInput />
            <ThinkingDisplay
              thinking={outlineThinking}
              isGenerating={isGeneratingOutline}
              title="AI is thinking about your outline..."
            />
            <ToolCallDisplay />
            <OutlineList />

            <div className="!mb-32 space-y-4 rounded-lg border bg-muted/30 p-6">
              <h2 className="text-lg font-semibold">Customize Theme</h2>
              <ThemeSettings />
            </div>
          </div>
        </div>

        {/* <GoogleAdsBanner isVertical={true} /> */}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center border-t bg-background/80 p-4 backdrop-blur-sm">
        <Button
          size="lg"
          className="gap-2 px-8"
          onClick={handleGenerate}
          disabled={isGeneratingPresentation}
        >
          <Wand2 className="h-5 w-5" />
          {isGeneratingPresentation ? "Generating..." : "Generate Presentation"}
        </Button>
      </div>
    </ThemeBackground>
  );
}
