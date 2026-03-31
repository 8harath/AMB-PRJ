"use client";

import { Button } from "@/components/ui/button";
import { presentationStorage } from "@/lib/presentation-storage";
import { usePresentationState } from "@/states/presentation-state";
import {
  Clock,
  FileText,
  Layers,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PresentationControls } from "./PresentationControls";
import { PresentationExamples } from "./PresentationExamples";
import { PresentationHeader } from "./PresentationHeader";
import { PresentationInput } from "./PresentationInput";

interface SavedPresentation {
  id: string;
  title: string;
  theme: string;
  thumbnailUrl?: string | null;
  updatedAt: string;
  slideCount: number;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function PresentationDashboard({
  sidebarSide,
}: {
  sidebarSide?: "left" | "right";
}) {
  const router = useRouter();
  const [savedPresentations, setSavedPresentations] = useState<
    SavedPresentation[]
  >([]);
  const {
    presentationInput,
    isGeneratingOutline,
    setCurrentPresentation,
    setIsGeneratingOutline,
    language,
    theme,
    setShouldStartOutlineGeneration,
  } = usePresentationState();

  const loadPresentations = () => {
    const all = presentationStorage.list();
    setSavedPresentations(
      all.map((p) => ({
        id: p.id,
        title: p.title,
        theme: p.theme,
        thumbnailUrl: p.thumbnailUrl,
        updatedAt: p.updatedAt,
        slideCount: p.content?.slides?.length ?? 0,
      })),
    );
  };

  useEffect(() => {
    setCurrentPresentation("", "");
    setIsGeneratingOutline(false);
    setShouldStartOutlineGeneration(false);
    loadPresentations();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadPresentations();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!presentationInput.trim()) {
      toast.error("Please enter a topic for your presentation");
      return;
    }

    setIsGeneratingOutline(true);

    try {
      const tempTitle =
        presentationInput.substring(0, 100) || "Untitled Presentation";
      const pres = presentationStorage.create({
        title: tempTitle,
        theme: String(theme),
        language,
        content: { slides: [] },
        outline: [],
        imageSource: "stock",
        prompt: presentationInput,
      });

      setCurrentPresentation(pres.id, pres.title);
      router.push(`/presentation/generate/${pres.id}`);
    } catch (error) {
      setIsGeneratingOutline(false);
      console.error("Error starting presentation:", error);
      toast.error("Failed to start presentation generation");
    }
  };

  const handleDelete = (id: string) => {
    presentationStorage.delete(id);
    setSavedPresentations((prev) => prev.filter((p) => p.id !== id));
    toast.success("Presentation deleted");
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-background via-background to-muted/20">
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-10">
        {/* Hero + Branding */}
        <PresentationHeader />

        {/* Main creation area */}
        <div className="space-y-4">
          <PresentationInput handleGenerate={handleGenerate} />
          <PresentationControls />

          <div className="flex items-center justify-between">
            <PresentationExamples />
          </div>

          <div className="flex justify-center pt-2">
            <Button
              onClick={handleGenerate}
              disabled={!presentationInput.trim() || isGeneratingOutline}
              variant={isGeneratingOutline ? "loading" : "default"}
              size="lg"
              className="gap-2 px-8 rounded-xl shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              <Wand2 className="h-4 w-4" />
              {isGeneratingOutline
                ? "Starting..."
                : "Generate Presentation"}
            </Button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Zap,
              label: "AI-Powered",
              desc: "Llama 3.3 70B via Groq",
            },
            {
              icon: Layers,
              label: "9 Themes",
              desc: "Pick a style that fits",
            },
            {
              icon: FileText,
              label: "Export",
              desc: "Download as PPTX",
            },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 px-4 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{f.label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Saved presentations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Presentations</h2>
            {savedPresentations.length > 0 && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                {savedPresentations.length}
              </span>
            )}
          </div>

          {savedPresentations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                No presentations yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Enter a topic above to create your first one
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {savedPresentations.map((pres) => (
                <div
                  key={pres.id}
                  className="group relative cursor-pointer rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                  onClick={() => router.push(`/presentation/${pres.id}`)}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <button
                      type="button"
                      className="rounded-lg p-1 opacity-0 transition-all hover:bg-destructive/10 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pres.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                  <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                    {pres.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo(pres.updatedAt)}</span>
                    {pres.slideCount > 0 && (
                      <>
                        <span className="text-border">|</span>
                        <span>{pres.slideCount} slides</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="inline-block rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {pres.theme}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-border/40 pt-6 pb-4 text-center">
          <p className="text-xs text-muted-foreground/50">
            Built with Groq, Next.js, and Plate.js — presentations saved in your browser
          </p>
        </footer>
      </div>
    </div>
  );
}
