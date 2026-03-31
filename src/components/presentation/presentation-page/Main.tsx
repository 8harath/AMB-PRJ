"use client";

import { type PlateSlide } from "@/components/presentation/utils/parser";
import { presentationStorage } from "@/lib/presentation-storage";
import {
  setThemeVariables,
  type ThemeProperties,
  type Themes,
  themes,
} from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoadingState } from "./Loading";
import { PresentationLayout } from "./PresentationLayout";
import { PresentationSlidesView } from "./PresentationSlidesView";

function normalizeOutline(outline: unknown): string[] {
  if (!Array.isArray(outline)) {
    return [];
  }

  return outline.filter((item): item is string => typeof item === "string");
}

export default function PresentationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { resolvedTheme } = useTheme();
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const setCurrentPresentation = usePresentationState(
    (s) => s.setCurrentPresentation,
  );
  const setPresentationInput = usePresentationState(
    (s) => s.setPresentationInput,
  );
  const setOutline = usePresentationState((s) => s.setOutline);
  const setSlides = usePresentationState((s) => s.setSlides);
  const setThumbnailUrl = usePresentationState((s) => s.setThumbnailUrl);
  const isGeneratingPresentation = usePresentationState(
    (s) => s.isGeneratingPresentation,
  );
  const setTheme = usePresentationState((s) => s.setTheme);
  const setImageSource = usePresentationState((s) => s.setImageSource);
  const setPresentationStyle = usePresentationState(
    (s) => s.setPresentationStyle,
  );
  const setLanguage = usePresentationState((s) => s.setLanguage);
  const theme = usePresentationState((s) => s.theme);
  const currentPresentationId = usePresentationState((s) => s.currentPresentationId);
  const currentPresentationTitle = usePresentationState((s) => s.currentPresentationTitle);
  const presentationInput = usePresentationState((s) => s.presentationInput);
  const outline = usePresentationState((s) => s.outline);
  const slides = usePresentationState((s) => s.slides);
  const config = usePresentationState((s) => s.config);

  const syncedRef = useRef(false);

  // Load from localStorage if the presentation isn't in Zustand state
  useEffect(() => {
    if (currentPresentationId === id) {
      syncedRef.current = true;
      return;
    }

    setIsLoadingFromStorage(true);
    setLoadError(null);

    const stored = presentationStorage.get(id);
    if (stored) {
      setCurrentPresentation(id, stored.title);
      setPresentationInput(stored.prompt || stored.title);
      setOutline(normalizeOutline(stored.outline));
      if (stored.theme && stored.theme in themes) {
        setTheme(stored.theme as Themes);
      }
      if (stored.language) setLanguage(stored.language);
      if (stored.presentationStyle) setPresentationStyle(stored.presentationStyle);
      if (stored.imageSource) setImageSource(stored.imageSource as "ai" | "stock");
      if (stored.thumbnailUrl) setThumbnailUrl(stored.thumbnailUrl);

      if (stored.content?.slides && stored.content.slides.length > 0) {
        setSlides(stored.content.slides);
      }
      if (stored.content?.config) {
        usePresentationState.getState().setConfig(stored.content.config);
      }
    } else {
      setLoadError("Presentation not found");
    }

    syncedRef.current = true;
    setIsLoadingFromStorage(false);
  }, [id, currentPresentationId]);

  // Validate theme once after initial sync
  useEffect(() => {
    if (!syncedRef.current || currentPresentationId !== id) return;
    if (!(String(theme) in themes)) {
      setTheme("mystique" as Themes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPresentationId, id]);

  // Set theme variables when theme changes
  useEffect(() => {
    if (theme && resolvedTheme) {
      const state = usePresentationState.getState();
      if (state.customThemeData) {
        setThemeVariables(state.customThemeData, resolvedTheme === "dark");
      } else if (typeof theme === "string" && theme in themes) {
        const currentTheme = themes[theme as keyof typeof themes];
        if (currentTheme) {
          setThemeVariables(currentTheme, resolvedTheme === "dark");
        }
      }
    }
  }, [theme, resolvedTheme]);

  const currentThemeData = (() => {
    const state = usePresentationState.getState();
    if (state.customThemeData) {
      return state.customThemeData;
    }
    if (typeof theme === "string" && theme in themes) {
      return themes[theme as keyof typeof themes];
    }
    return null;
  })();

  if (isLoadingFromStorage) {
    return <LoadingState />;
  }

  if (loadError && currentPresentationId !== id) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center gap-3">
        <h2 className="text-2xl font-semibold">Presentation not found</h2>
        <p className="text-center text-muted-foreground">{loadError}</p>
        <button
          type="button"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => router.push("/presentation")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (currentPresentationId !== id) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center gap-3">
        <h2 className="text-2xl font-semibold">No active presentation session</h2>
        <p className="text-center text-muted-foreground">
          Start a new one from the dashboard.
        </p>
      </div>
    );
  }

  return (
    <PresentationLayout
      isLoading={false}
      themeData={currentThemeData ?? undefined}
    >
      <div className="mx-auto max-w-[90%] space-y-8 pt-16">
        <div className="space-y-8">
          <PresentationSlidesView
            isGeneratingPresentation={isGeneratingPresentation}
          />
        </div>
      </div>
    </PresentationLayout>
  );
}
