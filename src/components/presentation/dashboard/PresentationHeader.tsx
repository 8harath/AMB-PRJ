"use client";

import { ThemeToggle } from "@/provider/theme-provider";
import { Presentation } from "lucide-react";

export function PresentationHeader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Presentation className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">ALLWEONE</span>
        </div>
        <ThemeToggle />
      </div>
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Create presentations{" "}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Describe any topic and get a polished slide deck in seconds.
          Powered by Llama 3.3 70B.
        </p>
      </div>
    </div>
  );
}
