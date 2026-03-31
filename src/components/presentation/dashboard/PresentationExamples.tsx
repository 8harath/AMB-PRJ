"use client";

import { usePresentationState } from "@/states/presentation-state";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export const EXAMPLE_PROMPTS = [
  { id: "ai-future", icon: "⚡", title: "The Future of Artificial Intelligence in Engineering" },
  { id: "sustainable-materials", icon: "🌍", title: "Sustainable Materials for Construction" },
  { id: "project-management", icon: "🎯", title: "Best Practices for Project Management" },
  { id: "robotics", icon: "🤖", title: "Advancements in Robotics and Automation" },
  { id: "renewable-energy", icon: "🌱", title: "Innovations in Renewable Energy" },
  { id: "cybersecurity", icon: "🔒", title: "Cybersecurity in Modern Systems" },
  { id: "smart-cities", icon: "🌆", title: "Smart Cities: Future of Urban Development" },
  { id: "quantum-computing", icon: "⚛️", title: "Quantum Computing Applications" },
  { id: "biotech", icon: "🧬", title: "Biotechnology Innovations" },
  { id: "space-tech", icon: "🚀", title: "Space Technology Challenges" },
  { id: "digital-twins", icon: "👥", title: "Digital Twins in Modern Engineering" },
  { id: "machine-learning", icon: "🧠", title: "Machine Learning for Optimization" },
  { id: "startup-pitch", icon: "💡", title: "How to Build a Winning Startup Pitch Deck" },
  { id: "climate-change", icon: "🌡️", title: "Climate Change: Data, Impact, and Solutions" },
  { id: "product-launch", icon: "🎉", title: "Product Launch Strategy and Go-to-Market Plan" },
  { id: "remote-work", icon: "🏠", title: "The Future of Remote Work and Hybrid Teams" },
];

export function PresentationExamples() {
  const [examples, setExamples] = useState(EXAMPLE_PROMPTS.slice(0, 8));
  const { setPresentationInput } = usePresentationState();

  const handleShuffle = () => {
    const shuffled = [...EXAMPLE_PROMPTS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
    setExamples(shuffled);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Try an example
        </p>
        <button
          type="button"
          onClick={handleShuffle}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Shuffle
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setPresentationInput(example.title)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          >
            <span>{example.icon}</span>
            <span className="max-w-[200px] truncate">{example.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
