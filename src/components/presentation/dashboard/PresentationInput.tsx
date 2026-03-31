"use client";

import { usePresentationState } from "@/states/presentation-state";
import { Send } from "lucide-react";
import { WebSearchToggle } from "./WebSearchToggle";

export function PresentationInput({
  handleGenerate,
}: {
  handleGenerate: () => void;
}) {
  const { presentationInput, setPresentationInput, isGeneratingOutline } =
    usePresentationState();

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={presentationInput}
          onChange={(e) => setPresentationInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder="e.g. The impact of artificial intelligence on healthcare in 2025..."
          rows={4}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3.5 pb-14 text-base text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
        />

        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WebSearchToggle />
            <span className="text-xs text-muted-foreground/50">
              {presentationInput.length > 0 && `${presentationInput.length} chars`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
              Ctrl+Enter
            </kbd>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!presentationInput.trim() || isGeneratingOutline}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
