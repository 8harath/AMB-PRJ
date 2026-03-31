"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePresentationState } from "@/states/presentation-state";
import { ChevronDown, Layout, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export function PresentationControls({
  shouldShowLabel = true,
}: {
  shouldShowLabel?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    numSlides,
    setNumSlides,
    language,
    setLanguage,
    pageStyle,
    setPageStyle,
  } = usePresentationState();

  return (
    <div className="rounded-xl border border-border bg-card/50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Options</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {numSlides} slides
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-border px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              {shouldShowLabel && (
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Slides
                </label>
              )}
              <Select
                value={String(numSlides)}
                onValueChange={(v) => setNumSlides(Number(v))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Slides" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num} slides
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              {shouldShowLabel && (
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Language
                </label>
              )}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-IN">English (India)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="gu">Gujarati</SelectItem>
                  <SelectItem value="kn">Kannada</SelectItem>
                  <SelectItem value="ml">Malayalam</SelectItem>
                  <SelectItem value="pa">Punjabi</SelectItem>
                  <SelectItem value="or">Odia</SelectItem>
                  <SelectItem value="as">Assamese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              {shouldShowLabel && (
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Style
                </label>
              )}
              <Select value={pageStyle} onValueChange={setPageStyle}>
                <SelectTrigger className="h-9">
                  <div className="flex items-center gap-2">
                    <Layout className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Style" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="tall">Tall</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
