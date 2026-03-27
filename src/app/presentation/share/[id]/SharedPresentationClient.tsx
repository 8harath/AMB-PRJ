"use client";

import {
  setThemeVariables,
  themes,
  type Themes,
} from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { type PlateSlide } from "@/components/presentation/utils/parser";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import Link from "next/link";
import { PresentationLayout } from "@/components/presentation/presentation-page/PresentationLayout";
import { PresentationSlidesView } from "@/components/presentation/presentation-page/PresentationSlidesView";

interface SharedPresentationClientProps {
  title: string;
  theme: string;
  slides: unknown[];
}

export function SharedPresentationClient({
  title,
  theme,
  slides,
}: SharedPresentationClientProps) {
  const { resolvedTheme } = useTheme();
  const setCurrentPresentation = usePresentationState((s) => s.setCurrentPresentation);
  const setSlides = usePresentationState((s) => s.setSlides);
  const setThemeState = usePresentationState((s) => s.setTheme);
  const currentTheme = usePresentationState((s) => s.theme);

  useEffect(() => {
    setCurrentPresentation(`shared-${Date.now()}`, title);
    setSlides(slides as PlateSlide[]);
    if (theme && theme in themes) {
      setThemeState(theme as Themes);
    }
  }, [title, theme, slides, setCurrentPresentation, setSlides, setThemeState]);

  useEffect(() => {
    if (currentTheme && resolvedTheme) {
      if (typeof currentTheme === "string" && currentTheme in themes) {
        const themeData = themes[currentTheme as keyof typeof themes];
        if (themeData) {
          setThemeVariables(themeData, resolvedTheme === "dark");
        }
      }
    }
  }, [currentTheme, resolvedTheme]);

  const currentThemeData =
    typeof currentTheme === "string" && currentTheme in themes
      ? themes[currentTheme as keyof typeof themes]
      : null;

  if (slides.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-semibold">Empty Presentation</h1>
        <p className="text-muted-foreground">This presentation has no slides yet.</p>
        <Link
          href="/presentation"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <PresentationLayout
      isLoading={false}
      themeData={currentThemeData ?? undefined}
    >
      <div className="mx-auto max-w-[90%] space-y-8 pt-16">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <PresentationSlidesView isGeneratingPresentation={false} />
      </div>
    </PresentationLayout>
  );
}
