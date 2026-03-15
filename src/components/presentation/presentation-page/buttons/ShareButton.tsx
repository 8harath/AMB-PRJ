"use client";

import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { toast } from "sonner";

export function ShareButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
      onClick={() =>
        toast.info("Sharing is unavailable in instant mode because presentations are not saved.")
      }
    >
      <Share className="mr-1 h-4 w-4" />
      Share
    </Button>
  );
}
